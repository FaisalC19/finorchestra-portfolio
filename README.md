# FinOrchestra — Enterprise AI CFO Agent

A real-time, agentic financial operations platform that connects disparate enterprise systems into a unified AI-powered workflow. FinOrchestra deploys a Chief Financial Officer agent — powered by Claude 3.5 Sonnet via AWS Bedrock — to execute multi-tool financial tasks: real-time bank balance reconciliation, Indonesian tax calculation (PPN, PPh), fraud detection on transaction streams, invoice validation, revenue forecasting, and executive-grade variance analysis.

The platform is built for professionals who need financial intelligence at conversational speed — without toggling between spreadsheets, banking portals, and ERP dashboards. Every query is routed through a self-hosted n8n orchestration layer that reasons over 16 domain-specific financial tools, returns structured Markdown with formatted financial tables, and executes with a 60-second timeout tolerance for complex, multi-step agentic workflows.

---

## System Architecture

FinOrchestra uses a strict dual-engine architecture that separates the probabilistic decision-making layer (LLM reasoning) from the deterministic execution layer (deterministic HTTP calls).

**Frontend — Next.js App Router**

The client-facing layer is built on Next.js 14 App Router with strict TypeScript throughout. UI development uses Tailwind CSS with a custom glassmorphism design system: amber-gold accent palette, backdrop-blur surfaces, and financial-grade table rendering. The AI chat interface renders Markdown via `react-markdown` + `remark-gfm`, with custom React component overrides that auto-detect and right-align numeric table cells using monospace tabular figures. Interaction design includes slide-out side panel overlays, staggered skeleton loaders during AI response waits, and micro-interaction hover states on all interactive surfaces. The slide-out panel reuses the existing `ChatWindow`, `ChatInput`, and `TypingIndicator` components without a page navigation dependency.

**Backend — n8n Orchestration Layer**

The AI agent logic runs inside a self-hosted n8n instance. The Next.js frontend sends user messages to `/api/chat` as a JSON POST, which bridges to the n8n webhook via `lib/n8n.ts`. The bridge enforces a 60-second `AbortController` timeout — critical for agentic workflows that chain multiple LLM calls, vector store queries, and database operations that can take 15–30 seconds total. All API keys and webhook URLs live exclusively in `.env.local` and are injected at runtime via `process.env` — zero secrets are hardcoded in source files. The bridge maintains a strict JSON response contract: `{ status: "ok" | "error", message: string, data?: {...} }` and normalizes any shape returned by n8n into this contract before returning to the client.

---

## Core Capabilities

- **16 Domain-Specific Financial Tools** — Treasury (bank balances, exchange rates), Accounting (PPN, PPh 21/23/Badan, invoice validation), Financial Planning (revenue forecasting, budget targets), Investment & Risk (VaR, Sharpe Ratio, live market data via Alpha Vantage), Internal Audit (fraud detection, compliance querying), and Reasoning (multi-step plan orchestration) — all callable in a single conversational thread.
- **Secure API Bridging** — Envoy-style frontend/backend decoupling protects LLM system prompts and downstream API keys. The n8n webhook URL and `x-api-key` header travel only in the server-side bridge layer.
- **Financial Markdown Rendering** — Custom `react-markdown` component overrides detect currency symbols (₹$€£¥) and numeric patterns via regex, automatically injecting `align-right`, `tabular-nums`, and monospace font on numeric table cells. Sticky table headers, zebra striping, and amber-gold border styling produce executive-grade financial tables comparable to Bloomberg terminal exports.
- **60-Second Agentic Timeout** — `AbortController` timeout in `lib/n8n.ts` allows complex multi-step LLM workflows to complete without client-side connection drops. Timeout errors return user-friendly messages distinguishing network errors from AI engine timeouts.
- **Executive UI/UX** — Slide-out chat panel with backdrop blur, skeleton loading indicators, sticky input area, quick-suggestion pills, responsive mobile layout, and zero dependency on page navigation. All interactions are immediate and in-context.

---

## Security & Compliance

FinOrchestra is architected for environments where financial data and LLM system prompts must be protected at the infrastructure level:

- **Zero hardcoded secrets** — Every sensitive value (N8N_WEBHOOK_URL, N8N_API_KEY, any downstream credentials) is injected exclusively via `process.env` at runtime. Source files contain no API keys, tokens, or secret strings.
- **Strict `.gitignore`** — `.env*` files are explicitly ignored at the root. Node modules, `.next` build artifacts, and TypeScript build info are all excluded from the repository.
- **Frontend/backend decoupling** — The n8n webhook URL and API key never reach the client. All bridge logic executes server-side in `lib/n8n.ts` and the `/api/chat` route. Client-side code only sees the normalized JSON response.
- **Clean dependency tree** — Every package in `package.json` is actively imported and used. Orphaned dependencies are pruned before each release commit.

---

## Local Deployment

Clone the repository and install dependencies:

```bash
npm install
```

Copy the environment template and configure your bridge credentials:

```bash
cp .env.local.example .env.local
# Then edit .env.local and set:
# N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/your-workflow
# N8N_API_KEY=your-api-key
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Click **Try the Demo** to open the slide-out CFO chat panel. The Frontend sends your message to `/api/chat`, which forwards it to your n8n webhook. n8n executes the AI agent logic and returns a structured response, rendered as formatted Markdown with financial tables in the chat window.
