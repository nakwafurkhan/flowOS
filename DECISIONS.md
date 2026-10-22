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

-   **Status:** PROPOSED
-   **Context:** The bot handles sensitive financial information;
    accidental writes would be high impact.
-   **Options considered:** Read-only first; read/write integration.
-   **Decision:** Proposed read-only access for the MVP.
-   **Consequences and risks:** The bot cannot create reminders or
    change accounting records. Those features require a separate review
    and decision.

## DEC-002 --- Financial figures must be grounded in ERPNext data

-   **Status:** PROPOSED
-   **Context:** LLM-generated numbers are not acceptable as accounting
    truth.
-   **Options considered:** Ask the model to calculate from text;
    deterministic service using validated source data.
-   **Decision:** Proposed deterministic calculation/retrieval with the
    LLM limited to intent selection and explanation.
-   **Consequences and risks:** More explicit schemas and tests are
    required, but results are auditable.

## DEC-003 --- Use React/Vite + Node/Express as the initial technical proposal

-   **Status:** PROPOSED
-   **Context:** A web chat plus backend can keep ERPNext credentials
    out of the browser.
-   **Options considered:** Web app, messaging bot, direct
    client-to-ERPNext.
-   **Decision:** Proposed web MVP; final stack requires owner approval.
-   **Consequences and risks:** Messaging integrations and persistence
    can be added later if approved.
