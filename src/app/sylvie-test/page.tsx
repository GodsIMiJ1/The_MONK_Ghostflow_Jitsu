'use client';

import React from 'react';
import SylvieTerminal from '@/components/SylvieTerminal';

export default function SylvieTestPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-purple-400">Sylvie Terminal - The Patch Priestess</h1>
        <p className="text-gray-400">Ask for code and Sylvie shall provide</p>
      </header>
      
      <main className="flex-1">
        <div className="h-[calc(100vh-150px)]">
          <SylvieTerminal />
        </div>
      </main>
      
      <footer className="mt-6 text-center text-gray-500 text-sm">
        <p>Powered by the GodsIMiJ Empire | GPT-4o</p>
      </footer>
    </div>
  );
}
