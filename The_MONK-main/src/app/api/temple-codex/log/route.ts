/**
 * @fileOverview This file defines the API endpoint for logging training entries and updating the Codex index.
 *
 * @module src/app/api/temple-codex/log/route
 *
 * @description Handles POST requests to log training data and update the Codex index file.
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'ghostdex', 'temple-codex', 'logs');
const INDEX_FILE = path.join(process.cwd(), 'ghostdex', 'temple-codex', 'index.md');

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

async function updateIndexFile(logEntry: any) {
    try {
        // Read existing index file
        let indexContent = '';
        try {
            indexContent = await fs.readFile(INDEX_FILE, 'utf-8');
        } catch (readError: any) {
            if (readError.code !== 'ENOENT') {
                throw readError; // Re-throw if it's not a "file not found" error
            }
            // If file doesn't exist, start with an empty string
            indexContent = '';
        }

        // Generate new entry
        const newEntry = `---
cycle: 000
date: ${new Date(logEntry.timestamp).toISOString().split('T')[0]}
model: ${logEntry.model}
jobId: ${logEntry.jobId}
result: ${logEntry.status}
---

`;

        // Append new entry to index content
        indexContent = newEntry + indexContent;

        // Write updated content back to index file
        await ensureDirectoryExists(path.dirname(INDEX_FILE));
        await fs.writeFile(INDEX_FILE, indexContent);
        console.log(`Index file updated at ${INDEX_FILE}`);

    } catch (error) {
        console.error('Error updating index file:', error);
    }
}

async function createMarkdownScroll(logEntry: any, logFilename: string) {
    const markdownContent = `# 🧘 Monk Training Log — Cycle 000\n\n` +
        `**Model Name**: ${logEntry.model}\n` +
        `**Job ID**: ${logEntry.jobId}\n` +
        `**Status**: ${logEntry.status}\n` +
        `**Message**: ${logEntry.message}\n` +
        `**Date**: ${new Date(logEntry.timestamp).toISOString()}\n\n` +
        `🕯️ _This entry is sealed in the Codex._`;

    const markdownFilename = logFilename.replace('.json', '.md');
    const markdownFilePath = path.join(LOG_DIR, markdownFilename);

    await fs.writeFile(markdownFilePath, markdownContent);
    console.log(`Markdown scroll written to ${markdownFilePath}`);
}


export async function POST(req: NextRequest) {
  try {
    const logEntry = await req.json();

    // Ensure the log directory exists
    await ensureDirectoryExists(LOG_DIR);

    // Generate a unique log filename
    const logFilename = `training-${Date.now()}.json`;
    const logFilePath = path.join(LOG_DIR, logFilename);

    // Write the log entry to the file
    await fs.writeFile(logFilePath, JSON.stringify(logEntry, null, 2));

    console.log(`Log written to ${logFilePath}`);

    // Create the markdown scroll
    await createMarkdownScroll(logEntry, logFilename);

    // Update the index file
    await updateIndexFile(logEntry);

    return NextResponse.json({ message: 'Log entry created' });
  } catch (error) {
    console.error('Error writing log entry:', error);
    return NextResponse.json({ error: 'Failed to write log entry' }, { status: 500 });
  }
}


