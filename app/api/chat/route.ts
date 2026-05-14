import { NextRequest, NextResponse } from 'next/server';
import { sendToN8n } from '@/lib/n8n';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}