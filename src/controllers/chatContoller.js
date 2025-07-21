import { geminiResponse } from '../services/geminiService.js'

export const askGeneralQuestion = async (req, res) => {
    try {
        const prompt = req.body.question;
        console.log("User prompt: ", prompt);

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const result = await geminiResponse(prompt);
        res.json({ answer: result.response.text() }); // Response in json format
        // res.send(result.response.text()); // Response without json format
    } catch (error) {
        console.error("Error in askGeneralQuestion: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};