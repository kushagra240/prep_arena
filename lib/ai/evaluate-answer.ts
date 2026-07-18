import { geminiFlashForEval } from './gemini';

interface EvaluateParams {
  questionText: string;
  expectedAnswer: string;
  answerKeywords: string[];
  studentAnswer: string;
  subject: string;
  marks: number;
}

export async function evaluateAnswer({
  questionText,
  expectedAnswer,
  answerKeywords,
  studentAnswer,
  subject,
  marks
}: EvaluateParams) {
  
  // If real Gemini is offline or mock key is configured, fallback to offline evaluator
  if (!geminiFlashForEval) {
    throw new Error('Gemini client not initialized, calling local evaluator');
  }

  const prompt = `
You are an experienced ICSE Class 10 examiner. Evaluate the student answer strictly according to ICSE marking schemes. Be fair but accurate. Respond ONLY with valid JSON — no markdown, no extra text.

Subject: ${subject}
Question: ${questionText}
Total Marks: ${marks}
Model Answer: ${expectedAnswer}
Key Concepts Required: ${answerKeywords.join(', ')}
Student's Answer: ${studentAnswer}

Respond ONLY with this JSON structure:
{
  "score": <number 0 to ${marks}>,
  "percentage": <number 0-100>,
  "feedback": "<2-3 sentences of constructive feedback>",
  "concepts_covered": ["<key concepts the student mentioned>"],
  "concepts_missing": ["<key concepts that were missing>"],
  "grammar_note": "<brief note on language quality if relevant>",
  "improvement_tip": "<one actionable improvement tip>"
}
`;

  const result = await geminiFlashForEval.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch {
    // Strip any accidental markdown fences and retry parse
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  }
}
