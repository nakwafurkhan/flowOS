# Backend

Server-side read-only integration for the Credit Balance Check Bot.

## Current scope (INT-001)

-   `src/integrations/erpnext/` — read-only ERPNext adapter with a
    transport abstraction so tests can run against synthetic fixtures.
-   `tests/` — unit tests that exercise the adapter with a mock
    transport. No real ERPNext network calls are made.

## Run tests

``` bash
npm test
```

## Configuration

Copy `.env.example` to `.env` and set the values. Real credentials are
never committed.
