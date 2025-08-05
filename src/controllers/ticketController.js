import { jiraConfig } from "../config/jiraConfig.js";
import { geminiResponse } from "../services/geminiService.js";
import { createJiraTicket, getAllUsers, getIssueTypes, getProjectKeys } from "../services/jiraService.js";
import { extractJson } from '../utils/extractJson.js';
import { isTicketRequest } from "../utils/isTicketRequest.js";

export const createTicketFromPrompt = async (req, res) => {
    const prompt = req.body.prompt;
    console.log("Prompt:", prompt);

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    const wantsTicket = isTicketRequest(prompt);
    console.log("Is ticket request? ", wantsTicket);

    try {
        if (wantsTicket) {
            const promptLower = prompt.toLowerCase().trim();
            const isUnclear = (
                promptLower === 'create a bug ticket' ||
                promptLower === 'raise a bug' ||
                promptLower === 'create ticket' ||
                !prompt.includes(':') && prompt.length < 25
            );

            if (isUnclear) {
                return res.status(400).json({
                    message: "Please describe the ticket in more detail. Include the error/task message, steps to produce/reproduce, and expected vs actual behavior.",
                    status: "need_more_info"
                });
            }
            const validIssueTypes = await getIssueTypes();
            console.log("Valid issue types: ", validIssueTypes.join(', '));

            const gemini = await geminiResponse(`Given this prompt: "${prompt}",
            Reply ONLY with JSON: 
            {
                "summary": "...", 
                "description": "...",
                "issuetype": "...",
                "project": "...",
                "assignee": "..."
            }`);
            const text = gemini.response.text();

            let generated;
            console.log("Gemini raw response text: ", text);
            try {
                generated = extractJson(text);
                console.log("Parsed JSON from Gemini:", generated);
            } catch (error) {
                console.error("Failed to parse Gemini response:", gemini.response.text());
                return res.status(400).json({ error: "Failed to parse the Gemini response" });
            }

            // Validate IssueType
            const normalizedIssueTypes = validIssueTypes.map(t => t.toLowerCase().trim());
            const suggested = (generated.issuetype || '').toLowerCase().trim();
            const issueType = normalizedIssueTypes.includes(suggested) ? generated.issuetype : 'Task';

            // Validate project
            let projectKey = generated.project ? generated.project.trim().toUpperCase() : null;
            const validProjects = await getProjectKeys();

            if (!validProjects.includes(projectKey)) {
                console.log("Unknown or missing project, defaulting to BOT");
                projectKey = "BOT";
            }

            // Get all users and map assignee
            const allUsers = await getAllUsers() || [];
            const assigneeName = (generated.assignee || '').toLowerCase().trim();
            const foundUser = assigneeName
                ? allUsers.find(user =>
                    user.displayName.toLowerCase().includes(assigneeName) ||
                    user.emailAddress?.toLowerCase() === assigneeName
                )
                : null;
            const assigneeId = foundUser ? foundUser.accountId : null;
            console.log("All users from Jira:", allUsers.map(u => u.displayName));

            if (!foundUser && assigneeName) {
                console.log(`Unknown assignee "${assigneeName}", will create ticket without assignee`);
            }

            // Create JIRA Ticket (without team)
            const jiraTicket = await createJiraTicket({
                summary: generated.summary,
                description: generated.description,
                issueType,
                projectKey,
                assigneeId: assigneeId || null
            });

            const ticketUrl = `${jiraConfig.baseUrl}/browse/${jiraTicket.key}`;
            res.json({
                message: "Ticket created successfully",
                ticket: jiraTicket,
                ticketUrl
            });
        } else {
            // Normal chat mode
            const gemini = await geminiResponse(prompt);
            const answer = gemini.response.text();
            console.log("Response : ", answer);
            return res.json({ answer });
        }
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({ error: "Something went wrong" });
    }
};
