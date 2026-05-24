# Extrapify MCP Integration Layer

This directory contains the public MCP protocol layer for Extrapify.

## Scope

- stdio MCP server
- tool registry
- thin API client
- tool modules
- example client configs

## Design

- Thin: forwards requests to the hosted Extrapify API
- Stateless: no local extraction state or infrastructure dependencies
- Compatible: works with Claude Desktop, Cursor, and other stdio MCP clients

## Environment

- `EXTRAPIFY_API_BASE_URL`
- `EXTRAPIFY_API_KEY`
- Optional: `EXTRAPIFY_API_TIMEOUT_MS`

## Available tool

### `extract_structured_data`

Retrieve structured web context from a public webpage using a schema-guided request.
