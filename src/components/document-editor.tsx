'use client';

import { useState, useRef, useEffect } from 'react';
import { useLMStudio } from '@/hooks/useLMStudio';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreVertical, Wand2, Brain, BookOpen, Sparkles, ClipboardEdit, History, Save, Maximize2, Minimize2, FileText, Code, Palette, Languages, Download, FileJson, FileCode } from 'lucide-react';
import { load, dump } from 'js-yaml';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-bash';

type DocumentFormat = 'markdown' | 'json' | 'plaintext' | 'yaml' | 'html' | 'typescript' | 'javascript' | 'python';
type CaretShape = 'block' | 'bar';

interface DocumentEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  onSave?: (content: string, name: string, format: DocumentFormat) => void;
  className?: string;
}

export default function DocumentEditor({ initialContent = '', onContentChange, onSave, className }: DocumentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [docName, setDocName] = useState('Untitled Document');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [format, setFormat] = useState<DocumentFormat>('markdown');
  const [validationError, setValidationError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { generateResponse, isLoading, error } = useLMStudio();
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [opacity, setOpacity] = useState(0.95);
  const [cursorStyle, setCursorStyle] = useState<CaretShape>('block');
  const [terminalTheme, setTerminalTheme] = useState({
    // Temple Silence Color Palette
    background: '#1B1B1B',    // Charcoal Grey
    foreground: '#D8D5C7',    // Ash White
    cursor: '#D4AF7F',        // Faded Gold
    selection: '#1C4D3E',     // Forest Green
    lineHighlight: '#514B56', // Smokey Purple
    // Terminal colors using Temple Silence palette
    black: '#1B1B1B',         // Charcoal Grey
    red: '#A68C6D',           // Light Brown
    green: '#1C4D3E',         // Forest Green
    yellow: '#D4AF7F',        // Faded Gold
    blue: '#514B56',          // Smokey Purple
    magenta: '#7D9772',       // Moss Sage
    cyan: '#1C4D3E',          // Forest Green
    white: '#D8D5C7',         // Ash White
    brightBlack: '#514B56',   // Smokey Purple
    brightRed: '#D4AF7F',     // Faded Gold
    brightGreen: '#7D9772',   // Moss Sage
    brightYellow: '#A68C6D',  // Light Brown
    brightBlue: '#1C4D3E',    // Forest Green
    brightMagenta: '#D8D5C7', // Ash White
    brightCyan: '#7D9772',    // Moss Sage
    brightWhite: '#D8D5C7'    // Ash White
  });

  useEffect(() => {
    // Update line numbers when content changes
    const lines = content.split('\n');
    setLineNumbers(Array.from({ length: lines.length }, (_, i) => i + 1));

    // Apply syntax highlighting
    Prism.highlightAll();
  }, [content, format]);

  const validateContent = (content: string, format: DocumentFormat): string | null => {
    try {
      switch (format) {
        case 'json':
          JSON.parse(content);
          return null;
        case 'yaml':
          load(content);
          return null;
        case 'html':
          // Basic HTML validation
          const parser = new DOMParser();
          const doc = parser.parseFromString(content, 'text/html');
          const errors = doc.querySelectorAll('parsererror');
          return errors.length > 0 ? 'Invalid HTML structure' : null;
        case 'typescript':
        case 'javascript':
          // Basic syntax validation using eval in a try-catch
          try {
            if (format === 'typescript') {
              // For TypeScript, we'll just check basic syntax
              // Note: This is a very basic check and won't catch all TypeScript errors
              const ts = require('typescript');
              const sourceFile = ts.createSourceFile('temp.ts', content, ts.ScriptTarget.Latest);
              return null;
            } else {
              // For JavaScript, we can do a basic syntax check
              new Function(content);
              return null;
            }
          } catch (err) {
            return `Invalid ${format} syntax: ${(err as Error).message}`;
          }
        case 'python':
          // For Python, we'll do a basic syntax check
          // Note: This is a very basic check and won't catch all Python errors
          try {
            // We'll use a simple regex to check for basic Python syntax
            const pythonSyntax = /^(def|class|if|elif|else|for|while|try|except|finally|with|import|from|as|return|yield|break|continue|pass|raise|assert|del|global|nonlocal|lambda)\b/;
            if (!pythonSyntax.test(content) && !content.includes('=') && !content.includes(':')) {
              return 'Invalid Python syntax: Missing Python keywords or basic syntax';
            }
            return null;
          } catch (err) {
            return `Invalid Python syntax: ${(err as Error).message}`;
          }
        case 'markdown':
        case 'plaintext':
        default:
          return null;
      }
    } catch (err: unknown) {
      const error = err as Error;
      return `Invalid ${format.toUpperCase()} syntax: ${error.message}`;
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    const error = validateContent(newContent, format);
    setValidationError(error);
    onContentChange?.(newContent);
  };

  const handleFormatChange = (newFormat: DocumentFormat) => {
    setFormat(newFormat);
    const error = validateContent(content, newFormat);
    setValidationError(error);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection) {
      setSelectedText(selection.toString());
    }
  };

  const handleMonkAssist = async (action: 'improve' | 'summarize' | 'expand' | 'explain' | 'simplify' | 'formalize' | 'translate' | 'code' | 'style') => {
    try {
      const textToProcess = selectedText || content;
      let prompt = '';

      switch (action) {
        case 'improve':
          prompt = `Meditate on this scroll and elevate its essence: ${textToProcess}`;
          break;
        case 'summarize':
          prompt = `Distill this text to its purest form, like water from a mountain stream: ${textToProcess}`;
          break;
        case 'expand':
          prompt = `Breathe life into these words, allowing them to grow like a sacred garden: ${textToProcess}`;
          break;
        case 'explain':
          prompt = `Illuminate this text with the clarity of morning light on temple stones: ${textToProcess}`;
          break;
        case 'simplify':
          prompt = `Remove all that is unnecessary, leaving only what speaks truth: ${textToProcess}`;
          break;
        case 'formalize':
          prompt = `Transform these words into a sacred text, worthy of the temple archives: ${textToProcess}`;
          break;
        case 'translate':
          prompt = `Carry these words across the bridge of languages, preserving their spirit: ${textToProcess}`;
          break;
        case 'code':
          prompt = `Transmute these concepts into the sacred patterns of code: ${textToProcess}`;
          break;
        case 'style':
          prompt = `Adorn this text with the elegant robes of refined expression: ${textToProcess}`;
          break;
        default:
          prompt = `Offer your wisdom to transform this text: ${textToProcess}`;
      }

      const response = await generateResponse(prompt);

      if (selectedText) {
        const newContent = content.replace(selectedText, response);
        handleContentChange(newContent);
      } else {
        handleContentChange(response);
      }
    } catch (err) {
      console.error('The Monk assistance failed:', err);
    }
  };

  const handleMonkSuggest = async (type: 'structure' | 'content' | 'style' | 'format' | 'references') => {
    try {
      let prompt = '';

      switch (type) {
        case 'structure':
          prompt = `Contemplate the architecture of this scroll and offer wisdom on how it might be better arranged: ${content}`;
          break;
        case 'content':
          prompt = `Meditate on the essence of this text and share insights on how its message might be strengthened: ${content}`;
          break;
        case 'style':
          prompt = `Consider the flow of these words like a sacred river and suggest how they might flow more harmoniously: ${content}`;
          break;
        case 'format':
          prompt = `Observe the visual temple of this text and offer guidance on how it might better honor the reader's eye: ${content}`;
          break;
        case 'references':
          prompt = `Reflect on what ancient or modern wisdom might complement this scroll: ${content}`;
          break;
        default:
          prompt = `Share your reflections on how this text might be elevated: ${content}`;
      }

      const response = await generateResponse(prompt);
      alert(`The Monk's Reflections on ${type}:\n\n${response}`);
    } catch (err) {
      console.error('The Monk suggestion failed:', err);
    }
  };

  const handleMonkGenerate = async (type: 'introduction' | 'conclusion' | 'example' | 'outline' | 'references') => {
    try {
      let prompt = '';

      switch (type) {
        case 'introduction':
          prompt = `Create a gateway of words to welcome the reader into this temple of thought: ${content}`;
          break;
        case 'conclusion':
          prompt = `Craft a final meditation that brings this journey to a peaceful close: ${content}`;
          break;
        case 'example':
          prompt = `Manifest a living example that illuminates the essence of these teachings: ${content}`;
          break;
        case 'outline':
          prompt = `Draw the sacred map that reveals the path through this wisdom: ${content}`;
          break;
        case 'references':
          prompt = `Call upon the voices of wisdom that might strengthen this scroll: ${content}`;
          break;
        default:
          prompt = `Create new elements to enhance this scroll: ${content}`;
      }

      const response = await generateResponse(prompt);
      const newContent = type === 'example'
        ? `${content}\n\nExample:\n${response}`
        : `${response}\n\n${content}`;
      handleContentChange(newContent);
    } catch (err) {
      console.error('The Monk generation failed:', err);
    }
  };

  const handleSave = () => {
    onSave?.(content, docName, format);
    setShowSaveDialog(false);
  };

  const getFileExtension = () => {
    switch (format) {
      case 'markdown': return '.md';
      case 'json': return '.json';
      case 'plaintext': return '.txt';
      case 'yaml': return '.yaml';
      case 'html': return '.html';
    }
  };

  const getLanguageClass = () => {
    switch (format) {
      case 'markdown':
        return 'language-markdown';
      case 'json':
        return 'language-json';
      case 'yaml':
        return 'language-yaml';
      case 'html':
        return 'language-html';
      case 'typescript':
        return 'language-typescript';
      case 'javascript':
        return 'language-javascript';
      case 'python':
        return 'language-python';
      case 'plaintext':
      default:
        return 'language-plaintext';
    }
  };

  const formatContent = (content: string): string => {
    try {
      switch (format) {
        case 'json':
          return JSON.stringify(JSON.parse(content), null, 2);
        case 'yaml':
          return dump(load(content), { indent: 2 });
        case 'html':
          const parser = new DOMParser();
          const doc = parser.parseFromString(content, 'text/html');
          return new XMLSerializer().serializeToString(doc);
        case 'markdown':
        case 'plaintext':
        default:
          return content;
      }
    } catch (err: unknown) {
      console.error('Formatting error:', err);
      return content;
    }
  };

  const handleLanguageSpecificFormat = () => {
    switch (format) {
      case 'typescript':
      case 'javascript':
        // Add basic TypeScript/JavaScript formatting
        const formatted = content
          .replace(/\s*{\s*/g, ' {')
          .replace(/\s*}\s*/g, ' }')
          .replace(/\s*\(\s*/g, ' (')
          .replace(/\s*\)\s*/g, ') ')
          .replace(/\s*,\s*/g, ', ')
          .replace(/\s*;\s*/g, '; ');
        handleContentChange(formatted);
        break;
      case 'python':
        // Add basic Python formatting
        const pythonFormatted = content
          .replace(/\s*:\s*/g, ': ')
          .replace(/\s*,\s*/g, ', ')
          .replace(/\s*=\s*/g, ' = ');
        handleContentChange(pythonFormatted);
        break;
      default:
        break;
    }
  };

  const handleLanguageSpecificSuggest = async () => {
    let prompt = '';
    switch (format) {
      case 'typescript':
        prompt = `As a TypeScript expert, review this code and suggest improvements:\n${content}`;
        break;
      case 'javascript':
        prompt = `As a JavaScript expert, review this code and suggest improvements:\n${content}`;
        break;
      case 'python':
        prompt = `As a Python expert, review this code and suggest improvements:\n${content}`;
        break;
      default:
        return;
    }

    try {
      const response = await generateResponse(prompt);
      alert(`Code Review Suggestions:\n\n${response}`);
    } catch (err) {
      console.error('Code review suggestion failed:', err);
    }
  };

  return (
    <div className={`h-full flex flex-col bg-monk-charcoal text-monk-ash overflow-hidden ${className || ''}`} style={{ opacity }}>
      {/* Terminal Menu Bar */}
      <div className="p-2 bg-monk-charcoal border-b border-monk-forest flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              className="hover:bg-monk-forest text-monk-ash hover:text-monk-ash"
            >
              {showLineNumbers ? 'Hide Lines' : 'Show Lines'}
            </Button>
            <Select value={format} onValueChange={(value) => handleFormatChange(value as DocumentFormat)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="markdown">Markdown</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="yaml">YAML</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="plaintext">Plain Text</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFontSize(prev => Math.min(prev + 2, 24))}
              className="hover:bg-monk-forest text-monk-ash hover:text-monk-ash"
            >
              A+
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFontSize(prev => Math.max(prev - 2, 10))}
              className="hover:bg-monk-forest text-monk-ash hover:text-monk-ash"
            >
              A-
            </Button>
            <Select
              value={cursorStyle}
              onValueChange={(value: CaretShape) => setCursorStyle(value)}
            >
              <SelectTrigger className="w-[120px] bg-[#2a2a2a] border-gray-800 text-gray-300">
                <SelectValue placeholder="Cursor" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-gray-800">
                <SelectItem value="block" className="text-gray-300">Block</SelectItem>
                <SelectItem value="bar" className="text-gray-300">Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpacity(prev => Math.max(prev - 0.05, 0.5))}
            className="hover:bg-gray-700 text-gray-300"
          >
            -
          </Button>
          <span className="text-sm text-gray-300">{Math.round(opacity * 100)}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpacity(prev => Math.min(prev + 0.05, 1))}
            className="hover:bg-gray-700 text-gray-300"
          >
            +
          </Button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 relative">
        <ScrollArea className="h-full absolute inset-0" style={{ background: terminalTheme.background }}>
          <div className="p-4 min-h-full flex">
            {showLineNumbers && (
              <div
                className="w-12 pr-2 text-right select-none font-mono text-monk-moss overflow-y-hidden"
                style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: `${fontSize}px`,
                  lineHeight: '1.5',
                }}
              >
                {lineNumbers.map((num) => (
                  <div key={num} className="h-[1.5em]">
                    {num}
                  </div>
                ))}
              </div>
            )}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={formatContent(content)}
                onChange={(e) => handleContentChange(e.target.value)}
                onSelect={handleTextSelection}
                className={`h-full w-full font-mono bg-transparent text-monk-ash border-none resize-none focus:ring-0 focus:outline-none ${
                  validationError ? 'border-red-500' : ''
                }`}
                style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: `${fontSize}px`,
                  lineHeight: '1.5',
                  tabSize: 2,
                  paddingLeft: showLineNumbers ? '0' : '1rem',
                  caretShape: cursorStyle,
                  caretColor: terminalTheme.cursor,
                  color: terminalTheme.foreground,
                  textShadow: '0 0 1px rgba(255, 255, 255, 0.1)',
                  minHeight: 'calc(100vh - 8rem)',
                }}
                placeholder="Begin your scroll..."
              />
              <div
                className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50"
                style={{
                  background: `linear-gradient(${terminalTheme.background}55 1px, transparent 1px)`,
                  backgroundSize: `100% ${fontSize * 1.5}px`,
                }}
              />
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Status Bar */}
      <div className="p-2 bg-monk-charcoal text-sm text-monk-moss border-t border-monk-forest flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span>{format.toUpperCase()}</span>
          <span className="text-monk-moss/50">|</span>
          <span>Ln {lineNumbers.length}</span>
          <span className="text-monk-moss/50">|</span>
          <span>Col {content.length}</span>
          {selectedText && (
            <>
              <span className="text-monk-moss/50">|</span>
              <span>Selected: {selectedText.length} chars</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {validationError && (
            <span className="text-monk-gold">{validationError}</span>
          )}
        </div>
      </div>

      {/* New buttons */}
      <div className="p-2 bg-monk-charcoal border-t border-monk-forest flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLanguageSpecificFormat}
            className="text-monk-ash hover:text-monk-gold"
          >
            <Code className="h-4 w-4 mr-2" />
            Format Code
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLanguageSpecificSuggest}
            className="text-monk-ash hover:text-monk-gold"
          >
            <Brain className="h-4 w-4 mr-2" />
            Code Review
          </Button>
        </div>
      </div>
    </div>
  );
}