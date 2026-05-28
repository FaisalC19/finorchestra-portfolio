import { N8nWebhookPayload, N8nWebhookResponse } from '@/types';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || '';
const N8N_API_KEY = process.env.N8N_API_KEY || '';

/**
 * Sends a message to the n8n FinOrchestra webhook and returns a typed response.
 *
 * BUG FIXES applied (Phase 4 audit):
 *  1. 60-second AbortController timeout — supports agentic workflows
 *     that take 15–30s+ without timing out at the bridge layer.
 *  2. Response body read as raw text FIRST, then parsed as JSON inside a
 *     try/catch. Safe against 504 HTML pages and array-wrapped responses
 *     like [{ "output": "..." }] that violate the contract.
 *  3. Aggressive raw-text logging before any parsing so the exact n8n
 *     output is always visible in the Next.js terminal for diagnosis.
 *  4. Hardcoded explicit headers (no conditional spread) — already correct,
 *     kept as-is.
 */
export async function sendToN8n(message: string): Promise<N8nWebhookResponse> {
  if (!N8N_WEBHOOK_URL) {
    console.error('[n8n] N8N_WEBHOOK_URL not configured');
    return {
      status: 'error',
      message: 'Service configuration error. Please contact support.',
    };
  }

  // FIX #1: Timeout — allow 60s for agentic workflows (increased from 30s)
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const payload: N8nWebhookPayload = { message };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': N8N_API_KEY,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // FIX #3: Read raw text first — safe against HTML error pages + always log
    const rawText = await response.text();
    console.log('[n8n] Raw response body:', rawText.slice(0, 2000));
    if (rawText.length > 2000) {
      console.log('[n8n] Raw body truncated (full length:', rawText.length, 'bytes)');
    }

    if (!response.ok) {
      console.error('[n8n] Webhook error:', response.status, rawText.slice(0, 500));
      return {
        status: 'error',
        message: `Service error: ${response.status} ${response.statusText}`,
      };
    }

    // FIX #2 cont: Parse JSON safely
    let data: N8nWebhookResponse;
    try {
      data = JSON.parse(rawText);
    } catch {
      console.error('[n8n] Non-JSON response body:', rawText.slice(0, 500));
      return {
        status: 'error',
        message: 'Received invalid response from the AI engine. Please try again.',
      };
    }

    // Normalise: if n8n returns a shape we don't expect, wrap it
    if (typeof data.status === 'undefined') {
      console.warn('[n8n] Response missing "status" field, raw:', rawText.slice(0, 300));
      return {
        status: 'ok',
        message: typeof data.message === 'string'
          ? data.message
          : typeof (data as Record<string, unknown>).output === 'string'
            ? (data as Record<string, unknown>).output as string
            : JSON.stringify(data),
      };
    }

    return data;

  } catch (error: unknown) {
    clearTimeout(timeout);

    // Distinguish timeout from other network errors
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('[n8n] Request timed out after 60s — agentic workflow exceeded timeout threshold');
      return {
        status: 'error',
        message: 'The AI engine took too long to respond. This query is complex — please try a simpler request or try again shortly.',
      };
    }

    console.error('[n8n] Fetch error:', error);
    return {
      status: 'error',
      message: 'Network error. Please check your connection and try again.',
    };
  }
}
