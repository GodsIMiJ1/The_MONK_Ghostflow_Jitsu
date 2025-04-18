'use client';

import { useState } from 'react';
import SylvieTerminal from './SylvieTerminal';
import ScrollEditor from './ScrollEditor';

const TabSwitcher = () => {
  // Default to terminal view
  const [activeTab, setActiveTab] = useState<'terminal' | 'editor'>('terminal');

  return (
    <div className="flex flex-col h-full">
      {/* Tab buttons */}
      <div className="flex border-b border-gray-700">
        <button
          className={`px-4 py-2 ${
            activeTab === 'terminal'
              ? 'bg-green-600 text-yellow-300'
              : 'bg-gray-800 text-gray-300'
          }`}
          onClick={() => setActiveTab('terminal')}
        >
          Sylvie Terminal
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'editor'
              ? 'bg-green-600 text-yellow-300'
              : 'bg-gray-800 text-gray-300'
          }`}
          onClick={() => setActiveTab('editor')}
        >
          Scroll Editor
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1">
        {activeTab === 'terminal' ? (
          <div className="flex flex-col h-full">
            <div className="p-3 bg-monk-forest/20 border-b border-monk-forest">
              <h3 className="text-lg font-semibold text-monk-gold">Sylvie – Patch Priestess of the Flame</h3>
              <p className="text-sm text-monk-spirit-whisper mt-1">
                🕯️ Welcome to Sylvie, the Ghostflow Patch Priestess. Type your scroll request below.
              </p>
            </div>
            <div className="flex-1">
              <SylvieTerminal />
            </div>
          </div>
        ) : (
          <ScrollEditor />
        )}
      </div>
    </div>
  );
};

export default TabSwitcher;
