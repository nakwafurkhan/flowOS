# Task Board

Statuses: `BACKLOG`, `READY`, `IN PROGRESS`, `BLOCKED`, `IN REVIEW`,
`DONE`.

Only move a task to `READY` after its dependencies and acceptance
criteria are clear. Do not start implementation while the project is in
planning status.

  ----------------------------------------------------------------------------
  ID             Task             Status         Owner          Dependencies
  -------------- ---------------- -------------- -------------- --------------
  GOV-001        Review and       DONE           Human owner    None
                 approve project                                
                 charter                                        

  GOV-002        Confirm ERPNext  DONE           Human owner    None
                 version, hosting                               
                 and                                            
                 customisations                                 

  GOV-003        Confirm user     DONE           Human owner /  GOV-001
                 roles and                       finance        
                 authorisation                                  
                 model                                          

  GOV-004        Resolve business DONE           Human owner /  GOV-002
                 rules in open                   finance        
                 questions                                      

  GOV-005        Approve          DONE           Human owner    GOV-002,
                 architecture and                               GOV-003
                 LLM                                            
                 data-handling                                  
                 policy                                         

  GOV-006        Configure Git    DONE           Human owner    GOV-001
                 protections and                                
                 contributor                                    
                 process                                        

  INT-001        Implement        IN REVIEW      Dev agent      GOV-002,
                 read-only                                      GOV-005,
                 ERPNext API                                    DEC-007
                 adapter                                        

  INT-002        Implement        IN PROGRESS    Dev agent      INT-001
                 customer lookup                                
                 and                                            
                 disambiguation                                 

  FIN-001        Select           READY          Finance owner  GOV-004
                 authoritative                                  
                 receivables                                    
                 source and                                     
                 filters                                        

  FIN-002        Implement        BLOCKED        TBD            FIN-001
                 balance summary                                
                 with                                           
                 reconciliation                                 
                 tests                                          

  FIN-003        Approve and      IN PROGRESS    Finance owner  GOV-004
                 implement credit                / developer    
                 exposure formula                               

  FIN-004        Implement        BLOCKED        TBD            FIN-001
                 invoice ageing                                 
                 and drill-down                                 

  UI-001         Design customer  READY          TBD            GOV-001,
                 search and                                     GOV-004
                 summary views                                  

  AI-001         Add constrained  BLOCKED        TBD            INT-002,
                 tool-calling                                   FIN-002
                 orchestration                                  

  SEC-001        Security and     BLOCKED        Human reviewer INT-001,
                 access-control                                 AI-001
                 review                                         

  QA-001         End-to-end tests BLOCKED        Human owner /  INT-001,
                 and user                        QA             FIN-002,
                 acceptance                                     FIN-004,
                                                                UI-001, AI-001
  ----------------------------------------------------------------------------

## Task assignment protocol

Before work starts, record the assignee and branch in the task row or
task issue. Avoid assigning overlapping file ownership to parallel
agents. Every task needs acceptance criteria, tests and a review owner
before it is marked `READY`.

## Owner-approved acceptance criteria

### INT-001 --- Read-only ERPNext API adapter (OPENED, Phase 1)

Owner approval recorded in `DECISIONS.md` (DEC-007, 2026-10-22).

**Scope (in):** A server-side adapter that talks to ERPNext read-only for
`Customer`, `Sales Invoice`, `Payment Entry`, `Sales Order` and
`Delivery Note` doctypes, using the approved least-privilege API-key
integration pattern.

**Scope (out):** No writes, no live ERPNext connection, no production
credentials, no real customer data, no credit-status computation.

**Acceptance criteria:**
-   Adapter authenticates with ERPNext API key/secret from environment
    variables (make no real network call in tests).
-   Transport is abstracted so tests run against synthetic fixtures.
-   Read-only methods cover: customer search/lookup, sales invoices,
    payment entries, sales orders, delivery notes.
-   Requests enforce explicit doctype/field/filter lists and pagination.
-   Handles and maps failures: HTTP errors, timeouts, missing
    credentials, empty results — and surfaces them as typed errors, not
    zero balances.
-   No credentials or raw payloads are logged.
-   Tests run against synthetic fixtures only and pass.

**Tests:** mocked-API unit/integration tests in `backend/tests`.
**Review owner:** Human maintainer.

### FIN-001 --- Select authoritative receivables source and filters

Finance owner to record in `DECISIONS.md` the exact ERPNext
Accounts Receivable report, filters, date boundary and company/party
settings used as the source of truth for balances and ageing.

**Acceptance criteria:**
-   Approved receivables source + filter set recorded in
    `DECISIONS.md`.
-   Reconciliation cases defined for representative customers.

### FIN-003 --- Approve and implement credit exposure formula

Formula already accepted in DEC-004. This task confirms the ERPNext
field/status mapping (Sales Order statuses `To Deliver and Bill` /
`To Bill`, unbilled Delivery Notes) and implements it.

**Acceptance criteria:**
-   Field/status mapping for exposure components confirmed against the
    target instance configuration.
-   Deterministic implementation with reconciliation tests.
-   Missing credit limit surfaces as unknown (not zero).

### UI-001 --- Design customer search and summary views

**Acceptance criteria:**
-   Wireframes/mockups (synthetic data only) for customer search,
    disambiguation and summary views.
-   Includes empty, ambiguous and error states.
-   Review owner approves before frontend build.

## Branch assignments

-   `feat/INT-001-erpnext-api-adapter` --- INT-001 (current)
-   INT-002, FIN-003, UI-001 branches to be created when owners assign.
