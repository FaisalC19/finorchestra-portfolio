'use client';

import { useState, useCallback } from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import ChatWindow from '@/components/ChatWindow';

export default function DemoPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id
            ? { ...msg, status: data.status === 'ok' ? 'sent' : 'error' }
            : msg
        )
      );

      if (data.status === 'ok' && data.message) {
        const aiMessage: ChatMessageType = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
          status: 'sent',
        };
        setMessages((prev) => [...prev, aiMessage]);
      }

    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id
            ? { ...msg, status: 'error' }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] financial-grid">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Back to home */}
        <div className="p-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </a>
        </div>

        {/* Chat container */}
        <div className="flex-1 rounded-2xl overflow-hidden border border-amber-500/20 gold-glow-subtle mx-4 mb-4">
          <ChatWindow
            messages={messages}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}