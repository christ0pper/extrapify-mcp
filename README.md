# Extrapify MCP

Extract structured JSON from any public webpage inside Claude Desktop, Cursor, or any MCP-compatible client.

Define a schema. Point it at a URL. Get back validated, typed JSON.

**Get an API key → [extrapify.com](https://extrapify.com)**

---

## What this is

A thin, stateless MCP server that bridges MCP clients to the hosted [Extrapify API](https://extrapify.com).

Extraction does not happen inside this package. The MCP server forwards requests to the Extrapify API, which handles fetching, Browserless rendering for JS-heavy pages, Claude-powered extraction, schema validation, quota accounting, and observability on the backend.

- MCP protocol server over stdio
- One tool: `extract_structured_data`
- Production-ready bridge, not a scraping framework
- No extraction logic, no state, no side effects

---

## Install

```bash
npm install
```

Copy `.env.example` to `.env` and fill in your credentials:

```bash
EXTRAPIFY_API_BASE_URL=https://extrapify.com
EXTRAPIFY_API_KEY=sk_live_your_key_here
```

Start the server:

```bash
npm run mcp:start
```

---

## Claude Desktop setup

Add this block to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "extrapify": {
      "command": "node",
      "args": ["/absolute/path/to/extrapify-mcp/mcp/server.mjs"],
      "env": {
        "EXTRAPIFY_API_BASE_URL": "https://extrapify.com",
        "EXTRAPIFY_API_KEY": "sk_live_your_key_here"
      }
    }
  }
}
```

Restart Claude Desktop. The `extract_structured_data` tool will appear automatically.

---

## Cursor setup

Cursor supports stdio MCP servers. Point it at `node` and the local `mcp/server.mjs` entrypoint with the same two environment variables.

See [docs/mcp-install-examples.md](./docs/mcp-install-examples.md) for copy-paste configs.

---

## Tool: `extract_structured_data`

Retrieve structured JSON from any public webpage using a schema you define.

**Input:**

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

**Output:**

```json
{
  "extracted": {
    "title": "How Claude Agents Are Changing Developer Workflows",
    "author": "Jane Smith",
    "published_at": "2026-04-15",
    "tags": ["AI", "agents", "developer tools"]
  },
  "type": "single",
  "count": 1,
  "confidence": 0.96,
  "tokens_used": 1820
}
```

**Supported schema types:**
`string`, `number`, `integer`, `float`, `boolean`, `date`, `datetime`, `url`, and any of these as arrays using `[]` suffix (e.g. `string[]`).

**Supported `mode` values:**
- `auto` — let Extrapify decide based on page structure
- `single` — extract the primary item only
- `list` — extract all matching items as an array

---

## Schema templates

Starter schemas for common use cases (product pages, job listings, articles, company data) are in [docs/schema-templates.md](./docs/schema-templates.md).

---

## Example workflows

Agent patterns and demo workflows are in [docs/demo-workflows.md](./docs/demo-workflows.md).

---

## Other compatible clients

Any MCP client that supports stdio transport works with this package. Typically you only need:

- `command`: `node`
- `args`: absolute path to `mcp/server.mjs`
- `env`: `EXTRAPIFY_API_BASE_URL` and `EXTRAPIFY_API_KEY`

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Server exits immediately | Verify `EXTRAPIFY_API_BASE_URL` is a valid absolute URL |
| Tool calls return `401` or `403` | Check your API key at [extrapify.com/dashboard](https://extrapify.com/dashboard) |
| Client cannot discover tools | Confirm it is launching `node` against `mcp/server.mjs` over stdio |
| Requests time out | Verify the Extrapify API is reachable from your machine |
| JS-heavy pages return empty content | Extrapify handles Browserless fallback automatically — no action needed |

---

## Repository layout

```
mcp/
  server.mjs               ← MCP stdio server entrypoint
  tool-registry.mjs        ← tool definitions
  extrapify-client.mjs     ← minimal Extrapify API client
  tools/
    extract-structured-data.mjs
  configs/
    claude-desktop.local.example.json
    claude-desktop.production.example.json
docs/
  mcp-install-examples.md
  schema-templates.md
  demo-workflows.md
  mcp-marketplace-copy.md
```

---

## Links

- API and pricing: [extrapify.com](https://extrapify.com)
- Docs: [extrapify.com/docs](https://extrapify.com/docs)
- Dashboard: [extrapify.com/dashboard](https://extrapify.com/dashboard)
