# Product Specification --- Credit Balance Check Bot

**Status:** Draft for owner review. Derived from the supplied REA
investigation; not all reference findings have been independently
verified.

## 1. Core user journey

1.  An authorised employee asks a natural-language question or enters
    `/credit <customer>`.
2.  The system searches ERPNext customers.
3.  If one exact customer is identified, continue.
4.  If multiple candidates match, display customer name, customer ID and
    territory and ask the user to choose.
5.  Retrieve the approved balance/receivables information.
6.  Display a summary with supporting invoice details.
7.  Allow the user to drill down to relevant invoices and open the
    matching ERPNext document, if authorised.
8.  Show retrieval time and errors clearly.

## 2. Initial capabilities

### Customer search

-   Search by customer name or ID; tax ID search only if approved and
    available.
-   Exact ID match takes priority.
-   Return a limited number of candidates.
-   Never silently choose between ambiguous matches.

### Balance summary

Potential fields: - Customer name and ID. - Currency. - Outstanding
balance from the approved ERPNext source/report. - Count of unpaid
invoices. - Configured credit limit, if present. - Exposure breakdown,
only after its included components are agreed. - Available credit, only
after the business calculation is approved. - Data retrieval timestamp
and source.

### Invoice ageing

-   List unpaid invoices with invoice number, posting date, due date,
    outstanding amount, currency and days overdue.
-   Agree the ageing basis and buckets with the finance owner.
-   Missing due dates must be shown as unknown, not silently classified.
-   Keep totals reconcilable to the selected ERPNext report and filter
    settings.

### Drill-down

-   Display the most relevant open/overdue invoices.
-   Provide a link to the ERPNext document only if the user has access.
-   Do not expose internal invoice data to unauthorised users.

### Errors and empty states

-   Customer not found: suggest checking the name or ID.
-   Ambiguous result: request a selection.
-   Zero balance: report zero only when supported by the data.
-   Missing credit limit: say it is not configured/available.
-   Permission failure: report an access issue without leaking sensitive
    details.
-   Timeout or ERPNext failure: say data could not be retrieved; do not
    reuse stale values without a visible timestamp.

## 3. Credit status

The supplied investigation proposes Good Standing / Warning / Blocked
indicators and a 20% buffer threshold. This is **not approved business
policy yet**. Before implementation, the owner/finance team must
confirm: - What constitutes exposure (invoices, deliveries, open orders,
advances/unallocated payments, etc.). - Which company-specific credit
limit applies. - Whether the ERPNext bypass flag changes only the
warning or the bot's displayed status. - Whether "blocked" is
informational or implies an actual ERPNext block. - Currency conversion
rules. - What the 20% threshold means and whether it should exist.

Until approved, the bot must not present a computed credit status as an
authoritative decision.

## 4. Data and calculation rules

-   Prefer the authoritative ERPNext Accounts Receivable report/approved
    server-side source for receivables.
-   Do not sum overlapping sources and accidentally double-count.
-   Do not calculate total exposure from invoices alone if the approved
    policy includes orders or unbilled deliveries.
-   Do not mix currencies.
-   Document date filters, company, party type, report filters and any
    accounting dimensions that affect the result.
-   Test partial payments, credit notes, advances, write-offs, returns,
    cancelled invoices and multi-currency records as applicable to the
    company's configuration.

## 5. Access and audit

-   Internal users only for the MVP.
-   Backend authentication and authorisation required.
-   Read-only ERPNext integration.
-   Record operational audit events without unnecessarily logging
    customer financial data.
-   A future WhatsApp/customer-facing channel requires a separate
    security and identity review.

## 6. Out of scope unless approved

-   Creating or editing invoices/payments.
-   Credit approvals or automatic sales blocks.
-   Automated payment reminders.
-   Customer self-service.
-   Forecasting or scoring customers using opaque AI reasoning.

## 7. Open acceptance decisions

See `docs/OPEN_QUESTIONS.md` before turning this draft into an
implementation contract.
