import { geminiResponse } from "../services/geminiService.js";
import { createJiraTicket } from "../services/jiraService.js";
import { extractJson } from '../utils/extractJson.js';

export const createTicketFromPrompt = async(req, res) => {
    const prompt = req.body.question;

    if(!prompt){
        return res.status(400).json({error: 'Question is required'});
    };

    try {
        const gemini = await geminiResponse(`Given this prompt: "${prompt}",
            Reply ONLY with JSON: 
            {"summary": "...", "description": "..."}`);
        const text = gemini.response.text();
        let generated;
        console.log("Text: ", text);
        try {
            generated = extractJson(text);
            console.log("Generated: ", generated);
        } catch (error) {
            console.error("Gemini raw text:", gemini.response.text());
            return res.status(400).json({error: "Failed to parse the Gemini response"});
        }

        // Create JIRA Ticket
        const jiraTicket = await createJiraTicket({
            summary: generated.summary,
            description: generated.description
        });

        res.json({message: "Ticket created successfully", ticket: jiraTicket});
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({error: "Something went wrong"});
    }
};