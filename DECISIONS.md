# Architecture and Product Decision Log

Record decisions that affect scope, behaviour, security, dependencies or
architecture. New entries are proposed until explicitly marked
`ACCEPTED` by the owner.

## Decision template

### DEC-XXX --- Short title

-   **Status:** PROPOSED / ACCEPTED / REJECTED / SUPERSEDED
-   **Date:**
-   **Owner/approver:**
-   **Context:**
-   **Options considered:**
-   **Decision:**
-   **Consequences and risks:**
-   **Follow-up tasks:**

------------------------------------------------------------------------

## DEC-001 --- Keep the initial ERPNext integration read-only

-   **Status:** ACCEPTED
-   **Date:** 2026-10-22
-   **Owner/approver:** Human project owner
-   **Context:** The bot handles sensitive financial information;
    accidental writes would be high impact.
-   **Options considered:** Read-only first; read/write integration.
-   **Decision:** Read-only access for the MVP. Dedicated read-only API credentials.
-   **Consequences and risks:** The bot cannot create reminders or
    change accounting records. Those features require a separate review
    and decision.
-   **Follow-up tasks:** INT-001

## DEC-002 --- Financial figures must be grounded in ERPNext data

-   **Status:** ACCEPTED
-   **Date:** 2026-10-22
-   **Owner/approver:** Human project owner
-   **Context:** LLM-generated numbers are not acceptable as accounting
    truth.
-   **Options considered:** Ask the model to calculate from text;
    deterministic service using validated source data.
-   **Decision:** Deterministic calculation/retrieval with the
    LLM limited to intent selection and explanation.
-   **Consequences and risks:** More explicit schemas and tests are
    required, but results are auditable and strictly verifiable.
-   **Follow-up tasks:** FIN-002, AI-001

## DEC-003 --- Use React/Vite + Node/Express as the initial technical proposal

-   **Status:** ACCEPTED
-   **Date:** 2026-10-22
-   **Owner/approver:** Human project owner
-   **Context:** A web chat plus backend can keep ERPNext credentials
    out of the browser.
-   **Options considered:** Web app, messaging bot, direct
    client-to-ERPNext.
-   **Decision:** Web MVP using React/Vite for frontend and Node.js/Express for backend API.
-   **Consequences and risks:** Messaging integrations (Slack/Teams/WhatsApp) and persistence
    can be added later if approved.
-   **Follow-up tasks:** UI-001, INT-001

## DEC-004 --- Credit Exposure Calculation Policy for Trading Workflow

-   **Status:** ACCEPTED
-   **Date:** 2026-10-22
-   **Owner/approver:** Human project owner
-   **Context:** In a trading company, customer exposure extends beyond posted invoices
    to goods already dispatched (unbilled delivery notes) and reserved stock (active sales orders).
-   **Options considered:**
    1. Invoices only (understates exposure).
    2. Invoices + Unbilled Delivery Notes + Active Sales Orders (realistic trading exposure).
-   **Decision:** Total Credit Exposure = Total Outstanding Invoices + Unbilled Delivery Notes + Active Sales Orders (status in 'To Deliver and Bill', 'To Bill'). Available Credit = Credit Limit - Total Credit Exposure. If no credit limit is set, treat it as unconfigured/unknown, not zero.
-   **Consequences and risks:** Requires querying open Sales Orders and Delivery Notes in addition to Sales Invoices. Calculations must reconcile with ERPNext credit limit validation logic.
-   **Follow-up tasks:** FIN-002, FIN-003

## DEC-005 --- Authoritative Receivables Source and Due-Date Ageing Basis

-   **Status:** ACCEPTED
-   **Date:** 2026-10-22
-   **Owner/approver:** Human project owner
-   **Context:** Balance summaries and overdue invoice calculations must be reconcilable against standard accounting reports.
-   **Options considered:**
    1. Ad-hoc aggregation of submitted Sales Invoices.
    2. Alignment with standard ERPNext Accounts Receivable report logic.
-   **Decision:** The authoritative source for receivables is the ERPNext Accounts Receivable logic. Ageing is computed strictly on invoice Due Date using standard intervals: Current (not due), 1–30 days, 31–60 days, 61–90 days, 90+ days overdue. Missing due dates are flagged as unknown.
-   **Consequences and risks:** Ageing figures reconcile exactly with Accounts Receivable reports run in ERPNext Desk.
-   **Follow-up tasks:** FIN-001, FIN-004

## DEC-006 --- LLM Data Privacy and Least-Privilege Query Boundary Policy

-   **Status:** ACCEPTED
-   **Date:** 2026-10-22
-   **Owner/approver:** Human project owner
-   **Context:** Protect customer and financial data from unintended model exposure and prompt injection.
-   **Options considered:**
    1. Pass raw ERPNext API responses or SQL to the LLM.
    2. Constrained tool-calling with deterministic schema boundary.
-   **Decision:** The LLM receives strictly typed, sanitized schemas containing only necessary fields (customer name, ID, outstanding balance, credit status, and overdue invoice list). Credentials, raw database access, and unrestricted methods are never exposed to the LLM.
-   **Consequences and risks:** Prevents data leakage and prompt injection risks while preserving conversational usability.
-   **Follow-up tasks:** AI-001, SEC-001
