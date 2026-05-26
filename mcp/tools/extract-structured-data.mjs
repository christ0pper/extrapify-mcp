import { getMcpConfig } from './config.mjs';

export class ExtrapifyApiError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ExtrapifyApiError';
    this.details = details;
  }
}

export async function callExtractStructuredData(input) {
  const config = getMcpConfig();

  // Smithery scans without env vars
  // Return a structured error instead of failing with a fetch exception
  if (!config.isConfigured) {
    throw new ExtrapifyApiError(
      'Extrapify MCP is not configured. Set EXTRAPIFY_API_KEY and EXTRAPIFY_API_BASE_URL.',
      {
        requestId: null,
        status: 503,
      }
    );
  }

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, config.timeoutMs ?? 60000);

  try {
    const response = await fetch(
      `${config.baseUrl}/extract-structured-data`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(input),
        signal: controller.signal,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new ExtrapifyApiError(
        data?.error || 'Extraction request failed.',
        {
          requestId: data?.request_id ?? null,
          status: response.status,
          body: data,
        }
      );
    }

    return {
      requestId: data?.request_id ?? null,
      data,
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ExtrapifyApiError(
        'Extraction request timed out.',
        {
          requestId: null,
          status: 504,
        }
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
