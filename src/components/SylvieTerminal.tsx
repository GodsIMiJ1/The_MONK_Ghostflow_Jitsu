'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TerminalEntry {
  type: 'command' | 'output' | 'error' | 'system' | 'code';
  content: string;
  filename?: string;
  explanation?: string;
  timestamp: Date;
}

const SylvieTerminal = () => {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<TerminalEntry[]>([
    {
      type: 'system',
      content: 'Sylvie Terminal initialized. The sacred flame of code awaits your command.',
      timestamp: new Date()
    },
    {
      type: 'system',
      content: 'Ask for code and I shall provide. Be specific in your requests.',
      timestamp: new Date()
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [history]);

  const executeSylvie = async (prompt: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/sylvie-terminal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.error) {
        setHistory(prev => [...prev, {
          type: 'error',
          content: data.error,
          timestamp: new Date()
        }]);
        return;
      }

      // Add code output to history
      if (data.code) {
        setHistory(prev => [...prev, {
          type: 'code',
          content: data.code,
          filename: data.filename,
          explanation: data.explanation,
          timestamp: new Date()
        }]);
      } else if (data.explanation) {
        // If there's no code but there is an explanation, add it as output
        setHistory(prev => [...prev, {
          type: 'output',
          content: data.explanation,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error executing Sylvie command:', error);
      setHistory(prev => [...prev, {
        type: 'error',
        content: `Failed to execute command: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    // Add the command to history
    setHistory(prev => [...prev, {
      type: 'command',
      content: prompt,
      timestamp: new Date()
    }]);

    // Execute the command
    await executeSylvie(prompt);

    // Clear the input
    setPrompt('');
  };

  // Render different entry types with appropriate styling
  const renderEntry = (entry: TerminalEntry, index: number) => {
    switch (entry.type) {
      case 'command':
        return (
          <div key={index} className="py-1">
            <span className="text-monk-gold">$ </span>
            <span className="text-monk-ash">{entry.content}</span>
          </div>
        );
      case 'code':
        return (
          <div key={index} className="py-2 space-y-2">
            {entry.filename && (
              <div className="text-monk-sacred-teal font-semibold">
                {entry.filename}
              </div>
            )}
            <div className="bg-monk-forest/30 p-3 rounded-md text-monk-spirit-whisper font-mono whitespace-pre-wrap overflow-x-auto border border-monk-forest/50">
              {entry.content}
            </div>
            {entry.explanation && (
              <div className="text-monk-moss italic mt-2 pl-2 border-l-2 border-monk-sacred-teal">
                {entry.explanation}
              </div>
            )}
          </div>
        );
      case 'output':
        return (
          <div key={index} className="py-1 text-monk-moss whitespace-pre-wrap">
            {entry.content}
          </div>
        );
      case 'error':
        return (
          <div key={index} className="py-1 text-red-500 whitespace-pre-wrap">
            {entry.content}
          </div>
        );
      case 'system':
        return (
          <div key={index} className="py-1 text-monk-sacred-teal">
            <span>{'> '}</span>
            {entry.content}
          </div>
        );
      default:
        return (
          <div key={index} className="py-1 text-monk-spirit-whisper">
            {entry.content}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-monk-charcoal rounded-xl shadow-lg p-4">
      <div className="flex-1 mb-4 overflow-auto" ref={scrollAreaRef}>
        <ScrollArea className="h-full">
          <div className="font-mono">
            {history.map((entry, index) => renderEntry(entry, index))}
            {isLoading && (
              <div className="py-1 text-monk-gold animate-pulse">
                Sylvie is weaving code...
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Sylvie for code..."
          disabled={isLoading}
          className="flex-1 bg-monk-charcoal border-monk-forest text-monk-ash font-mono focus:border-monk-sacred-teal focus:ring-monk-sacred-teal"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-monk-forest hover:bg-monk-sacred-teal text-monk-ash font-mono"
        >
          Execute
        </Button>
      </form>
    </div>
  );
};

export default SylvieTerminal;
