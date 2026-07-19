import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyMockKeyForGeminiAPIExecution1234';
const hasRealKey = apiKey && !apiKey.includes('MockKey');

const genAI = new GoogleGenerativeAI(apiKey);

interface ExplanationParams {
  questionText: string;
  correctAnswer: string;
  subject: string;
  chapter: string;
  problemType: 'mcq' | 'brief_writing';
  mcqOptions?: { id: string; text: string }[] | null;
}

export async function generateExplanationStream({
  questionText,
  correctAnswer,
  subject,
  chapter,
  problemType,
  mcqOptions
}: ExplanationParams) {
  
  if (!hasRealKey) {
    throw new Error('Gemini key not configured, triggering fallback emulator');
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 2000,
    }
  });

  const optionsSection = problemType === 'mcq' && mcqOptions
    ? `\nAll Options:\n${mcqOptions.map(o => `- ${o.id}: ${o.text}`).join('\n')}`
    : '';

  const prompt = `
You are a brilliant ICSE Class 10 tutor known for making complex concepts simple and memorable. Use analogies, mnemonics, and step-by-step breakdowns. Format your response in Markdown.

Subject: ${subject} | Chapter: ${chapter}
Question: ${questionText}${optionsSection}
Correct Answer: ${correctAnswer}

Provide a complete explanation with these exact sections:

## 💡 Concept Explained Simply
Explain the underlying concept in plain language a 15-year-old would understand. Use a relatable analogy if possible.

## 🔢 Step-by-Step Solution
Walk through exactly how to arrive at the correct answer, step by step.

${problemType === 'mcq' ? `## ❌ Why Other Options Were Wrong\nExplain the trap or misconception in each incorrect option.\n` : ''}

## 📝 ICSE Exam Tip
What examiners specifically look for in this topic. Include keywords that must appear in answers.

## 🧠 Remember This
A mnemonic, analogy, or memory trick to never forget this concept.

## 🔗 Related Concepts
2-3 connected topics to revise next.
`;

  const streamResult = await model.generateContentStream(prompt);
  return streamResult;
}
