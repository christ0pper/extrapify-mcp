# Extrapify MCP Marketplace Copy

## Listing title

Extrapify MCP Client

## Short tagline

Thin MCP integration layer for schema-guided web extraction

## Short description

Connect Claude Desktop, Cursor, and other MCP clients to Extrapify's hosted extraction API through a lightweight local stdio server.

## Full description

Extrapify MCP Client is a production-ready, ecosystem-friendly MCP package for teams that want structured web context inside agent workflows without operating extraction infrastructure in the client process.

This package stays intentionally thin and stateless. It handles MCP protocol concerns, tool definitions, request validation, and forwarding to the hosted Extrapify API.

Extrapify itself remains responsible for structured extraction, Browserless rendering, observability, quotas, and analytics behind the API boundary.

## Primary tool

### `extract_structured_data`

Retrieve structured web context from a public webpage using a schema-guided extraction request.

## Audience

- AI platform engineers
- backend teams
- data infrastructure teams
- agent workflow builders

## Keywords

- structured web context
- schema-guided extraction
- MCP
- Model Context Protocol
- Claude Desktop
- Cursor
