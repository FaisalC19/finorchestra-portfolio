'use client';

import { useRef, useEffect, useState } from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import ChatMessageComponent from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

interface Props {
  messages: ChatMessageType[];
  isTyping: boolean;
  onSendMessage: (message: string) => void;
}

const WELCOME_MESSAGE: ChatMessageType = {
  id: 'welcome',
  role: 'assistant',
  content: `Good morning. I'm **FinOrchestra**, your AI CFO.

I have real-time access to your financial systems — bank accounts, transactions, invoices, market data, and compliance policies.

How can I serve your financial strategy today?

*Try asking me about:*
• "What's our current cash position?"
• "Calculate PPN for Rp 50,000,000"
• "Generate a 6-month revenue forecast"
• "Show budget variance this quarter"`,
  timestamp: new Date(),
  status: 'sent',
};

export default function ChatWindow({ messages, isTyping, onSendMessage }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900/50 to-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center gold-glow">
            <span className="text-lg font-bold text-gray-900">F</span>
          </div>
          <div>
            <h2 className="text-white font-semibold">FinOrchestra CFO</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-gray-400">Online</span>
            </div>
          </div>
        </div>

        {/* Tools indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
          <span className="px-2 py-1 rounded-full bg-gray-800 border border-gray-700">
            16 Tools
          </span>
          <span className="px-2 py-1 rounded-full bg-gray-800 border border-gray-700">
            Claude 3.5
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
      >
        <ChatMessageComponent message={WELCOME_MESSAGE} />

        {messages.map((msg) => (
          <ChatMessageComponent key={msg.id} message={msg} />
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="message-ai px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="typing-dot w-2 h-2 bg-amber-400 rounded-full"></div>
                <div className="typing-dot w-2 h-2 bg-amber-400 rounded-full"></div>
                <div className="typing-dot w-2 h-2 bg-amber-400 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-amber-500/10 bg-gray-900/50">
        <ChatInput onSend={onSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}