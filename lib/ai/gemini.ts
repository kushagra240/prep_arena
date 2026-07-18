import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyMockKeyForGeminiAPIExecution1234';
const hasRealKey = apiKey && !apiKey.includes('MockKey');

const genAI = new GoogleGenerativeAI(apiKey);

// Low temp + JSON formatting strictly enforced for marking answer scoring
export const geminiFlashForEval = hasRealKey 
  ? genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
        maxOutputTokens: 1000,
        responseMimeType: 'application/json'
      }
    })
  : null;

// Medium temp for streaming descriptive student tutorials/analogies
export const geminiFlash = hasRealKey
  ? genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.5,
        topP: 0.9,
        maxOutputTokens: 1800
      }
    })
  : null;
