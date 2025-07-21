// This file is only for general purpose 
import express from 'express';
import {geminiResponse} from '../services/geminiService.js'

const router = express.Router();

router.post('/geminiresponse', async (req, res) => {
    const prompt = req.body.message;
    console.log("Prompt: ", prompt);
    if(!prompt){
        return res.status(400).json({ error: "Prompt is required." });
    }
    const result = await geminiResponse(prompt);
    res.send(result.response.text());
});

export default router;