# Scale plan

**Status:** proposal for discovery and pilot planning. The company’s real volumes, workflows, ERPNext configuration, identity system and infrastructure are not confirmed.

## What scales first

Scale around stable business contracts, not around the current browser screens. The first production slice should be a read-only credit enquiry backed by an authoritative accounting source. Quotations, warehouse actions, OCR, RAG and model-assisted answers become separate modules after their owners and source systems are validated.

The Vercel deployment is a presentation surface for synthetic data. A production system handling invoices should run in the approved company environment, with server-side authorization and no default external model calls.

## Target shape

```text
Users / approved internal browser
        |
      SSO + API gateway
        |
  application API + policy engine
   |        |          |
credit   documents   operations
service  service     services
   |        |          |
ERPNext adapter   object storage + metadata DB
                    |
              OCR / review queue
                    |
           scoped search index + local model
```

Start as one deployable application with one relational database and a background worker. Keep modules and adapters separate in code. Split services only when measured load, isolation, or release ownership requires it.

## Staged path

### Stage 0 — Demo and discovery

- Keep fictional data, deterministic totals, and the current role journeys.
- Interview finance, sales, warehouse, IT and management separately.
- Capture authoritative sources, data definitions, retention rules, identity, network boundaries and expected answer examples.
- Record confirmed choices in `DECISIONS.md`; keep unknowns in `docs/OPEN_QUESTIONS.md`.

**Exit:** named sponsor, finance owner, IT owner, pilot use case, approved anonymised sample set and written data-handling rules.

### Stage 1 — Production foundation

- Add SSO, server-side sessions, company scope and backend policy checks.
- Introduce `Customer`, `Invoice`, `Payment`, `BalanceSnapshot`, `SourceReference`, `UserScope` and `AuditEvent` schemas with IDs, currency, source timestamp and schema version.
- Put ERPNext behind a source adapter. Never let the browser or model query ERPNext directly.
- Add migrations, transaction boundaries, idempotency keys and optimistic concurrency for writes.
- Build structured errors, request IDs, health checks and minimal audit events.

**Exit:** a read-only credit page reproduces finance-approved examples, access tests show no cross-scope leakage, and restore from backup succeeds.

### Stage 2 — Controlled document intake

- Upload to quarantine with file-type, size, malware and duplicate checks.
- Preserve the original immutable file; create versioned extraction records separately.
- Run OCR asynchronously. Route low-confidence fields to human review before indexing.
- Store page/region evidence, extractor version, reviewer, correction history and retention metadata.
- Index only approved text and metadata. Enforce scope filters before retrieval and again before document display.

**Exit:** approved sample invoices meet agreed extraction thresholds, every answer links to page-level evidence, and deletion/retention tests pass.

### Stage 3 — Local assistant

- Keep balances, tax, currency conversion and credit policy in deterministic services.
- Give the model narrow read tools with typed inputs and bounded results; deny arbitrary SQL, filesystem access and write tools.
- Use retrieval for explanation and document finding, never as the financial ledger.
- Add refusal, ambiguity, prompt-injection and permission-leakage evaluations in Arabic and English.
- Pin model, embedding, prompt and index versions; log metadata without invoice bodies.

**Exit:** grounded-answer accuracy, refusal rate, latency and resource use meet written thresholds on approved fixtures.

### Stage 4 — Operations modules

- Add quotation, stock, supplier and receipt workflows only after their real process maps are signed off.
- Keep accounting authoritative until reconciliation and migration are explicitly approved.
- Add department and executive dashboards only from approved metric definitions and scopes.
- Introduce write automation one action at a time with approvals, audit, rollback and idempotency.

**Exit:** each module has a named owner, source of truth, reconciliation report, support runbook and rollback procedure.

## Capacity model

| Dimension | Measure | Scaling response |
| --- | --- | --- |
| Users | concurrent users, peak requests, role mix | API replicas and connection pooling |
| Documents | pages/day, file sizes, language mix, OCR backlog | worker concurrency and queue capacity |
| Search | indexed pages, query rate, filter selectivity | index sizing and partitioning |
| Model | tokens/request, concurrent answers, p95 latency | smaller model, batching, GPU/CPU benchmark |
| Data | database size, growth, audit volume | indexes, archival and backup windows |
| Recovery | RPO/RTO and restore duration | backup frequency, replicas and tested restore |

Capacity gates should use measured p95 latency, queue age, error rate, storage headroom and restore time. Do not purchase a GPU or introduce Kubernetes from an assumption.

## Security and operations baseline

- Network egress denied by default for sensitive services; allowlist updates and approved integrations.
- Encrypt data in transit and at rest; keep keys outside application source.
- Least-privilege service accounts, short-lived credentials and admin MFA.
- Backend authorization on every action and retrieval; test direct-object access, export and search leakage.
- Separate application, document, index and backup permissions.
- Centralized redacted logs, audit trails for reads/corrections/writes, alerting on failures and unusual access.
- Tested backup restore, patching, vulnerability review, incident response and rollback.

## Delivery and ownership

Use environments for local development, synthetic staging, approved pilot and production. Pin dependencies and model artifacts. Run migrations through reviewed scripts. Assign owners for product, finance policy, security, infrastructure, data quality and support.

Every new module needs a source-of-truth decision, data contract, permission matrix, synthetic fixtures, acceptance examples, operational dashboard, backup/restore impact and rollback plan.

## What to avoid

- Replacing ERPNext before proving a measurable workflow improvement.
- Letting OCR output or model prose update financial records automatically.
- Mixing currencies or inventing a credit formula before finance approval.
- Putting real invoices into the public demo or external telemetry.
- Splitting into many services before a measured bottleneck exists.
- Treating browser role checks as production security.
