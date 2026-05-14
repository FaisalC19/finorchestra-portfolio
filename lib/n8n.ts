import { N8nWebhookPayload, N8nWebhookResponse } from '@/types';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || '';
const N8N_API_KEY = process.env.N8N_API_KEY || '';

export async function sendToN8n(message: string): Promise<N8nWebhookResponse> {
  if (!N8N_WEBHOOK_URL) {
    console.error('N8N_WEBHOOK_URL not configured');
    return {
      status: 'error',
      message: 'Service configuration error. Please contact support.',
    };
  }

  try {
    const payload: N8nWebhookPayload = { message };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(N8N_API_KEY && { 'x-api-key': N8N_API_KEY }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('N8n webhook error:', response.status, errorText);
      return {
        status: 'error',
        message: `Service error: ${response.status} ${response.statusText}`,
      };
    }

    const data: N8nWebhookResponse = await response.json();
    return data;

  } catch (error) {
    console.error('N8n webhook fetch error:', error);
    return {
      status: 'error',
      message: 'Network error. Please check your connection and try again.',
    };
  }
}
