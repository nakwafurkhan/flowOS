# Reference Investigation --- ERPNext Customer Credit-Balance Workflow

**Source:** User-provided REA investigation report for
`https://erpnext-demo.frappe.cloud/app/home`. **Tool noted in source:**
REA v6.7.0. **Status:** Research notes supplied by the project owner.
Findings have not been independently revalidated here. Treat items
labelled unverified in the source as unverified.

## Areas investigated in the supplied report

### 1. Customer search and identification

The report describes ERPNext global search and link-field autocomplete,
including customer identifiers and descriptors. The planned bot should
search by customer name or ID and request a selection when multiple
matches are returned.

### 2. Outstanding-balance summary

The report describes information spread across customer dashboards,
party details and Accounts Receivable reports. The proposed bot summary
includes customer name/ID, outstanding balance, unpaid invoice count and
open sales order exposure. The authoritative report and filters must be
confirmed against the target company's instance.

### 3. Credit limit and exposure

The report describes customer credit-limit configuration and potential
exposure from invoices, unbilled delivery notes and sales orders. The
exact exposure formula, bypass behaviour and enforcement settings on the
target instance were not verified. Do not implement a credit status
until the finance owner approves the policy.

### 4. Invoice ageing

The report describes ageing buckets and overdue invoices. The target
company's ageing basis, custom payment terms and grace periods were not
verified. The bot's ageing rules must reconcile with the approved
Accounts Receivable report.

### 5. Invoice drill-down

The report describes navigating from a customer record or receivables
report to individual Sales Invoice records. The proposed bot should show
invoice details and provide a deep link only to users authorised to view
that invoice.

### 6. Error states

The report describes empty search results, multiple matching customers,
zero balances and permission errors. The bot should return friendly,
honest messages and must not turn failures into zero balances.

## Proposed product requirements from the source

-   Natural-language customer credit queries and an optional slash
    command.
-   Customer disambiguation by name, ID and territory.
-   Balance summary with currency, outstanding amount, configured credit
    limit and approved exposure details.
-   Invoice ageing and oldest-overdue invoice information.
-   Invoice drill-down and ERPNext links.
-   Read-only API access, role-based authorisation, caching only if
    freshness policy is agreed.
-   Tests for ambiguity, missing records, ageing, currencies and API
    failures.

## Unverified items to resolve

-   Exact ERPNext version and custom fields on the trading company's
    instance.
-   Search index and live-demo configuration.
-   Multi-currency rules.
-   Whether open orders and unbilled deliveries count toward credit
    exposure.
-   Credit-limit enforcement settings and bypass semantics.
-   Custom payment terms and grace periods.
-   Permission behaviour for invoice drill-down.
-   Whether customer records contain usable credit limits and
    territories.

## Important limitation

This is a transcription/condensation of the supplied investigation, not
independent verification of its technical claims. Confirm behaviour
against the target ERPNext instance and official documentation before
implementation.
