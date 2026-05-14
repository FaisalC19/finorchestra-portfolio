'use client';

import { useState, FormEvent } from 'react';

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center bg-gray-800/50 rounded-2xl border border-amber-500/20 focus-within:border-amber-400/60 transition-all">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your CFO anything..."
          disabled={disabled}
          className="flex-1 bg-transparent px-5 py-4 text-gray-100 placeholder-gray-500 outline-none rounded-2xl"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className={`m-2 p-3 rounded-xl transition-all ${
            input.trim() && !disabled
              ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-gray-900 hover:scale-105 active:scale-95 gold-glow'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>

      {/* Quick suggestions */}
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
        {[
          'Check bank balance',
          'Calculate PPN 11%',
          'Generate revenue forecast',
          'Run fraud check',
        ].map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setInput(suggestion)}
            disabled={disabled}
            className="text-xs px-3 py-1.5 rounded-full bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-amber-500/30 hover:text-amber-400 whitespace-nowrap transition-colors disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </form>
  );
}