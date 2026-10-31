# Product specification

**Status:** demo contract draft; company workflows unverified.

## Credit demo, first presentation

Use a small synthetic dataset with at least: two similarly named customers, one zero balance, two currencies, partially paid and overdue invoices, a missing credit limit, and an unavailable-source case. The UI should allow search, explicit customer selection, balance and unpaid invoice viewing, and a visible as-of time and source label. Show invoice number, due date, outstanding amount and currency. Totals are computed from structured records and tested. Do not combine currencies or calculate available credit until a company-approved policy exists. A conversational interface may be added only if it improves the demo; deterministic search and answer templates are enough to demonstrate trust.

Each demo screen and presentation must say **Synthetic demo data — not connected to Durrar Masagh systems**. No sign-in to company systems, invoice upload or external model call is required for this phase.

## Presentation preview, subject to discovery

Show mock screens for invoice upload/review, role-specific dashboards and warehouse navigation with synthetic data. Label them **concept previews**. Do not imply that OCR, local AI, integrations or access controls are functional until they are built and tested. The working credit flow should be the centrepiece.

## Candidate production capabilities, subject to discovery

- Private invoice intake: local upload, malware/type checks, document storage, OCR/extraction, human review, versioning and retention.
- Credit enquiry: reconcile balances to the accounting system, show sources and freshness, handle disputes and multi-currency policy.
- Local assistant: retrieve only authorised document chunks; cite evidence; refuse unsupported financial answers; keep model output separate from computed figures.
- Warehouse: inventory, locations, receipts, transfers and counts only after mapping their real process and system of record.
- Role-specific dashboards: metrics defined with finance and department owners; CEO views aggregate authorised data, managers see their scope.

These are hypotheses. Do not encode a particular ERP, credit formula, warehouse workflow or department hierarchy as fact.

## Acceptance before real-data pilot

A finance owner signs off the source of truth, calculation examples and reconciliation tolerance; a security owner signs off roles, isolation, retention and backup; users validate real tasks; and the company approves the pilot data set and environment.
