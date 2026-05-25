import * as z from 'zod/v4';
import { callExtractStructuredData, ExtrapifyApiError } from '../extrapify-client.mjs';

const inputSchema = {
  url: z
    .string()
    .url()
    .describe(
      'Fully qualified public webpage URL to extract structured data from (e.g. https://example.com/article). Must be publicly accessible. Does not support login-protected or paywalled pages.'
    ),

  schema: z
    .record(z.string(), z.unknown())
    .describe(
      'Schema definition that controls what fields to extract. Each key is the field name and each value is the field type. Supported types: "string", "number", "integer", "float", "boolean", "date", "datetime", "url", and array variants using [] suffix (e.g. "string[]"). Example: { "title": "string", "price": "number", "tags": "string[]", "published_at": "date" }. Nested objects are supported for grouped fields.'
    ),

  mode: z
    .enum(['auto', 'single', 'list'])
    .default('auto')
    .describe(
      'Extraction mode controlling how many items are returned. "auto" detects automatically based on page structure (recommended). "single" forces extraction of one primary item only (use for product pages, articles, profiles). "list" extracts all matching items as an array (use for search results, directories, tables). Default: "auto".'
    ),
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
      "Extract structured JSON from any public webpage using Extrapify's schema-guided extraction engine. Define the fields you want (title, price, author, tags, etc.) and their types, point the tool at a URL, and get back validated, typed JSON. Handles JavaScript-heavy pages via Browserless rendering. Ideal for scraping product pages, articles, job listings, company data, search results, and any other structured web content. Returns extracted fields, confidence score, item count, and tokens used.",
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
