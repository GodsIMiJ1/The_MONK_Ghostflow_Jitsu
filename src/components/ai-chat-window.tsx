'use client';

import { useState, useRef, useEffect } from 'react';
import { useLMStudio } from '@/hooks/useLMStudio';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bot, Send, Sparkles, Brain, History, Settings, Code, Languages, BookOpen, FileText, Palette, Maximize2, Minimize2 } from 'lucide-react';

interface AIChatWindowProps {
  documentContent: string;
  onDocumentUpdate?: (newContent: string) => void;
  onSave?: (content: string, name: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'chat' | 'edit' | 'suggestion' | 'code' | 'translate' | 'analyze' | 'format';
}

export default function AIChatWindow({ documentContent, onDocumentUpdate, onSave }: AIChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Enlightenment achieved... shall we begin?',
      timestamp: new Date(),
      type: 'chat'
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { generateResponse, isLoading: isAIThinking, error } = useLMStudio();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (type: Message['type'] = 'chat') => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: newMessage,
      timestamp: new Date(),
      type
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let prompt = '';
      switch (type) {
        case 'edit':
          prompt = `Document content: ${documentContent}\n\nUser request: ${newMessage}\n\nOffer your wisdom to edit this scroll according to the request. Maintain your calm, reflective tone.`;
          break;
        case 'suggestion':
          prompt = `Document content: ${documentContent}\n\nUser request: ${newMessage}\n\nProvide your sacred reflections and suggestions for this scroll. Speak with ancient wisdom and modern calm.`;
          break;
        case 'code':
          prompt = `Document content: ${documentContent}\n\nUser request: ${newMessage}\n\nIlluminate the path of code with your wisdom. Explain with clarity and stillness.`;
          break;
        case 'translate':
          prompt = `Document content: ${documentContent}\n\nUser request: ${newMessage}\n\nTransform these words across languages with your deep understanding. Maintain the essence of the original scroll.`;
          break;
        case 'analyze':
          prompt = `Document content: ${documentContent}\n\nUser request: ${newMessage}\n\nMeditate on this scroll and share your insights with depth and clarity.`;
          break;
        case 'format':
          prompt = `Document content: ${documentContent}\n\nUser request: ${newMessage}\n\nBring harmony and structure to this scroll. Arrange with intention and sacred purpose.`;
          break;
        default:
          prompt = `Document content: ${documentContent}\n\nUser question: ${newMessage}\n\nRespond with your calm, reflective wisdom. Remember to be minimal, poetic when needed, and speak from a place of inner knowing.`;
      }

      const response = await generateResponse(prompt);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        type
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (type === 'edit' && onDocumentUpdate) {
        onDocumentUpdate(response);
      }
    } catch (error) {
      console.error('Failed to send message to AI:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date(),
        type
      }]);
    } finally {
      setIsLoading(false);
      setNewMessage('');
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className={`flex flex-col h-full bg-monk-charcoal border-monk-forest relative ${isExpanded ? 'fixed inset-0 z-50' : ''}`}>
      {/* Monk logo background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <img src="/monk-logo.svg" alt="The Monk" className="w-64 h-64" />
      </div>
      <div className="p-4 border-b border-monk-forest flex justify-between items-center bg-monk-charcoal">
        <div className="flex items-center gap-2">
          <img src="/monk-logo.svg" alt="The Monk" className="h-5 w-5" />
          <span className="font-semibold text-monk-gold">The Monk</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:bg-monk-forest text-monk-ash hover:text-monk-ash"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-monk-forest text-monk-ash hover:text-monk-ash">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-monk-charcoal border-monk-forest">
              <DropdownMenuItem onClick={() => sendMessage('edit')} className="hover:bg-monk-forest text-monk-ash hover:text-monk-ash">
                <Brain className="h-4 w-4 mr-2" />
                Edit Document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => sendMessage('suggestion')} className="hover:bg-monk-forest text-monk-ash hover:text-monk-ash">
                <Sparkles className="h-4 w-4 mr-2" />
                Get Suggestions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => sendMessage('code')} className="hover:bg-monk-forest text-monk-ash hover:text-monk-ash">
                <Code className="h-4 w-4 mr-2" />
                Code Help
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => sendMessage('translate')} className="hover:bg-monk-forest text-monk-ash hover:text-monk-ash">
                <Languages className="h-4 w-4 mr-2" />
                Translation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => sendMessage('analyze')} className="hover:bg-monk-forest text-monk-ash hover:text-monk-ash">
                <BookOpen className="h-4 w-4 mr-2" />
                Analyze
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => sendMessage('format')} className="hover:bg-monk-forest text-monk-ash hover:text-monk-ash">
                <Palette className="h-4 w-4 mr-2" />
                Format
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block p-3 rounded-lg max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-monk-purple text-monk-ash'
                  : 'bg-monk-forest text-monk-ash'
              }`}
            >
              <div className="text-sm text-monk-moss mb-1">
                {message.role === 'user' ? 'You' : 'The Monk'} • {formatTimestamp(message.timestamp)}
                {message.type !== 'chat' && (
                  <span className="ml-2 text-xs bg-monk-purple px-2 py-0.5 rounded">
                    {message.type}
                  </span>
                )}
              </div>
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-center text-monk-moss flex items-center justify-center gap-2">
            <img src="/monk-logo.svg" alt="The Monk" className="h-4 w-4 animate-pulse" />
            Thinking...
          </div>
        )}
        {error && (
          <div className="text-center text-monk-gold bg-monk-forest/50 p-2 rounded">
            Error: {error.message}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t border-monk-forest">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Present your contemplation to the enlightened one..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="bg-monk-charcoal border-monk-moss text-monk-ash placeholder-monk-moss"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => sendMessage()} disabled={isLoading} className="hover:bg-monk-forest text-monk-ash hover:text-monk-ash">
                <Send className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
}
