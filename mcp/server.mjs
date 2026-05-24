import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { getMcpConfig } from './config.mjs';
import { registeredTools } from './tool-registry.mjs';

function createServer() {
  const config = getMcpConfig();
  const server = new McpServer({
    name: config.serverName,
    version: config.serverVersion,
  });

  for (const tool of registeredTools) {
    server.registerTool(tool.name, tool.definition, tool.run);
  }

  return server;
}

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);
  process.stderr.write('Extrapify MCP server running on stdio\n');
}

main().catch((error) => {
  process.stderr.write(
    `Extrapify MCP server failed to start: ${error instanceof Error ? error.message : 'Unknown error'}\n`
  );
  process.exit(1);
});
