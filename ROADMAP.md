# Step-by-step roadmap

Dates below are **planning estimates**, not promises. Each phase has an exit gate; do not skip discovery to build speculative modules.

## 0. Build and present the demo (now, about 1–2 weeks)

**Audience and promise:** The company is already interested and wants to see what you can build. Show a working, polished example before asking for internal access or a detailed process interview. The claim is a possible **company-specific experience** with controlled data and workflows, not that ERPNext lacks credit limits or receivables reports. ERPNext already has those features and Frappe can be customised; the demo must show a measurable improvement in the user's journey.

### Build sequence

1. **Design the complete story:** use the nine deliverables in [DEMO_UX_PLAN.md](docs/DEMO_UX_PLAN.md): research, solution comparisons, data model, design system, role permissions, flows, wireframes, script and build milestones.
2. **Build shared fictional records:** customers, products, conversions, stock, quotations, invoices, receipts, supplier obligations and task review. Include ambiguous names, a zero balance, missing limit, second currency and overdue supplier.
3. **Connect the sales path:** mixed-unit quotation → shortage sourced on supplier credit → simulated send → fulfilment-confirmed sale → partial customer receipt → supplier-payment recommendation. Keep contractual supplier due dates independent of collections.
4. **Demonstrate three roles:** employee owns tasks/customers; manager reviews the team and handles stock; executive sees the whole company. All views and mock chat use the same access predicates and data.
5. **Make the value legible:** change quantities, receive stock and switch roles during the presentation. Validate time/click savings against the company's real ERPNext configuration later. Explain local AI/OCR as a future phase.
6. **Verify and present:** run arithmetic/access checks and browser flows, rehearse the five-minute route in the UX plan, and publish a private fictional-data demo. Investigate production access only after their green light.

### Five-minute presentation

- **0:00–1:50:** Employee creates the mixed-unit quote, sources the shortage, sends and converts it.
- **1:50–3:00:** Record a partial receipt and submit a collections task for review.
- **3:00–4:15:** Manager approves the task, inspects the linked supplier recommendation and receives stock.
- **4:15–4:55:** Executive opens company-wide records; employee chat demonstrates access refusal.
- **4:55–5:00:** Ask for a discovery sponsor. The exact click path and expected figures are in the UX plan.

**Gate:** the live demo works without company connectivity; every screen distinguishes working features from previews; synthetic data is obvious; the pitch does not assert unverified company pain points or promise ERP replacement.

For a fair comparison, use the official [ERPNext Accounts Receivable documentation](https://docs.frappe.io/erpnext/accounts-receivable-and-payable), [credit limit documentation](https://docs.frappe.io/erpnext/credit-limit), and [Frappe customisation overview](https://frappe.io/framework/customisation). Validate the company's installed version and custom apps during discovery.

## 1. Discover the company (after demo green light, about 2–4 weeks)

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
