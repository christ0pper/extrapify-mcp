# Extrapify MCP Install Examples

## Quick start

```bash
npm install
npm run mcp:start
```

Required environment variables:

- `EXTRAPIFY_API_BASE_URL`
- `EXTRAPIFY_API_KEY`

## Claude Desktop

Use [../mcp/configs/claude-desktop.production.example.json](../mcp/configs/claude-desktop.production.example.json) as a starting point.

Example:

```json
{
  "mcpServers": {
    "extrapify": {
      "command": "node",
      "args": ["C:/path/to/extrapify-mcp/mcp/server.mjs"],
      "env": {
        "EXTRAPIFY_API_BASE_URL": "https://your-extrapify-api-host",
        "EXTRAPIFY_API_KEY": "sk_live_your_key_here"
      }
    }
  }
}
```

## Cursor

Create an MCP server entry that launches:

- `command`: `node`
- `args`: `["C:/path/to/extrapify-mcp/mcp/server.mjs"]`
- `env`: `EXTRAPIFY_API_BASE_URL`, `EXTRAPIFY_API_KEY`

## OpenClaw / Hermes

These clients typically work with the same stdio wiring:

```json
{
  "command": "node",
  "args": ["C:/path/to/extrapify-mcp/mcp/server.mjs"],
  "env": {
    "EXTRAPIFY_API_BASE_URL": "https://your-extrapify-api-host",
    "EXTRAPIFY_API_KEY": "sk_live_your_key_here"
  }
}
```

## Local API target

If you are pointing at a locally running Extrapify API, use [../mcp/configs/claude-desktop.local.example.json](../mcp/configs/claude-desktop.local.example.json).

## Validation commands

```bash
npm run build
npm run mcp:start
```

## Expected discovery

After the client connects, MCP discovery should expose:

- `extract_structured_data`
