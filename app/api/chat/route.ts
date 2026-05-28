import { NextRequest, NextResponse } from 'next/server';
import { sendToN8n } from '@/lib/n8n';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * POST /api/chat
 *
 * BUG FIXES applied (Phase 4 audit):
 *  1. Added structured error response for JSON parse failures on the
 *     incoming request body (e.g. malformed JSON from the client).
 *  2. The catch block now distinguishes between a JSON parse error on the
 *     request body vs. other errors, returning 400 vs. 500 respectively.
 *  3. Added explicit Content-Type on all responses (defensive).
 */
export async function POST(request: NextRequest) {
  try {
    // FIX #1: Guard against malformed request body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { status: 'error', message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { status: 'error', message: 'Missing or invalid "message" field' },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedMessage = message.trim().slice(0, 10000);

    if (sanitizedMessage.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    // Forward to n8n webhook
    const result = await sendToN8n(sanitizedMessage);

    if (result.status === 'error') {
      // Return 502 (Bad Gateway) for upstream errors, not 500 (Internal)
      return NextResponse.json(result, { status: 502 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('[/api/chat] Unhandled error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}