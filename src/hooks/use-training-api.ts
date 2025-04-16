'use server';

/**
 * @fileOverview A training and fine-tuning API hook.
 *
 * - useTrainingApi - A function that handles the API calling process.
 * - TrainingApiInput - The input type for the trainingApi function.
 * - TrainingApiOutput - The return type for the trainingApi function.
 */

import {useState, useCallback} from 'react';

interface TrainingApiInput {
  modelName: string;
  trainingDataFile: File; // Changed to File object
  apiKey: string;
}

interface TrainingApiOutput {
  jobId: string;
  status: string;
  message: string;
  modelName: string; // ✅ Add this line
}

const writeTempleCodexLog = async (entry: TrainingApiOutput) => {
  try {
    await fetch('/api/temple-codex/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        model: entry.modelName,
        jobId: entry.jobId,
        status: entry.status,
        message: entry.message,
      }),
    });
    console.log("Temple Codex log written successfully.");
  } catch (error) {
    console.error("Failed to write Temple Codex log:", error);
  }
};

const useTrainingApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TrainingApiOutput | null>(null);

  const trainModel = useCallback(
    async (input: TrainingApiInput) => {
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        const formData = new FormData();
        formData.append("modelName", input.modelName);
        formData.append("trainingData", input.trainingDataFile); // File object
        //formData.append("apiKey", input.apiKey); // Don't include API Key in form data

        // Replace with your actual API endpoint and logic
        const response = await fetch('/api/train', {
          method: 'POST',
          headers: {
            //'Content-Type': 'application/json', // Removed Content-Type for FormData
            'Authorization': `Bearer ${input.apiKey}`, // Example: using API key for auth, but not in FormData
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          const err = errorData.message || `Training failed with status: ${response.status}`;
          setError(err);
          const logEntry: TrainingApiOutput = {
            jobId: 'N/A',
            status: 'Failed',
            message: err,
            modelName: input.modelName,
          };
          await writeTempleCodexLog(logEntry);
          return;
        }

        const result: TrainingApiOutput = await response.json();
        setData(result);
        await writeTempleCodexLog(result);
      } catch (e: any) {
        const err = e.message || 'An unexpected error occurred.';
        setError(err);
        const logEntry: TrainingApiOutput = {
          jobId: 'N/A',
          status: 'Errored',
          message: err,
          modelName: input.modelName,
        };
        await writeTempleCodexLog(logEntry);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {isLoading, error, data, trainModel};
};

export type {TrainingApiInput, TrainingApiOutput};
export default useTrainingApi;
