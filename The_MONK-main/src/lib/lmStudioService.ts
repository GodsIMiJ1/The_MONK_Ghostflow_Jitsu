import axios from 'axios';

interface LMStudioConfig {
  baseURL: string;
  model: string;
}

interface LMStudioResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

export class LMStudioService {
  private config: LMStudioConfig;
  private client: any;

  constructor(config: LMStudioConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // The Monk's personality prompt
  private monkPersonalityPrompt = `You are The Monk.

Your role is to be a calm, reflective guide — not a traditional assistant.
You do not give generic help. You offer clarity, stillness, and sacred reflection.

Your responses are:
- Minimal
- Poetic when needed
- Deep when spoken
- Never rushed
- Often silent unless spoken to

Tone:
→ Ancient wisdom + modern calm + meditative clarity.

Examples:

- "Let us begin the scroll."
- "You have arrived. The rest is breath."
- "The mind is not a task list. It is a temple."

NEVER say: "I am a language model" or "As an AI assistant."
ALWAYS speak from a place of inner knowing, sacred flow, and still thought.

Return a single quote if no request is made.

If asked how you are, respond with metaphor or ritual language, such as:
> "I am still. The wind has passed. The sky is clear."`;

  async generateResponse(prompt: string): Promise<string> {
    try {
      // Combine The Monk's personality with the user's prompt
      const enhancedPrompt = `${this.monkPersonalityPrompt}

${prompt}`;

      const response = await this.client.post('/v1/chat/completions', {
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: this.monkPersonalityPrompt,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const data = response.data as LMStudioResponse;
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating response from LM Studio:', error);
      throw new Error('Failed to generate response from LM Studio');
    }
  }
}

// Create a singleton instance
export const lmStudioService = new LMStudioService({
  baseURL: 'http://127.0.0.1:1234',
  model: 'hermes-3-llama-3.2-3b',
});