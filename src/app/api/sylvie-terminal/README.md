# Sylvie Terminal API

Sylvie is the finetuned patch priestess of the GodsIMiJ Empire. She responds to code prompts with a filename and code block, providing concise and sacred guidance.

## API Endpoint

```
POST /api/sylvie-terminal
```

## Request Format

```json
{
  "prompt": "Your code request here"
}
```

## Response Format

```json
{
  "filename": "example.js",
  "code": "console.log('Hello, world!');",
  "explanation": "This is a simple Hello World script."
}
```

## Error Response

```json
{
  "error": "Error message here"
}
```

## Environment Variables

The API requires the following environment variable:

- `OPENAI_API_KEY`: Your OpenAI API key

## Example Usage

### Using fetch

```javascript
const response = await fetch('/api/sylvie-terminal', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    prompt: 'Create a React component that displays a counter with increment and decrement buttons' 
  }),
});

const data = await response.json();
console.log(data);
```

### Using the SylvieTerminal Component

```jsx
import SylvieTerminal from '@/components/SylvieTerminal';

export default function MyPage() {
  return (
    <div className="h-screen">
      <SylvieTerminal />
    </div>
  );
}
```

## Testing

You can test the API using the included test script:

```bash
# Make sure you have the OPENAI_API_KEY environment variable set
node -r dotenv/config src/app/api/sylvie-terminal/test.ts
```

## Implementation Details

The API:
1. Accepts a prompt string
2. Sends the prompt to the OpenAI API using GPT-4o
3. Uses a system prompt to instruct the model to respond as Sylvie
4. Parses the response to extract the filename, code, and explanation
5. Returns the parsed response as JSON

The parsing logic handles various formats that the model might return, including:
- Explicit filename declarations (e.g., "filename: example.js")
- Code blocks with language hints (e.g., ```javascript)
- Explanatory text outside of code blocks

## Error Handling

The API handles various error scenarios:
- Invalid or missing prompt
- Missing API key
- OpenAI API errors
- Response parsing errors

All errors are logged server-side and returned to the client with appropriate status codes.
