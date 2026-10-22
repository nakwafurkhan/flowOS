# Roadmap

All phases are gated by owner approval. Do not treat the roadmap as
authorisation to begin coding.

## Phase 0 --- Governance and requirements

-   [ ] Review and approve the charter and scope.
-   [ ] Confirm ERPNext version, hosting and customisations.
-   [ ] Confirm user roles and data access.
-   [ ] Resolve questions in `docs/OPEN_QUESTIONS.md`.
-   [ ] Approve architecture and business calculation rules.
-   [ ] Set up repository protections and contributor workflow.

**Exit gate:** Owner approves the written specification and Phase 1.

## Phase 1 --- Safe integration foundation

-   [ ] Build ERPNext read-only adapter.
-   [ ] Configure development credentials securely.
-   [ ] Implement customer lookup and ambiguous-match resolution.
-   [ ] Add mocked API tests and error handling.

**Exit gate:** Connector tests pass; permissions are reviewed; no
production data is used without explicit approval.

## Phase 2 --- Receivables and credit summary

-   [ ] Select the authoritative Accounts Receivable source.
-   [ ] Implement summary retrieval and reconciliation tests.
-   [ ] Confirm credit-limit and exposure rules.
-   [ ] Add currency and missing-data handling.

**Exit gate:** Finance owner verifies representative outputs against
ERPNext.

## Phase 3 --- Ageing and invoice drill-down

-   [ ] Implement agreed ageing buckets.
-   [ ] Show invoice details and approved deep links.
-   [ ] Test due dates, partial payments, credit notes and zero
    balances.

**Exit gate:** Ageing and totals reconcile to the approved report.

## Phase 4 --- User interface and AI tools

-   [ ] Build customer search and disambiguation views.
-   [ ] Build summary and invoice cards.
-   [ ] Add tool-calling layer with strict schemas.
-   [ ] Add friendly errors and visible retrieval timestamps.

**Exit gate:** User acceptance testing passes.

## Phase 5 --- Security, pilot and deployment

-   [ ] Review authentication, authorisation and logging.
-   [ ] Test rate limits, timeouts and permission failures.
-   [ ] Run security review and regression suite.
-   [ ] Pilot with a small authorised internal group.
-   [ ] Document support, rollback and incident procedures.

**Exit gate:** Owner explicitly approves production deployment.
