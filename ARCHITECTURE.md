# Architecture --- Proposed, Not Yet Approved

## Current status

Planning only. This is a proposal to review, not permission to start
implementation.

## Proposed components

1.  **Chat UI:** React + Vite.
2.  **Backend API:** Node.js + Express.
3.  **ERPNext adapter:** server-side client using Frappe/ERPNext APIs.
4.  **Credit service:** deterministic business logic for lookup,
    receivables, ageing and summary assembly.
5.  **LLM orchestration:** optional model with tool/function calling; it
    can select approved tools and explain results, but cannot calculate
    or invent financial truth.
6.  **Persistence:** initially avoid storing accounting data unless
    needed. If audit/history persistence is required, choose a database
    and retention policy via a decision record.
7.  **Observability:** redacted operational logs, error handling and
    request IDs.

## Request flow

User question → backend authentication/authorisation → intent/tool
selection → validated customer resolver → approved ERPNext read
operation → deterministic service → schema-validated result → response
formatter/LLM explanation → user.

The LLM must not receive credentials, arbitrary SQL access or
unrestricted ERPNext methods.

## Integration boundaries

-   All ERPNext calls occur server-side.
-   Use a dedicated integration user with minimal read-only permissions.
-   Use explicit DocTypes, fields, filters and pagination.
-   Confirm field names and report API behaviour against the company's
    ERPNext version and configuration.
-   Do not assume the public demo and the trading company's instance
    have identical customisations.
-   Use HTTPS and timeouts.
-   Cache only if freshness requirements and invalidation behaviour are
    agreed.

## Proposed API shape

These are conceptual internal endpoints; names may change after
review: - `GET /api/customers?query=...` -
`GET /api/customers/:customerId/credit-summary` -
`GET /api/customers/:customerId/invoices?status=overdue` -
`GET /api/health`

Protect all financial endpoints. Do not expose a generic proxy to the
ERPNext API.

## Suggested repository structure after approval

``` text
frontend/
backend/
  src/
    routes/
    services/
    integrations/erpnext/
    security/
    schemas/
    app.js
    server.js
tests/
docs/
```

## Architecture decisions still required

-   Exact coding agent and MCP configuration for REA.
-   ERPNext version and hosting model.
-   Authentication for bot users.
-   Approved receivables source/report and filters.
-   Credit exposure formula and status policy.
-   Currency and timezone rules.
-   LLM provider, data handling and budget.
-   Whether audit/history data must be persisted.
-   Deployment target and secret management.

Record accepted decisions in `DECISIONS.md` before implementation.
