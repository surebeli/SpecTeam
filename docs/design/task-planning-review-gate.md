# Task Planning Review Gate

This document records the planning discipline adopted after the Phase 2
retrospective. Its purpose is to prevent coding agents from executing a task
plan that is internally inconsistent, underspecified, or disconnected from
design decisions.

## Problem Observed

Phase 2 mixed execution planning, design choices, verification notes, and review
entry material inside `docs/design/phase-2-tasks.md`. Later design decisions in
`docs/design/W1-decisions.md` were not reconciled back into the task list before
implementation. As a result, coding agents could follow the task file literally
and still diverge from the intended protocol shape.

The main failure mode was not lack of effort during implementation. The upstream
planning artifact allowed multiple valid interpretations:

- task file required schema/parser coverage for entities later marked out of
  schema;
- validation criteria focused on commands passing instead of protocol
  invariants;
- publish and CI gates were named but not made concrete enough to catch package
  installability or Node build/test coverage gaps.

## Required Planning Artifacts

Every future phase that changes protocol, package, workflow, migration, or CI
behavior must be prepared with three documents before implementation starts.

### `phase-N-tasks.md`

Execution plan only.

Required content:

- phase goal and explicit out-of-scope list;
- task breakdown with ownership boundaries;
- exhaustive intended file surfaces for each task;
- step-by-step implementation order;
- positive verification commands;
- negative or invariant verification requirements;
- commit boundaries and merge gates.

This file must not resolve design disagreements by implication. If the task
depends on a design choice, it must reference the matching decision ID.

### `phase-N-decisions.md`

Design decision log for the phase.

Required content for every blocking decision:

- question;
- why it matters;
- current surfaces and citations;
- options;
- default if no explicit answer is provided;
- final decision, date, and rationale;
- affected task IDs and file surfaces.

All blocking decisions must be resolved before implementation starts.

### `phase-N-plan-review.md`

Pre-execution review of `phase-N-tasks.md` and `phase-N-decisions.md`.

Required checks:

- all blocking decisions are resolved;
- task file surfaces match the decision outcomes;
- no task asks for entities, files, or behavior marked out of scope;
- every public CLI/package change has installability verification;
- CI gates name concrete jobs and commands, not just "CI green";
- migrations and legacy compatibility paths have explicit tests;
- valid empty states are included in schema/parser acceptance criteria;
- implementation is not allowed to add protocol special cases outside the
  protocol package unless the task explicitly approves that exception.

Implementation may start only when this review is marked approved.

## Execution Reviews

Implementation review must be separate from plan review. Use either:

- `phase-N-implementation-review.md`; or
- an `Implementation Review` section in `phase-N-review.md` if the phase is
  small.

Implementation review must audit the executed commits against both tasks and
decisions. It must not merely confirm that checklist commands passed.

## Gate Rule

For future phase work, the order is mandatory:

1. Draft `phase-N-tasks.md`.
2. Draft `phase-N-decisions.md`.
3. Review both in `phase-N-plan-review.md`.
4. Fix inconsistencies.
5. Mark plan review approved.
6. Execute implementation.
7. Write implementation review.
8. Merge only after blocking findings are closed or explicitly deferred.

## Non-Negotiable Invariants

- Decision documents outrank task documents when they conflict.
- Task documents must be updated after decisions change.
- Review documents must be allowed to reject the task plan itself.
- A command passing is not sufficient if a protocol invariant is violated.
- CLI consumers must not hide schema/parser failures with local workarounds.
- Public packages must be verified from their packed/installable form, not only
  from a monorepo checkout.
