import { generateExplanationStream } from '@/lib/ai/generate-explanation';

export async function POST(req: Request) {
  // Graceful Auth Check
  let userId = 'user-id-mock-student';
  try {
    if (process.env.CLERK_SECRET_KEY && !process.env.CLERK_SECRET_KEY.includes('mock')) {
      const { auth } = require('@clerk/nextjs/server');
      const session = auth();
      if (session && session.userId) {
        userId = session.userId;
      }
    }
  } catch (err) {
    console.warn('Clerk auth resolution warning in explanation streaming.');
  }

  try {
    const body = await req.json();
    const streamResult = await generateExplanationStream(body);

    // Convert Gemini's async generator to a ReadableStream
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of streamResult.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      }
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    });
  } catch (error) {
    console.warn('Gemini stream failed or key missing, falling back to client-side emulator:', error);
    return new Response('AI stream not available, triggering high-fidelity local simulator.', { status: 503 });
  }
}
