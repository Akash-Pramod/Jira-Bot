import { jiraConfig } from "../config/jiraConfig.js";
import { geminiResponse } from "../services/geminiService.js";
import { createJiraTicket, getIssueTypes, getProjectKeys } from "../services/jiraService.js";
import { extractJson } from '../utils/extractJson.js';
import { isTicketRequest } from "../utils/isTicketRequest.js";

export const createTicketFromPrompt = async (req, res) => {
    const prompt = req.body.question;
    console.log("Prompt:", prompt);

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    };

    const wantsTicket = isTicketRequest(prompt);
    console.log("Is ticket request? ", wantsTicket);

    try {
        if (wantsTicket) {
            const validIssueTypes = await getIssueTypes();
            console.log("Valid issue types: ", validIssueTypes.join(', '));
            const gemini = await geminiResponse(`Given this prompt: "${prompt}",
            Reply ONLY with JSON: 
            {
            "summary": "...", 
            "description": "...",
            "issuetype": "..." 
            "project": "..." 
            }`);
            const text = gemini.response.text();

            // parse gemini response
            let generated;
            console.log("Gemini raw response text: ", text);
            try {
                generated = extractJson(text);
                console.log("Parsed JSON from Gemini:", generated);
            } catch (error) {
                console.error("Gemini raw error text:", gemini.response.text());
                return res.status(400).json({ error: "Failed to parse the Gemini response" });
            }

            // Validate Issue
            const normalizedIssueTypes = validIssueTypes.map(t => t.toLowerCase().trim());
            const suggested = (generated.issuetype || '').toLowerCase().trim();
            const issueType = normalizedIssueTypes.includes(suggested) ? generated.issuetype : 'Task';

            // Validate project
            let projectKey = generated.project ? generated.project.trim().toUpperCase() : null;
            const validProjects = await getProjectKeys();

            if (!validProjects.includes(projectKey)) {
                console.log("Unknown or missing project, will create ticket without project");
                projectKey = "BOT";
            }

            // Create JIRA Ticket
            const jiraTicket = await createJiraTicket({
                summary: generated.summary,
                description: generated.description,
                issueType,
                projectKey
            });

            // created ticket url
            const ticketUrl = `${jiraConfig.baseUrl}/browse/${jiraTicket.key}`
            res.json({
                message: "Ticket created successfully",
                ticket: jiraTicket,
                ticketUrl
            });
        } else {
            // Normal chat mode
            const gemini = await geminiResponse(prompt);
            const answer = gemini.response.text();
            return res.json({ answer });
        }
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({ error: "Something went wrong" });
    }
};