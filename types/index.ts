export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

export interface N8nWebhookPayload {
  message: string;
}

export interface N8nWebhookResponse {
  status: 'ok' | 'error';
  message: string;
  data?: {
    reply?: string;
    tools_executed?: string[];
    execution_time_ms?: number;
  };
}

export interface ToolInfo {
  name: string;
  category: string;
  icon: string;
  description: string;
}

export const TOOLS: ToolInfo[] = [
  { name: 'Check bank balances', category: 'Treasury', icon: '💰', description: 'Current cash position across all accounts' },
  { name: 'get_exchange_rate', category: 'Treasury', icon: '💱', description: 'Live IDR/USD/EUR/SGD exchange rates' },
  { name: 'read_invoice_text', category: 'Accounting', icon: '📄', description: 'Extract vendor/date/amount from invoice files' },
  { name: 'calculate_tax', category: 'Accounting', icon: '🧮', description: 'Indonesian tax calculation (PPN, PPh 21, PPh 23, PPh Badan)' },
  { name: 'check_if_invoice_exists', category: 'Accounting', icon: '🔍', description: 'Duplicate invoice check in Google Sheets' },
  { name: 'consult_policy', category: 'Accounting', icon: '📋', description: 'Search internal expense policy vector store' },
  { name: 'get_historical_trends', category: 'Financial Planning', icon: '📈', description: 'Historical transaction data analysis' },
  { name: 'generate_forecast', category: 'Financial Planning', icon: '🔮', description: 'Revenue forecast with confidence bands' },
  { name: 'Budget', category: 'Financial Planning', icon: '📊', description: 'Budget targets from database' },
  { name: 'Calculator', category: 'Financial Analysis', icon: '⚖️', description: 'Variance analysis (actual vs budget)' },
  { name: 'get_market_data', category: 'Investment & Risk', icon: '📉', description: 'Live prices via Alpha Vantage (AAPL, BTC, etc.)' },
  { name: 'calculate_portfolio_risk', category: 'Investment & Risk', icon: '🎯', description: 'VaR + Sharpe Ratio calculation' },
  { name: 'get_accounting_records', category: 'Internal Audit', icon: '📒', description: 'Retrieve all accounting records for audit' },
  { name: 'fraud_check_logic', category: 'Internal Audit', icon: '🔎', description: 'Detect split payments and duplicate transactions' },
  { name: 'consult_compliance_rules', category: 'Internal Audit', icon: '⚖️', description: 'Search internal compliance policy vector store' },
  { name: 'Think', category: 'Reasoning', icon: '🧠', description: 'Plan complex multi-step analysis' },
];