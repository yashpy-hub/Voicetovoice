// server/geminiClient.js
'use strict';

require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

// Diagnostic log to check for API key
if (!process.env.GEMINI_API_KEY) {
  console.error('FATAL ERROR: GEMINI_API_KEY is not defined in your .env file');
} else {
  console.log('GEMINI_API_KEY loaded successfully.');
}

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 🧠 Gemini question generator
async function generateQuestions(jobRole) {
  const prompt = `
You are an interviewer. Generate 5 interview questions for a "${jobRole}" position.
Return the questions as a JSON array of strings.
`;

  try {
    console.log(`Requesting questions for model: gemini-1.5-flash (using legacy syntax)`);
    const result = await genAI.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });
    const response = await result.response;
    const text = response.text();
    
    console.log('Successfully received response from Gemini.');

    // Extract the JSON array from the response
    const jsonMatch = text.match(/(\[[\s\S]*\])/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Failed to parse JSON response from Gemini.');
    }
  } catch (error) {
    console.error('Error in generateQuestions:', error);
    // Throw a more specific error to be caught by the route handler
    throw new Error(`Failed to generate questions from Gemini API. Reason: ${error.message}`);
  }
}

module.exports = { generateQuestions };
