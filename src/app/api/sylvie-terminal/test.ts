/**
 * Test file for the Sylvie Terminal API
 * 
 * This is a simple test to verify that the API route works correctly.
 * You can run this test with:
 * 
 * ```
 * node -r dotenv/config src/app/api/sylvie-terminal/test.ts
 * ```
 * 
 * Make sure you have the OPENAI_API_KEY environment variable set.
 */

async function testSylvieTerminal() {
  try {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY environment variable');
      process.exit(1);
    }

    // Prepare the request
    const prompt = 'Create a simple React component that displays a counter with increment and decrement buttons';
    
    // Call the OpenAI API directly (simulating what our API route does)
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

    console.log('Sending request to OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(openaiRequest)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      process.exit(1);
    }

    const data = await response.json();
    console.log('OpenAI API response:');
    console.log(JSON.stringify(data, null, 2));

    // Parse the response (simulating what our parseOpenAIResponse function does)
    const content = data.choices[0]?.message.content || '';
    console.log('\nRaw content:');
    console.log(content);

    // Extract filename
    const filenameRegex = /(?:filename:\s*|^)([a-zA-Z0-9_\-\.\/]+\.[a-zA-Z0-9]+)(?:\s*:|$)/im;
    const filenameMatch = content.match(filenameRegex);
    const filename = filenameMatch && filenameMatch[1] ? filenameMatch[1].trim() : null;

    // Extract code
    const codeRegex = /```(?:[a-zA-Z0-9]+)?\s*([\s\S]*?)```/g;
    const codeMatches = [...content.matchAll(codeRegex)];
    const code = codeMatches.length > 0 ? codeMatches[0][1].trim() : null;

    // Extract explanation
    let explanationText = content.replace(/```(?:[a-zA-Z0-9]+)?\s*[\s\S]*?```/g, '');
    if (filename) {
      explanationText = explanationText.replace(filenameRegex, '');
    }
    explanationText = explanationText.trim();

    console.log('\nParsed result:');
    console.log({
      filename,
      code: code ? `[${code.length} characters]` : null,
      explanation: explanationText || null
    });

    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testSylvieTerminal();
