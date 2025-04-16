/ src/app/api/temple-codex/index/route.ts
import {NextRequest, NextResponse} from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'ghostdex', 'temple-codex', 'logs');
const INDEX_FILE = path.join(process.cwd(), 'ghostdex', 'temple-codex', 'index.md');

async function readLogFiles(): Promise<any[]> {
  try {
    const files = await fs.readdir(LOG_DIR);
    const logFiles = files.filter(file => file.startsWith('training-') && file.endsWith('.json'));
    const logEntries = [];

    for (const file of logFiles) {
      const filePath = path.join(LOG_DIR, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      logEntries.push(JSON.parse(fileContent));
    }

    return logEntries;
  } catch (error) {
    console.error('Error reading log files:', error);
    return [];
  }
}

async function generateIndexContent(logEntries: any[]): Promise<string> {
  let indexContent = '';

  for (const entry of logEntries) {
    indexContent += `---\n`;
    indexContent += `cycle: 000\n`;
    indexContent += `date: ${new Date(entry.timestamp).toISOString().split('T')[0]}\n`;
    indexContent += `model: ${entry.model}\n`;
    indexContent += `jobId: ${entry.jobId}\n`;
    indexContent += `result: ${entry.status}\n`;
    indexContent += `---\n\n`;
  }

  return indexContent;
}

async function ensureDirectoryExists(directory: string) {
  try {
    await fs.mkdir(directory, { recursive: true });
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      console.error('Error creating directory:', error);
      throw error;
    }
  }
}

export async function GET(req: NextRequest) {
  try {
        await ensureDirectoryExists(LOG_DIR);

    const logEntries = await readLogFiles();
    const indexContent = await generateIndexContent(logEntries);

    // Optionally write index content to file
        await ensureDirectoryExists(path.dirname(INDEX_FILE));
    await fs.writeFile(INDEX_FILE, indexContent);

    return new NextResponse(indexContent, {
      headers: {'Content-Type': 'text/markdown'},
    });
  } catch (error) {
    console.error('Error generating index:', error);
    return NextResponse.json(
      {error: 'Failed to generate index'},
      {status: 500}
    );
  }
}
