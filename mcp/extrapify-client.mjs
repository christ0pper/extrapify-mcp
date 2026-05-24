import { getMcpConfig } from './config.mjs';

export class ExtrapifyApiError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'ExtrapifyApiError';
    this.details = details;
  }
}

function buildHeaders(apiKey) {
  return {
    'content-type': 'application/json',
    'x-api-key': apiKey,
  };
}

async function parseJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function callExtractStructuredData(input) {
  const config = getMcpConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.requestTimeoutMs);

  try {
    const response = await fetch(`${config.apiBaseUrl}/api/v1/extract`, {
      body: JSON.stringify(input),
      headers: buildHeaders(config.apiKey),
      method: 'POST',
      signal: controller.signal,
    });

    const body = await parseJson(response);
    const requestId = response.headers.get('x-request-id');

    if (!response.ok) {
      throw new ExtrapifyApiError(
        body?.error || `Extraction request failed with status ${response.status}`,
        {
          body,
          requestId,
          status: response.status,
        }
      );
    }

    return {
      data: body,
      requestId,
      status: response.status,
    };
  } catch (error) {
    if (error instanceof ExtrapifyApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ExtrapifyApiError('Extraction request timed out', {
        requestId: null,
        status: 504,
      });
    }

    throw new ExtrapifyApiError(
      error instanceof Error ? error.message : 'Unexpected extraction transport error',
      {
        requestId: null,
        status: 500,
      }
    );
  } finally {
    clearTimeout(timeout);
  }
}
