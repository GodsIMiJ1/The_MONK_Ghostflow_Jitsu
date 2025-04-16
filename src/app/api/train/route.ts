import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const modelName = formData.get('modelName') as string;
    const trainingDataFile = formData.get('trainingData') as File;

    if (!modelName || !trainingDataFile) {
      return NextResponse.json(
        { error: 'Missing modelName or trainingData' },
        { status: 400 }
      );
    }

    // Basic file validation (e.g., check file type/size)
    if (trainingDataFile.size > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Save the file (in a real app, use a more robust file storage solution)
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, trainingDataFile.name);
    const fileBuffer = await trainingDataFile.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(fileBuffer));

    // In a real application, you would initiate a training job here
    // and return a job ID and status.
    const jobId = 'simulated_job_id_' + Date.now();
    const status = 'pending';

    return NextResponse.json({ jobId, status, modelName });
  } catch (error) {
    console.error('Error processing training request:', error);
    return NextResponse.json(
      { error: 'Failed to process training request' },
      { status: 500 }
    );
  }
}
