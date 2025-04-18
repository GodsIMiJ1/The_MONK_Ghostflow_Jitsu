import { NextRequest, NextResponse } from 'next/server';

// Define the expected response structure
interface SylvieResponse {
  filename?: string;
  code?: string;
  explanation?: string;
  error?: string;
}

// Define the OpenAI API response structure
interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    logprobs: null;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Extract prompt from request body
    const { prompt } = await request.json();

    // Validate prompt
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt. Please provide a valid string.' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('Missing OpenAI API key');
      return NextResponse.json(
        { error: 'Server configuration error: Missing API key' },
        { status: 500 }
      );
    }

    // Prepare the request to OpenAI
    const openaiRequest = {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are Sylvie, the finetuned patch priestess of the GodsIMiJ Empire. Respond to code prompts with a filename and code block inside triple backticks. Be concise and sacred in tone.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2048
    };

    // Call the OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(openaiRequest)
    });

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: `OpenAI API error: ${errorData.error?.message || response.statusText}` },
        { status: response.status }
      );
    }

    // Parse the response
    const data = await response.json() as OpenAIResponse;
    const content = data.choices[0]?.message.content || '';

    // Parse the response to extract filename, code, and explanation
    const result: SylvieResponse = parseOpenAIResponse(content);

    // Return the parsed response
    return NextResponse.json(result);
  } catch (error: any) {
    // Log the error for server-side debugging
    console.error('Error processing Sylvie terminal request:', error);

    // Return a structured error response
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

/**
 * Parse the OpenAI response to extract filename, code, and explanation
 */
function parseOpenAIResponse(content: string): SylvieResponse {
  try {
    // Initialize the result
    const result: SylvieResponse = {};

    // Extract filename - look for patterns like "filename: xyz.js" or "xyz.js:"
    const filenameRegex = /(?:filename:\s*|^)([a-zA-Z0-9_\-\.\/]+\.[a-zA-Z0-9]+)(?:\s*:|$)/im;
    const filenameMatch = content.match(filenameRegex);
    if (filenameMatch && filenameMatch[1]) {
      result.filename = filenameMatch[1].trim();
    }

    // Extract code - look for code blocks with triple backticks
    const codeRegex = /```(?:[a-zA-Z0-9]+)?\s*([\s\S]*?)```/g;
    const codeMatches = [...content.matchAll(codeRegex)];
    if (codeMatches.length > 0) {
      result.code = codeMatches[0][1].trim();
    }

    // Extract explanation - anything outside the code blocks that's not the filename
    // First, remove all code blocks
    let explanationText = content.replace(/```(?:[a-zA-Z0-9]+)?\s*[\s\S]*?```/g, '');
    
    // Then remove the filename line if it exists
    if (result.filename) {
      explanationText = explanationText.replace(filenameRegex, '');
    }
    
    // Clean up the explanation
    explanationText = explanationText.trim();
    if (explanationText) {
      result.explanation = explanationText;
    }

    // If we couldn't parse the response properly, return the full content as explanation
    if (!result.filename && !result.code) {
      result.explanation = content;
    }

    return result;
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    return {
      error: 'Failed to parse the response',
      explanation: content // Return the full content as explanation
    };
  }
}
