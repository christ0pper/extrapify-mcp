import * as z from 'zod/v4';
import { callExtractStructuredData, ExtrapifyApiError } from '../extrapify-client.mjs';

const inputSchema = {
  mode: z
    .enum(['auto', 'single', 'list'])
    .default('auto')
    .describe('Extraction mode. Use auto unless you need a forced single object or list.'),
  schema: z
    .record(z.string(), z.unknown())
    .describe('Schema-guided extraction definition using Extrapify field types and nested objects.'),
  url: z.string().url().describe('Public webpage URL to extract structured data from.'),
};

function buildSuccessText(result) {
  return JSON.stringify(
    {
      confidence: result.confidence,
      count: result.count,
      extracted: result.extracted,
      tokens_used: result.tokens_used,
      type: result.type,
    },
    null,
    2
  );
}

function buildErrorText(error) {
  return JSON.stringify(
    {
      error: error.message,
      request_id: error.details?.requestId ?? null,
      status: error.details?.status ?? 500,
      upstream: error.details?.body ?? null,
    },
    null,
    2
  );
}

export const extractStructuredDataTool = {
  definition: {
    description:
      "Retrieve structured web context from a public webpage using Extrapify's schema-guided extraction engine.",
    inputSchema,
  },
  name: 'extract_structured_data',
  async run(input) {
    try {
      const result = await callExtractStructuredData(input);

      return {
        content: [
          {
            text: buildSuccessText(result.data),
            type: 'text',
          },
        ],
        structuredContent: {
          request_id: result.requestId,
          ...result.data,
        },
      };
    } catch (error) {
      if (error instanceof ExtrapifyApiError) {
        return {
          content: [
            {
              text: buildErrorText(error),
              type: 'text',
            },
          ],
          isError: true,
          structuredContent: {
            error: error.message,
            request_id: error.details?.requestId ?? null,
            status: error.details?.status ?? 500,
            upstream: error.details?.body ?? null,
          },
        };
      }

      throw error;
    }
  },
};
