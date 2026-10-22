# Open Questions --- Resolve Before Implementation

Mark each question `RESOLVED` only after recording the answer and
approver. Link significant decisions from `DECISIONS.md`.

## Product and users

-   [x] **RESOLVED (GOV-001, GOV-003):** Internal sales staff and accounts/finance staff (`Sales User`, `Accounts User`) only. Protected behind internal corporate network / VPN.
-   [x] **RESOLVED (DEC-003):** Initial interface is a Web Chat (React + Vite, Node.js + Express backend).
-   [x] **RESOLVED (GOV-001):** Customer self-service is explicitly OUT OF SCOPE for initial releases.
-   [x] **RESOLVED (DEC-005):** Real-time API query per request; response time target <1.5s with deterministic aggregation.

## ERPNext

-   [x] **RESOLVED (GOV-002):** Initial local development and automated unit/integration tests use synthetic ERPNext fixtures. Staging/Production connection details to be provided prior to live deployment.
-   [x] **RESOLVED (DEC-001):** Integration user requires read-only permissions on `Customer`, `Sales Invoice`, `Payment Entry`, `Sales Order`, and `Delivery Note`.
-   [x] **RESOLVED (DEC-005):** Canonical ERPNext URLs will link directly to `/app/sales-invoice/<name>` and `/app/customer/<name>`.

## Finance rules

-   [x] **RESOLVED (DEC-005):** Outstanding balance reconciles with ERPNext Accounts Receivable logic.
-   [x] **RESOLVED (DEC-004):** Total Credit Exposure = Outstanding Invoices + Unbilled Delivery Notes + Active Sales Orders ('To Deliver and Bill', 'To Bill').
-   [x] **RESOLVED (DEC-004):** Available Credit = Credit Limit - Total Credit Exposure. If limit is missing, marked as unconfigured/unknown.
-   [x] **RESOLVED (DEC-005):** Ageing calculated based on invoice **Due Date** with standard buckets: Current, 1–30d, 31–60d, 61–90d, 90d+ overdue.
-   [x] **RESOLVED (DEC-004):** Multi-currency is displayed in original transaction currency and customer billing currency; no ad-hoc currency conversion.

## AI and privacy

-   [x] **RESOLVED (GOV-005, DEC-002, DEC-006):** LLM does not perform financial arithmetic or execute arbitrary SQL/APIs. The model receives only sanitized, typed schema data for query intent mapping and conversational summary formatting.
-   [x] **RESOLVED (DEC-001):** No production credentials or live confidential customer records are stored or committed.

## Operations

-   [x] **RESOLVED (GOV-003, DEC-003):** Node.js / Express backend service running in internal environment, serving React frontend over HTTPS.
-   [x] **RESOLVED (GOV-006):** Git branch discipline enforced (`feat/TASK-xxx`, `fix/TASK-xxx`, `docs/TASK-xxx`). All merges require human review.
