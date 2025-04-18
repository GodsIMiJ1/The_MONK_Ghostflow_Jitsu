'use client';

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

const ScrollEditor = () => {
  const [content, setContent] = useState('');

  return (
    <div className="flex flex-col h-full bg-monk-charcoal text-monk-ash p-4">
      <ScrollArea className="h-full">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Begin your scroll..."
          className="h-full w-full min-h-[500px] bg-transparent text-monk-ash border-none resize-none focus:ring-0 focus:outline-none"
          style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
        />
      </ScrollArea>
    </div>
  );
};

export default ScrollEditor;
