# Extrapify MCP Client

Extrapify MCP Client is a thin, stateless Model Context Protocol integration layer for the hosted Extrapify API.

This repository is intentionally limited to the public MCP-facing surface:

- MCP protocol server
- MCP tool definitions
- Claude Desktop configuration examples
- schema templates
- install and troubleshooting docs
- a minimal Extrapify API client

Extraction does not happen inside this package. The MCP server forwards requests to the hosted Extrapify API, which handles structured extraction, Browserless rendering, observability, quotas, and analytics on the backend.

## What this repo is

- A lightweight MCP server you can run locally over stdio
- A production-ready bridge between MCP clients and Extrapify's extraction API
- A public integration layer that MCP marketplaces can index quickly

## What this repo is not

- The full Extrapify backend
- A scraping framework
- An autonomous agent runtime

## Install

```bash
npm install
```

Copy `.env.example` to `.env` and set:

```bash
EXTRAPIFY_API_BASE_URL=https://your-extrapify-api-host
EXTRAPIFY_API_KEY=sk_live_your_key_here
```

Start the server:

```bash
npm run mcp:start
```

Optional validation:

```bash
npm run build
```

## Claude Desktop setup

Example config files live in [mcp/configs](./mcp/configs).

Typical config:

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

## Cursor setup

Cursor supports stdio MCP servers. Point it at `node` and the local `mcp/server.mjs` entrypoint, then provide the same two environment variables.

Use [docs/mcp-install-examples.md](./docs/mcp-install-examples.md) for copy-paste examples.

## OpenClaw / Hermes compatibility

Any MCP client that supports stdio transport should work with this package. OpenClaw, Hermes, and similar tools usually only need:

- `command`: `node`
- `args`: path to `mcp/server.mjs`
- `env`: `EXTRAPIFY_API_BASE_URL` and `EXTRAPIFY_API_KEY`

If a client expects MCP discovery, this package exposes a standard tool registry with the `extract_structured_data` tool.

## Available tool

### `extract_structured_data`

Retrieve structured JSON from a public webpage using a schema-guided request.

Example tool input:

```json
{
  "url": "https://example.com/article",
  "mode": "auto",
  "schema": {
    "title": "string",
    "author": "string",
    "published_at": "date",
    "tags": "string[]"
  }
}
```

## Schema templates

Starter schemas are documented in [docs/schema-templates.md](./docs/schema-templates.md).

## Example workflows

Workflow ideas and agent patterns are documented in [docs/demo-workflows.md](./docs/demo-workflows.md).

## Troubleshooting

- If the server exits immediately, verify `EXTRAPIFY_API_BASE_URL` is a valid absolute URL.
- If tool calls fail with `401` or `403`, verify the API key and target API host.
- If the client cannot discover tools, confirm it is launching `node` against `mcp/server.mjs` over stdio.
- If requests time out, verify the upstream API is reachable from your machine.

## Repository layout

- [mcp/server.mjs](./mcp/server.mjs)
- [mcp/tool-registry.mjs](./mcp/tool-registry.mjs)
- [mcp/extrapify-client.mjs](./mcp/extrapify-client.mjs)
- [mcp/tools](./mcp/tools)
- [mcp/configs](./mcp/configs)
- [docs/mcp-install-examples.md](./docs/mcp-install-examples.md)
- [docs/schema-templates.md](./docs/schema-templates.md)
- [docs/demo-workflows.md](./docs/demo-workflows.md)
- [docs/mcp-marketplace-copy.md](./docs/mcp-marketplace-copy.md)
