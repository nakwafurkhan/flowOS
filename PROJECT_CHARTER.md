# Project charter

## Purpose

Win a discovery conversation with a demonstrable credit enquiry flow, then build only the private operational capabilities the company validates and funds. The company's systems, processes, vocabulary, roles and data quality are unknown today.

## Enduring principles

1. Financial values come from a named authoritative source and deterministic calculations; a model may explain them but may not invent them.
2. The demo uses synthetic data clearly labelled as such. Real invoices or customer data require company permission and an approved handling process.
3. Company data stays within the approved company environment in production. No external AI API or telemetry receives it by default.
4. Access is checked on the server for each user, action and record. Start with read-only workflows; writes need explicit process ownership and approval.
5. Every answer that cites a document shows the document, relevant page or record, and retrieval time. A missing or ambiguous result is stated plainly.
6. Build in small, replaceable modules around stable data contracts. Choose the actual integrations and stack after discovery.
7. Preserve auditability, backup/restore, and a way to correct erroneous extracted data before it affects business outputs.

## Scope boundaries

The first demo is a credit balance enquiry. Invoice upload, local model, retrieval, warehouse management and dashboards are later phases. Their exact features depend on observed company workflows and signed-off definitions. The platform must not be sold as a replacement for accounting controls or human credit approval without a separate project decision.
