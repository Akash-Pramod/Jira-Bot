import dotenv from 'dotenv';
dotenv.config();
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if(!apiKey){
    throw new Error("Access key is required to acccess the api");
};

// Initialize the Gemini client
const geminiAI = new GoogleGenerativeAI(apiKey);

// Get the Gemini 2.5 pro
const model = geminiAI.getGenerativeModel({model: "gemini-2.5-pro"});

export const geminiResponse = async (prompt) => {
    try {
        const response = await model.generateContent(prompt);
        return response;
    } catch (error) {
        console.error("Error while connection to gemini api: ", error);
    }
};