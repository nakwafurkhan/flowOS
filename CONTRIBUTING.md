# Contributing

## Before starting

-   Read `AGENTS.md` and the relevant specification.
-   Confirm the task is `READY` and approved.
-   Check `git status`; do not overwrite uncommitted work.
-   Create a task branch from an up-to-date main branch.

## Branch names

-   `feat/<TASK-ID>-short-name`
-   `fix/<TASK-ID>-short-name`
-   `docs/<TASK-ID>-short-name`
-   `chore/<TASK-ID>-short-name`

## Commit messages

Use a concise conventional style: -
`feat(TASK-ID): add customer lookup` -
`fix(TASK-ID): handle missing due date` -
`test(TASK-ID): cover partial payments` -
`docs(TASK-ID): clarify ageing policy`

## Pull request checklist

-   Link the task ID and state the user-visible purpose.
-   Explain the design and any trade-offs.
-   List files changed.
-   State the tests actually run and their results.
-   Explain security/data implications.
-   Include screenshots for UI changes, using synthetic data only.
-   Identify unresolved questions and rollback concerns.
-   Confirm no secrets or customer data are included.

## Review and merge

A human maintainer reviews every change. The author/agent must not
self-merge to the protected main branch. Architecture, scope, credit
rules, authentication and data-handling changes require explicit owner
review.
