/ src/app/api/ai/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { documentContent, message } = await req.json();

    if (!documentContent || !message) {
      return new NextResponse('Missing document content or message', { status: 400 });
    }

    const prompt = `You are a helpful assistant. Answer the user's question about the following document:\n\n${documentContent}\n\nUser question: ${message}\n`;

    const stream = await generate(prompt);
    return new NextResponse(stream);

  } catch (error) {
    console.error("AI processing failed:", error);
    return new NextResponse('AI processing failed', { status: 500 });
  }
}

async function generate(prompt: string) {
  const encoder = new TextEncoder();
  const controller = new TransformStream();
  const writer = controller.writable.getWriter();
  const url = 'http://127.0.0.1:1234/v1/chat/completions'; // LM Studio URL - updated to the local address

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'hermes-3-llama-3.2-3b', // LM Studio Model - updated to hermes-3-llama-3.2-3b
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      }),
      //   signal: controller.signal,
    });

    if (!response.ok) {
      console.error('LM Studio API Error:', response.status, response.statusText);
      throw new Error(`LM Studio API error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('ReadableStream not available');
    }

    let accumulatedResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const text = new TextDecoder().decode(value);
      accumulatedResponse += text;
      const cleanedText = text.replace(/data: /g, '').replace(/\\n/g, '\n').trim();

      if (cleanedText && cleanedText !== '[DONE]') {
        try {
          const json = JSON.parse(cleanedText);
          const content = json.choices[0].delta.content;

          if (content) {
            const encoded = encoder.encode(content);
            await writer.ready;
            await writer.write(encoded);
          }
        } catch (parseError) {
          console.error('JSON parse error:', parseError, 'with payload:', cleanedText);
        }
      }
    }
  } catch (error) {
    console.error('Streaming error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const encoded = encoder.encode(`Error: ${errorMessage}`);
    await writer.ready;
    await writer.write(encoded);
    await writer.close();
  } finally {
    if (writer) {
      await writer.close();
    }
  }

  return controller.readable;
}
