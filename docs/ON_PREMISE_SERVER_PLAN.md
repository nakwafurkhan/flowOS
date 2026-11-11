# On-premise server and database plan

**Status:** proposed design for company and IT review. This does not authorize purchasing hardware or loading real invoices.

## Goal

Run the production application inside the company’s controlled network so sensitive invoices, extracted fields, balances, embeddings, audit events and model prompts stay on company infrastructure by default. The public demo remains synthetic and separate.

## Recommended first deployment

Buy one business-grade server for the pilot, installed in the company’s server room or approved private data centre. Run a small number of isolated services on it:

```text
Internal users
   -> HTTPS reverse proxy / SSO
   -> application API and web UI
   -> relational database (structured records)
   -> encrypted object storage (original invoices and versions)
   -> search index (approved text and metadata)
   -> job worker (virus scan, OCR, extraction, indexing)
   -> local model runtime (answer explanations only)
```

Keep the first deployment simple: one host, separate volumes, containerized services, documented backups and a tested restore. Add a second host or a high-availability cluster only when the company’s recovery target and measured load justify it.

## Server procurement requirements

Do not select a model or GPU from guesswork. Measure these inputs first:

- concurrent users and peak requests;
- invoices and pages per day, file sizes and retention period;
- Arabic/English OCR mix and scan quality;
- expected assistant questions per minute and acceptable p95 response time;
- database growth, search index growth and backup window;
- recovery point objective (how much data may be lost) and recovery time objective (how quickly service must return);
- available rack space, power, cooling, network, support contract and warranty.

The initial purchase should include ECC memory, redundant storage, hardware RAID or equivalent, dual power supplies where available, remote management, a supported Linux distribution, spare-drive coverage and a UPS. Final CPU, memory, storage and GPU quantities belong in a measured capacity decision in `DECISIONS.md`.

## Storage layout

Use separate encrypted volumes and permissions:

| Volume | Contents | Backup policy |
| --- | --- | --- |
| System | OS, containers and configuration | Rebuildable; retain versioned config |
| Database | customers, invoices, payments, scopes and audit metadata | Frequent database backups plus restore tests |
| Documents | Original files and immutable versions | Encrypted backup, retention and legal hold rules |
| Search | Approved extracted text and vectors | Rebuildable from approved documents, still back up index metadata |
| Backups | Separate backup target, preferably another device/location | Never rely on the same disk as the source |

Do not store credentials or encryption keys in the repository. Keep secrets in the company’s approved secret store or restricted host configuration.

## Network and access

- No direct internet exposure for the database, document store, search index or model runtime.
- Publish only the application through an internal HTTPS endpoint or approved VPN.
- Deny outbound traffic by default; allowlist operating-system updates, package mirrors and explicitly approved integrations.
- Use the company identity provider for SSO and MFA if available.
- Apply role and record scope in the backend on every read, search, download and write.
- Separate administrator, application, database, backup and model service accounts.
- Record access, correction, export, upload, approval and deletion events without copying invoice contents into logs.

## Data flow for an invoice

1. User uploads through the authenticated application.
2. File type, size, malware and duplicate checks run before acceptance.
3. Original file is stored immutably in the document volume.
4. A worker performs OCR and extraction asynchronously.
5. Low-confidence or policy-sensitive fields enter a human review queue.
6. Only approved fields and approved text are indexed with document/page references and access scope.
7. Credit values come from the authoritative accounting source; the model may explain retrieved evidence but cannot create ledger totals.
8. Corrections create a new version and audit event; they do not silently overwrite history.

## Backup and recovery minimum

- Define RPO/RTO with the company before the pilot.
- Take encrypted database backups and document snapshots on a schedule matched to the RPO.
- Keep a second backup copy on a separate device or approved location.
- Test restoring a full database, a document and the application configuration at least monthly during the pilot.
- Keep a rollback path for application, OCR, index and model versions.
- Document who can declare an incident, restore service and approve data deletion.

## Deployment phases

### A. Discovery and sizing

Collect anonymised volume samples, network details, identity options, retention rules and recovery targets. Produce a capacity worksheet and a signed data-flow diagram.

### B. Secure foundation

Install the operating system, patch policy, encrypted volumes, firewall, backups, monitoring, secret handling and SSO integration. Load synthetic data only.

### C. Read-only pilot

Connect a validated accounting read path, implement backend authorization and reconcile credit answers with finance-approved examples.

### D. Controlled invoice intake

Add quarantine, OCR, review, versioning and scoped indexing. Start with a small named user group and approved anonymised or real pilot data.

### E. Local assistant and operations modules

Benchmark the local model, enable evidence-linked explanations, then add warehouse, quotations and dashboards one domain at a time with owner sign-off.

## Acceptance before real sensitive data

- IT approves the network, host hardening, backup and patch plan.
- Finance approves source-of-truth definitions and reconciliation examples.
- Security approves roles, retention, audit, incident response and access revocation.
- A restore test meets the written RPO/RTO.
- Permission tests show no cross-team search, download or assistant leakage.
- OCR and assistant benchmarks meet written Arabic/English thresholds.
- The company names a support owner and approves the pilot dataset.

## Important boundary

The server protects the company’s data only if application permissions, operating-system access, backups, vendor access and network routes are controlled too. “Local” is a deployment choice, not a substitute for security review or data governance.
