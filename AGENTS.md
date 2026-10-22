# Shared Rules for All Agents and Contributors

These instructions apply to every AI coding agent, model, subagent and
human contributor working in this repository. Read this file before
acting.

## 1. Mandatory startup routine

Before changing anything: 1. Read `README.md`, `PROJECT_CHARTER.md`,
`PRODUCT_SPEC.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `TASKS.md` and
relevant files under `docs/`. 2. Check `git status` and the current
branch. 3. Identify the task ID and read its acceptance criteria. 4.
Summarise the intended changes, affected files, risks and tests. 5. If
the task is not explicitly approved or conflicts with the source of
truth, stop and ask.

## 2. Do not start implementation without approval

The repository is currently in planning status. Do not build app code,
connect to a live ERPNext instance, request or generate production
credentials, or change production data until the project owner approves
implementation.

## 3. Protect the product's core idea

The goal is an internal, read-only Credit Balance Check Bot for a
trading company using ERPNext. It retrieves verifiable customer balances
and supporting invoice information. It is not an ERP replacement and
must not invent financial figures.

Do not silently: - Add new product scope. - Change target users. -
Change the stack or architecture. - Add write access to ERPNext. -
Change credit/ageing business rules. - Treat research notes as confirmed
facts when marked unverified.

Propose significant changes in `DECISIONS.md` or
`docs/OPEN_QUESTIONS.md` and wait for approval.

## 4. Task discipline

-   Work only on the task assigned to you.
-   Keep a task small enough to review.
-   Do not bundle unrelated refactors, formatting changes or
    dependencies.
-   Update `TASKS.md` only for your task and report what changed.
-   If requirements are incomplete, write down the question instead of
    guessing.
-   Do not claim tests passed unless you actually ran them.

## 5. Git rules

-   Never work directly on `main`/`master`.
-   Use one branch per task: `feat/TASK-123-short-name`,
    `fix/TASK-123-short-name`, `docs/TASK-123-short-name`, or
    `chore/TASK-123-short-name`.
-   Before editing, check for uncommitted changes. Never overwrite
    another contributor's work.
-   Do not use `git reset --hard`, force-push, rewrite shared history,
    or delete branches unless the owner explicitly approves.
-   Do not commit secrets, `.env` files, customer data, database dumps,
    credentials or private logs.
-   Make small, focused commits with clear messages,
    e.g. `feat(TASK-012): add customer resolver`.
-   Run relevant tests and inspect `git diff` before committing.
-   Do not merge into the protected main branch. A human maintainer
    reviews and merges.
-   Never amend or rewrite another agent's commits without approval.

## 6. Multiple agents and parallel work

-   `TASKS.md` is the shared task board; mark a task `IN PROGRESS` with
    the assignee before starting.
-   Each agent should use a separate branch and, when possible, a
    separate Git worktree.
-   Do not assign two agents to edit the same files simultaneously.
-   Agree on interfaces/contracts before parallelising frontend, backend
    and integration work.
-   One designated integrator resolves conflicts; other agents must not
    independently rewrite shared files.
-   Each handoff must state: task ID, branch, files changed, tests
    run/results, known issues, next action and commit hash (if
    committed).
-   Do not assume another agent's local changes are present in your
    worktree.

## 7. Financial correctness

-   The LLM may interpret the question and explain returned results;
    deterministic code and verified ERPNext data supply financial
    figures.
-   Never fabricate a customer, balance, credit limit, invoice, due
    date, payment, currency or source timestamp.
-   Keep currencies separate unless a documented exchange-rate policy
    says otherwise.
-   Treat missing credit limit as unknown, not zero.
-   Do not assume "available credit = limit - invoices" until the
    approved exposure policy is documented.
-   Validate calculations against the approved ERPNext report for
    representative cases.
-   Use synthetic fixtures in development and tests.

## 8. Security and privacy

-   Use least-privilege read-only credentials.
-   Secrets belong in environment variables or an approved secret
    manager, never source code, prompts, screenshots or frontend
    bundles.
-   Never request or copy real customer data into public AI tools
    without explicit company approval and an approved data-handling
    process.
-   Enforce authentication and authorisation on the backend, not just
    the UI.
-   Validate user inputs, apply timeouts, pagination and rate limits.
-   Do not expose arbitrary ERPNext API access or arbitrary SQL through
    an AI tool.
-   Log identifiers and operational events only as needed; avoid
    unnecessary financial/personal data in logs.
-   Do not bypass authentication, permissions, licensing or access
    controls.

## 9. Quality requirements

-   Add or update tests for behaviour changes.
-   Handle missing records, ambiguous customers, zero balances, API
    errors and timeouts.
-   Use clear names and small functions.
-   Avoid adding a dependency without explaining why and recording the
    decision if it affects architecture.
-   Document setup and configuration changes.
-   Keep the UI accessible and responsive.
-   Run the checks relevant to the changed area.

## 10. Definition of done

A task is done only when: - Its acceptance criteria are met. - Relevant
tests/checks have actually run and results are reported. - `git diff`
has been reviewed. - No secrets or real customer data were introduced. -
Documentation and `TASKS.md` are updated where needed. - The work is
committed on its task branch, or the handoff explicitly explains why
not. - A human reviewer can understand the change and its risks.

## 11. Required response format at task end

Report: 1. Task ID and goal. 2. Summary of changes. 3. Files changed. 4.
Tests/checks run and exact outcomes. 5. Known limitations or unresolved
questions. 6. Branch and commit hash, if applicable. 7. Recommended next
task.
