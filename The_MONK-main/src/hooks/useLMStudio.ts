import { useState } from 'react';
import { lmStudioService } from '@/lib/lmStudioService';

interface UseLMStudioReturn {
  generateResponse: (prompt: string) => Promise<string>;
  isLoading: boolean;
  error: Error | null;
}

export function useLMStudio(): UseLMStudioReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateResponse = async (prompt: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await lmStudioService.generateResponse(prompt);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateResponse,
    isLoading,
    error,
  };
} 