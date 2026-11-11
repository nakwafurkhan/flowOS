# Contributor rules

Read `README.md`, `PROJECT_CHARTER.md`, `PRODUCT_SPEC.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `TASKS.md` and relevant `docs/` before changes. Check branch and working tree. Use a task ID and state intended changes, risks and checks.

## Source of truth

Accepted decisions and the charter govern work. Product/architecture documents are proposals where labelled. The owner reports ERPNext/Frappe use; its configuration, workflows and data rules are unknown. Record uncertainty in `docs/OPEN_QUESTIONS.md`; never convert a guess into a requirement. Record user-authorised scope changes in the charter and task board; propose unapproved architecture or business-policy choices for owner review when they arise.

## Work and Git

Work on a task branch, not `main`; do not overwrite others' edits, rewrite shared history or force-push. Keep changes reviewable. Inspect the diff, run relevant checks, update `TASKS.md`, and report exact results. Do not self-merge. Separate agents should avoid editing the same files and provide a handoff with task, branch, files, tests, issues and next action.

## Data and correctness

Use synthetic records in the demo and tests. Never commit secrets or real customer data. Do not connect company systems or ingest real invoices without company-authorised access and approved handling. Financial figures come from authoritative structured sources and deterministic code; model text is explanatory only. Keep currencies separate, show source and freshness, and say when evidence is missing. Enforce access on the backend and at document retrieval. Validate uploads and inputs; limit requests and log minimally.

## Done

Acceptance criteria met; relevant tests/checks actually run; diff inspected; documentation and task status updated; limitations stated; work committed on its task branch or the reason given. End reports include task ID, change summary, files, checks, unresolved questions, branch/commit and recommended next task.
