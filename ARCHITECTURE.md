# Architecture foundation

**Status:** proposed boundaries, not a fixed stack or procurement list.

## Implemented demonstration boundary

`demo/` is a buildless browser app. `model.mjs` owns synthetic data, permission predicates, calculations and state transitions; `app.mjs` renders routes and persists fictional records to session storage. The same model drives dashboard figures, record views and mock chat. This prototype has no backend, secure login, OCR or AI runtime. The production architecture below is a separate proposal; browser role checks must be replaced with server-enforced authorisation before real data enters the system.

```text
Browser / approved internal client
  -> authenticated application API (server-side policy checks)
  -> domain services (credit, documents, later inventory and metrics)
  -> source adapters (accounting/ERP, document store, later warehouse)
  -> local database, object storage, search index, model runtime
```

## Build boundaries now

- Define a structured `Customer`, `Invoice`, `BalanceSnapshot` and `SourceReference` contract for the demo. Keep source adapters behind these contracts so synthetic data can later be replaced by a validated accounting integration.
- Keep money as decimal values with currency codes, never floating-point arithmetic or model-generated totals. Store document identifiers, source timestamps and calculation versions.
- Treat accounting records as the financial authority. Invoice retrieval/RAG is for finding and explaining evidence, not for deriving a ledger balance from arbitrary PDF text.
- Separate ingestion, extraction, human verification, indexing and serving. An upload is not trusted merely because OCR completed.
- Apply authorisation **before retrieval** and again when opening cited documents. Metadata filters and database policy must use the same user scope; retrieval results are untrusted input to the model.
- Keep model tooling narrow: approved read tools with schemas, bounded results, no arbitrary SQL or filesystem access. Validate generated answers against retrieved records; display uncertainty and evidence.
- Use server-side audit events for access and corrections without storing whole invoice bodies in logs.

## Deployment hypothesis

A company-controlled server on the internal network runs the app, database, encrypted document storage, search/indexing and open-source model inference. Network egress is denied by default for sensitive components. Define encrypted backups, off-host restore tests, patching, monitoring, incident response and a capacity test before a production pilot. Hardware sizing follows measured page volume, concurrent users, OCR language needs and model latency; do not buy a GPU from a guess.

Prefer a single deployable application and database initially. Add a job worker for uploads/OCR only when needed; split services only after operational evidence. Pin and review model versions, extraction pipelines and prompts. The exact runtime, database, OCR, model and framework are decisions after discovery and a local benchmark.

## Decision gates

Confirm company systems and legal/data requirements; obtain representative anonymised samples; approve roles and financial definitions; benchmark Arabic/English invoice extraction and answer quality; then record the selected stack and deployment design in `DECISIONS.md`.
