# Step-by-step roadmap

Dates below are **planning estimates**, not promises. Each phase has an exit gate; do not skip discovery to build speculative modules.

## 0. Prepare the pitch (now, about 1–2 weeks)

1. Write three synthetic customer stories: ordinary balance, ambiguous name, overdue/partial payment. Add zero balance, missing limit, different currency and unavailable-source examples.
2. Build the read-only credit demo against structured fixtures. Compute amounts in code; show invoice evidence and as-of timestamps. Clearly label every view as synthetic.
3. Test the calculations and failure states. Rehearse a five-minute live path and a static fallback recording/screenshots.
4. Prepare one page explaining the future private deployment, data boundaries, proposed pilot and questions for them.

**Gate:** the demo works without company connectivity, no real data is present, and a viewer can distinguish facts from assumptions.

## 1. Discover the company (after interest, about 2–4 weeks)

1. Interview finance, sales, warehouse, department leads and IT separately. Observe actual credit and invoice workflows.
2. Inventory accounting/ERP, invoice repositories, warehouse tools, identity, network and backup practices. Capture owners and pain points.
3. Agree a vocabulary/data dictionary: customer, invoice, outstanding, exposure, overdue, warehouse item and dashboard metric. Record source of truth and update frequency for each.
4. Obtain approved anonymised examples and expected answers; document roles and record-level access.
5. Rank use cases by value, risk and data readiness. Pick **one** measurable pilot, probably credit enquiry if evidence supports it.

**Gate:** company sponsor and finance/IT owners approve the pilot scope, source rules and data handling.

## 2. Prove the private technical path (about 3–6 weeks)

1. Size a local server from measured volume and latency; document network isolation, egress, patching, backup and restore.
2. Compare a small number of on-premise OCR, embedding and open-source model options on approved Arabic/English sample documents. Measure extraction accuracy, answer grounding, latency and resource use.
3. Implement restricted upload, quarantine/validation, immutable original storage, extraction review and document versioning.
4. Index approved text with document/page references and access scope; test permission leakage and prompt injection.
5. Build deterministic credit retrieval from the validated accounting source. Reconcile results with finance examples before any model is allowed to explain them.

**Gate:** benchmark and security review pass; finance can trace each value to the authoritative record.

## 3. Limited pilot (about 4–8 weeks)

1. Deploy within the approved internal environment to a small named user group.
2. Add login, role and record permissions, audit events, observability and safe error handling.
3. Run real tasks with users; compare bot answers to the accounting system, record discrepancies and correction workflow.
4. Test restore, update/rollback, access revocation and incident response. Measure time saved, answer accuracy and adoption.

**Gate:** company owners accept evidence and decide whether to expand, revise or stop.

## 4. Expand one domain at a time (timing after pilot)

1. Add invoice lifecycle features only when upload/review ownership and retention are clear.
2. Add warehouse workflows only after mapping physical processes, stock reconciliation and approval steps. Keep the existing system authoritative until migration is deliberately planned.
3. Add CEO and department dashboards only for metrics with approved definitions, access scope and refresh rules.
4. Consider write actions, automation and integrations separately, with audit, permissions, rollback and business sign-off.

**Gate for each domain:** named owner, validated data source, measurable acceptance examples and support plan.

## Cross-cutting work throughout

Maintain a decision log, task-level acceptance criteria, source and schema versioning, synthetic regression fixtures, security tests, monitoring, backup/restore drills and user feedback. Keep the first deploy simple; split services or add infrastructure only when measured load requires it.
