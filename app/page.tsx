'use client';

import { useState, useCallback } from 'react';
import ChatWindow from '@/components/ChatWindow';
import { ChatMessage as ChatMessageType } from '@/types';

export default function Home() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
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

      if (data.status === 'error' && data.message) {
        const errorMessage: ChatMessageType = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
          status: 'error',
        };
        setMessages((prev) => [...prev, errorMessage]);
      } else if (data.status === 'ok' && data.message) {
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
          msg.id === userMessage.id ? { ...msg, status: 'error' } : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  }, []);

  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  return (
    <div className="min-h-screen hero-gradient noise-overview">
      {/* Slide-out chat panel overlay */}
      {isPanelOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={closePanel}
          />

          {/* Side panel */}
          <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] z-50 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Panel chrome */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-amber-500/20 bg-[#0B0F19]/95">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center gold-glow">
                  <span className="text-sm font-bold text-gray-900">F</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">FinOrchestra CFO Agent</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-gray-400">Connected</span>
                  </div>
                </div>
              </div>
              <button
                onClick={closePanel}
                className="w-8 h-8 rounded-lg bg-gray-800/50 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-amber-500/30 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat window */}
            <div className="flex-1 rounded-none overflow-hidden border-x-0 border-b-0 border border-amber-500/20">
              <ChatWindow
                messages={messages}
                isTyping={isTyping}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </>
      )}

      {/* Landing page content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero section */}
        <div className="min-h-screen flex flex-col justify-center py-20">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-400/20 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-sm text-amber-400">AI-Powered Financial Operations</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight">
              Meet Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                AI CFO Agent
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
              FinOrchestra connects directly to your financial systems — bank accounts,
              transactions, invoices, market data — and delivers executive-grade insights
              in seconds. Powered by Claude 3.5 Sonnet via AWS Bedrock.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button
                onClick={() => setIsPanelOpen(true)}
                className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-gray-900 font-semibold text-lg hover:scale-105 transition-transform gold-glow"
              >
                Try the Demo
                <svg
                  className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl border border-gray-600 text-white font-semibold text-lg hover:border-amber-500/50 hover:bg-amber-500/5 transition-all"
              >
                View on GitHub
              </a>
            </div>

            {/* Features grid */}
            <div className="grid sm:grid-cols-3 gap-6">
              <FeatureCard
                icon="🧠"
                title="16 Integrated Tools"
                description="Bank balances, tax calculation, fraud detection, market data, forecasting — all in one agent."
              />
              <FeatureCard
                icon="⚡"
                title="Real-Time Execution"
                description="Direct connections to Supabase, Google Sheets, Alpha Vantage — no manual data entry."
              />
              <FeatureCard
                icon="🔒"
                title="Enterprise-Ready"
                description="Webhook-based architecture, CORS headers, error handling — ready for production deployment."
              />
            </div>
          </div>
        </div>

        {/* Tools showcase */}
        <div className="py-20 border-t border-amber-500/10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Powered by 16 Financial Tools</h2>
            <p className="text-gray-400">Every tool is directly callable by the AI agent</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Treasury', 'Accounting', 'Financial Planning', 'Analysis', 'Investment & Risk', 'Internal Audit', 'Reasoning', 'Automation'].map((category) => (
              <div
                key={category}
                className="group p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10 hover:border-amber-500/30 transition-all duration-200 cursor-default"
              >
                <div className="text-sm font-medium text-gray-300 group-hover:text-amber-300 transition-colors">{category}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="py-20 border-t border-amber-500/10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Built for Production</h2>
            <p className="text-gray-400">Modern stack, deployed globally</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <TechItem name="Next.js 16" description="App Router + TypeScript" />
            <TechItem name="n8n" description="Workflow automation" />
            <TechItem name="AWS Bedrock" description="Claude 3.5 Sonnet" />
            <TechItem name="Vercel" description="Edge deployment" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10 hover:border-amber-500/20 transition-all duration-200 group">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function TechItem({ name, description }: { name: string; description: string }) {
  return (
    <div>
      <div className="text-xl font-semibold text-white mb-1 font-mono">{name}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </div>
  );
}