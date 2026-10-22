# Project Charter

## Working name

Credit Balance Check Bot

## One-sentence goal

Help authorised employees of a trading company quickly and reliably
check a customer's outstanding balance, credit exposure, overdue
invoices and supporting invoice details using the company's ERPNext
data.

## Problem

Finding a customer's current position can require navigating accounting
screens and reports. The bot should make common enquiries faster without
changing the underlying accounting records or compromising
financial-data security.

## Intended users

-   Internal sales staff who are authorised to view customer credit
    information.
-   Accounts/finance staff.
-   Project owner and maintainers.

Customer self-service is **not in the initial scope** unless explicitly
approved later.

## Product principles

1.  **Correctness before cleverness.** Financial figures must come from
    verified ERPNext records or approved reports, not model guesses.
2.  **Read-only first.** The initial bot must not create, update,
    submit, cancel or delete ERPNext records.
3.  **Evidence and traceability.** Responses should identify relevant
    records and when data was retrieved.
4.  **Least privilege.** Use a dedicated integration account with only
    the required permissions.
5.  **Clarify ambiguity.** If multiple customers match, ask the user to
    select the right one.
6.  **Fail honestly.** Missing data, unavailable credit limits,
    permissions failures and stale data must be stated clearly.
7.  **Human accountability.** AI agents propose changes; tests and human
    review control what enters the main branch.
8.  **Small, reversible changes.** Every change is tracked in Git and
    has a clear purpose.
9.  **No scope drift.** New features require a task and, where they
    change behaviour or architecture, a recorded decision.
10. **Respect access boundaries.** Inspect only systems and data the
    team is authorised to access.

## Success criteria for the first usable version

-   An authorised user can find a customer by ID or name.
-   Ambiguous matches are presented for confirmation.
-   The bot returns the verified outstanding amount and the supporting
    unpaid invoices.
-   It reports configured credit limits and exposure only when the
    required data and business rules are confirmed.
-   Overdue invoices and ageing are calculated consistently with the
    agreed ERPNext report behaviour.
-   No financial mutation endpoints are exposed.
-   Automated tests cover financial calculations, ambiguity, missing
    values and API failures.
-   Secrets are never committed or exposed to the browser.
-   Changes are reviewed and merged through the agreed Git workflow.

## Non-goals for the initial version

-   Replacing ERPNext, Tally or the company's accounting system.
-   Automatically approving or blocking credit.
-   Sending payment reminders or making phone calls.
-   Writing back to ERPNext.
-   Making decisions based solely on an LLM.
-   Supporting multiple companies or customer-facing access before
    requirements are agreed.

## Current status

Planning only. No implementation is approved by this document alone. The
project owner must explicitly approve the specification and
implementation start.
