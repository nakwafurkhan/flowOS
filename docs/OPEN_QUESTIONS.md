# Open Questions --- Resolve Before Implementation

Mark each question `RESOLVED` only after recording the answer and
approver. Link significant decisions from `DECISIONS.md`.

## Product and users

-   [ ] Who exactly will use the bot, and which ERPNext roles should be
    allowed to query balances?
-   [ ] Is the first interface a web chat, a messaging app, or both?
-   [ ] Is customer self-service explicitly out of scope for the first
    release?
-   [ ] What response time and data freshness are acceptable?

## ERPNext

-   [ ] Which ERPNext/Frappe version does the trading company run?
-   [ ] Is it cloud-hosted or self-hosted? Are custom apps or custom
    fields installed?
-   [ ] Which company/companies and currencies should the bot support?
-   [ ] Which ERPNext report and filter set is the authoritative source
    for receivables?
-   [ ] Which fields are accessible to the proposed integration user?
-   [ ] Can the bot link to ERPNext documents using the company's
    canonical URL?

## Finance rules

-   [ ] Does outstanding balance come directly from Accounts Receivable,
    submitted Sales Invoices, or another approved source?
-   [ ] How are advances, unallocated payments, credit notes, returns,
    write-offs and disputes treated?
-   [ ] What counts as total credit exposure: invoices only, or also
    orders/delivery notes?
-   [ ] How is available credit calculated?
-   [ ] Is there a warning threshold such as 20%, and who approved it?
-   [ ] What does a "blocked" status mean? Is it merely informational?
-   [ ] Which ageing basis and buckets should be used?
-   [ ] How should multi-currency exposure be displayed or converted?
-   [ ] What timezone and "current date" should determine overdue
    status?

## AI and privacy

-   [ ] Which coding agent will use REA, and how does it configure MCP?
-   [ ] Which model/provider may receive user queries or customer data?
-   [ ] Is company policy approval required before sending financial
    data to that provider?
-   [ ] Is an LLM needed in the first version, or can the first version
    use deterministic search plus templates?
-   [ ] What should be logged, for how long, and who can access logs?

## Operations

-   [ ] Where will the app run?
-   [ ] How will user authentication be implemented?
-   [ ] Who owns incident response and credential rotation?
-   [ ] Who approves releases and production access?
