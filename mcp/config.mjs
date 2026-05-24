const DEFAULT_TIMEOUT_MS = 90000;

function getRequiredEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getBaseUrl() {
  const value = getRequiredEnv('EXTRAPIFY_API_BASE_URL');

  try {
    return new URL(value).toString().replace(/\/+$/, '');
  } catch {
    throw new Error('EXTRAPIFY_API_BASE_URL must be a valid absolute URL');
  }
}

function getTimeoutMs() {
  const raw = process.env.EXTRAPIFY_API_TIMEOUT_MS?.trim();

  if (!raw) {
    return DEFAULT_TIMEOUT_MS;
  }

  const parsed = Number.parseInt(raw, 10);

  if (!Number.isFinite(parsed) || parsed < 1000) {
    throw new Error('EXTRAPIFY_API_TIMEOUT_MS must be an integer greater than or equal to 1000');
  }

  return parsed;
}

export function getMcpConfig() {
  return {
    apiBaseUrl: getBaseUrl(),
    apiKey: getRequiredEnv('EXTRAPIFY_API_KEY'),
    requestTimeoutMs: getTimeoutMs(),
    serverName: 'extrapify-mcp',
    serverVersion: '1.0.0',
  };
}
