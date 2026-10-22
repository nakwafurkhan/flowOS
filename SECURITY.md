# Security and Data Handling

## Data classification

Customer balances, invoices, payment history, tax IDs and account
credentials are confidential business information.

## Rules

-   Never commit credentials or `.env` files.
-   Use a dedicated least-privilege ERPNext integration account.
-   Keep credentials on the server side.
-   Enforce backend authentication and authorisation.
-   Use HTTPS.
-   Validate query inputs and limit returned fields/records.
-   Apply timeouts, rate limits and safe error messages.
-   Do not pass secrets or unnecessary customer data to an LLM provider.
-   Confirm company policy and provider data-handling terms before using
    live financial data with any AI model.
-   Use synthetic or anonymised fixtures in tests, prompts and
    screenshots.
-   Do not log full invoice payloads or credentials.
-   Report a suspected credential exposure immediately, rotate affected
    credentials and follow the company's incident process.

## Security gate

Production credentials and real data must not be connected until the
owner approves the access model, data-handling policy and security
review.
