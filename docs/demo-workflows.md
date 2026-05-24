# Extrapify Demo Workflows

## Workflow 1: research agent enrichment

1. An agent identifies a public page worth analyzing.
2. The agent calls `extract_structured_data` with a schema.
3. Extrapify returns typed JSON plus confidence metadata.
4. The result is stored or passed into downstream ranking, retrieval, or summarization.

Example tool input:

```json
{
  "url": "https://example.com/company",
  "mode": "auto",
  "schema": {
    "company_name": "string",
    "description": "string",
    "headquarters": "string",
    "website": "url"
  }
}
```

## Workflow 2: monitoring pipeline

1. A scheduler iterates over monitored URLs.
2. A worker calls Extrapify through MCP.
3. Structured results are diffed against prior snapshots.
4. Alerting or sync jobs run when important fields change.

## Workflow 3: analyst copilot

1. An analyst asks for structured output from a public page.
2. The MCP client invokes `extract_structured_data`.
3. Extrapify returns normalized JSON instead of raw page markup.
4. The assistant uses the structured output for review or reporting.

## Workflow 4: validation queue

1. A human reviewer submits a schema and source URL.
2. Extrapify returns typed fields and confidence.
3. Low-confidence records are flagged for approval.
4. Approved records move into downstream systems.
