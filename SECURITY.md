# Security and data handling

The demo uses synthetic data. Do not put real customer names, balances, invoices, identifiers, credentials or company screenshots in the repository, presentation, public AI tools or issue tracker.

For any real-data pilot, obtain company approval for the environment, data set, retention and people with access. Require individual accounts, server-side role and record permissions, least-privilege source credentials, encrypted transport and storage, audited access, backup/restore tests and a documented incident owner. Keep secrets outside source code. Treat uploaded files as hostile: size/type limits, malware checks, isolated parsing, and no executable content. Review OCR errors before extracted fields affect financial output.

A local model does not automatically guarantee privacy. Verify network egress, logs, model/runtime supply chain, update path, admin access and backup destinations. Test that a user cannot retrieve another role's document through search, citation links or direct APIs. Test prompt injection in invoice text and require evidence-backed answers.
