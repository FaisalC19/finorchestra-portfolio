import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen hero-gradient noise-overview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero section */}
        <div className="min-h-screen flex flex-col justify-center py-20">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
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
              <Link
                href="/demo"
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
              </Link>
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
            {['💰 Treasury', '📒 Accounting', '📈 Financial Planning', '📊 Analysis', '📉 Investment & Risk', '🔍 Internal Audit', '🧠 Reasoning', '⚙️ Automation'].map((category) => (
              <div
                key={category}
                className="p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-amber-500/30 transition-colors"
              >
                <div className="text-sm font-medium text-gray-300">{category}</div>
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
            <TechItem name="Next.js 14" description="App Router + TypeScript" />
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
    <div className="p-6 rounded-2xl bg-gray-800/30 border border-gray-700 hover:border-amber-500/20 transition-all group">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function TechItem({ name, description }: { name: string; description: string }) {
  return (
    <div>
      <div className="text-xl font-semibold text-white mb-1">{name}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </div>
  );
}