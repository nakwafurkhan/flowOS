# Decision log

Use `PROPOSED`, `ACCEPTED`, `REJECTED` or `SUPERSEDED`. Only an identified owner can accept a company-specific decision. Record date, options, evidence, consequence and approver.

| ID | Decision | Status | Reason |
| --- | --- | --- | --- |
| DEC-001 | Present the first credit demo with synthetic data only | ACCEPTED for this project plan | No company data access or practice is known. |
| DEC-002 | Keep financial calculations deterministic and source-linked | ACCEPTED for this project plan | Prevent invented balances and permit reconciliation. |
| DEC-003 | Target a company-controlled, local deployment for production | PROPOSED | User's desired privacy posture; validate company constraints and operations. |
| DEC-004 | Select ERP adapter, app stack, storage, OCR and local model after discovery/benchmark | PROPOSED | Current choices would be guesses. |
| DEC-005 | Start production access with read-only roles | PROPOSED | Limits blast radius; real workflows may later need separately approved writes. |

The former ERPNext and React/Express proposals are superseded as assumptions, not retained as requirements. Their history remains in Git.
