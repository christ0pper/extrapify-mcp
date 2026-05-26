import * as z from 'zod/v4';

const DEFAULT_TIMEOUT_MS = 90000;

const rawEnvSchema = z.object({
  EXTRAPIFY_API_BASE_URL: z
    .string()
    .url()
    .describe('The base URL for the Extrapify API.'),

  EXTRAPIFY_API_KEY: z
    .string()
    .min(1)
    .describe(
      'API key used by the MCP server to authenticate with Extrapify.'
    ),

  EXTRAPIFY_API_TIMEOUT_MS: z
    .string()
    .regex(/^[0-9]+$/)
    .describe('Optional request timeout in milliseconds.')
    .optional(),
});

export const mcpConfigSchema = {
  type: 'object',

  required: [
    'EXTRAPIFY_API_BASE_URL',
    'EXTRAPIFY_API_KEY',
  ],

  properties: {
    EXTRAPIFY_API_BASE_URL: {
      type: 'string',
      format: 'uri',
      description: 'The base URL for the Extrapify API.',
    },

    EXTRAPIFY_API_KEY: {
      type: 'string',
      description:
        'API key used by the MCP server to authenticate with Extrapify.',
    },

    EXTRAPIFY_API_TIMEOUT_MS: {
      type: 'integer',
      minimum: 1000,
      description: 'Optional request timeout in milliseconds.',
    },
  },
};

export function getMcpConfig() {
  const result = rawEnvSchema.safeParse({
    EXTRAPIFY_API_BASE_URL:
      process.env.EXTRAPIFY_API_BASE_URL,

    EXTRAPIFY_API_KEY:
      process.env.EXTRAPIFY_API_KEY,

    EXTRAPIFY_API_TIMEOUT_MS:
      process.env.EXTRAPIFY_API_TIMEOUT_MS,
  });

  // IMPORTANT:
  // Allow MCP scanners/registries to initialize the server
  // without requiring credentials during startup.
  if (!result.success) {
    return {
      apiBaseUrl: '',
      apiKey: '',
      requestTimeoutMs: DEFAULT_TIMEOUT_MS,

      serverName: 'extrapify-mcp',
      serverVersion: '1.0.0',

      isConfigured: false,
    };
  }

  const {
    EXTRAPIFY_API_BASE_URL,
    EXTRAPIFY_API_KEY,
    EXTRAPIFY_API_TIMEOUT_MS,
  } = result.data;

  return {
    apiBaseUrl: new URL(EXTRAPIFY_API_BASE_URL)
      .toString()
      .replace(/\/+$/, ''),

    apiKey: EXTRAPIFY_API_KEY,

    requestTimeoutMs: EXTRAPIFY_API_TIMEOUT_MS
      ? Number(EXTRAPIFY_API_TIMEOUT_MS)
      : DEFAULT_TIMEOUT_MS,

    serverName: 'extrapify-mcp',
    serverVersion: '1.0.0',

    isConfigured: true,
  };
}
