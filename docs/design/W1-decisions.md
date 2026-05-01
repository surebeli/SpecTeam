# Workstream 1 — Schema Decisions

This document tracks the schema-design decisions that must be answered before
`@specteam/schema` (per `phase-2-tasks.md` FN-2) can land. Every decision was
extracted from `protocol-audit.md` §"Inputs to Workstream 1 schema design".

> **Status: resolved 2026-05-01.** All eight decisions have been answered with
> the audit-derived defaults. The schema PR (FN-2) is unblocked. See the
> resolution log at the bottom for the full record.

## How to use this document

Each decision has a fixed shape:

- **Question** — what must be answered, in one sentence.
- **Why it matters** — what schema field, validator rule, or downstream
  workstream is gated on it.
- **Current surfaces** — `path:line` references to where the topic appears in
  the codebase today (audit-derived; do not invent).
- **Options** — 2-4 concrete options. Each option must be implementable;
  "TBD" is not an option.
- **Default if no answer** — the option that the schema PR will adopt if the
  decision is left open past Phase 2's start. Pick the lowest-blast-radius
  option here, not the most ambitious.
- **Decision** — `Open` until answered. When answered, replace with the
  chosen option's letter and a one-line rationale. Add the answer date.

Decisions do not need to be answered in order. The schema PR can land in
slices keyed to whichever group is unblocked first.

## D1 — `Role` column in `COLLABORATORS.md`

- **Question.** Is `Role` mandatory in `COLLABORATORS.md`, and how do we treat
  legacy rows that omit it?
- **Why it matters.** Every role-guarded skill (push / align / archive) needs
  a deterministic role lookup. Today the lookup falls back to `contributor`
  when the column is missing — that is a soft default, not a schema
  guarantee.
- **Current surfaces.** `plugin/SHARED-CONTEXT.md:26`, `plugin/SHARED-CONTEXT.md:31`,
  `plugin/skills/spec-init/SKILL.md:142`, `protocol-audit.md` §"Entity: Collaborator".
- **Options.**
  - **A. Mandatory in schema, lazy migration.** Schema requires `Role`.
    Validator rejects rows without it. Init template already writes it.
    A migration helper rewrites legacy `COLLABORATORS.md` on first read.
  - **B. Mandatory in schema, eager migration.** Same as A, but `spec-init`
    on a legacy repo refuses to run until the user re-runs an explicit
    `spec-migrate` command.
  - **C. Optional forever.** Schema marks `Role` as optional. Default
    remains `contributor`. No migration required.
- **Default if no answer.** A — lowest churn for users, smallest exception
  surface for the validator.
- **Decision.** Resolved 2026-05-01 — see resolution log.

## D2 — Canonical divergence shape across all four states

- **Question.** What is the canonical shape of a `DIVERGENCES.md` entry for
  each of `open` / `proposed` / `resolved` / `fully-closed`? In particular,
  do `resolved` and `fully-closed` carry vote lists, proposer/confirmer
  fields, or both?
- **Why it matters.** The validator now covers all four states (after this
  branch's commit), but the README compact example uses
  `Proposer` / `Confirmer` while the validator and resolved fixture require a
  `Final Votes` block. The schema must pick exactly one shape per state.
- **Current surfaces.** `protocol-audit.md` §"Entity: Divergence",
  `plugin/skills/spec-align/SKILL.md:283`, `plugin/skills/spec-align/SKILL.md:288`,
  `tests/validate-divergences.js:95`, `README.md:298`.
- **Options.**
  - **A. Vote list only.** Resolved and fully-closed both keep `Final Votes`.
    The README compact example is rewritten or marked as legacy.
  - **B. Proposer/confirmer only.** Resolved and fully-closed normalize to
    `Proposer` / `Confirmer`. Vote lists stay on `proposed` only. The
    validator and shipped fixtures are rewritten.
  - **C. Both, with vote list authoritative.** Documents may carry both
    forms; schema designates `Final Votes` as the parsed source of truth.
- **Default if no answer.** A — matches what the shipped validator already
  enforces and what the FT-2b fixtures emit.
- **Decision.** Resolved 2026-05-01 — see resolution log.

## D3 — Canonical action-item model

- **Question.** Where does the authoritative action-item record live —
  the resolved divergence summary, the decision file, or both? And what is
  the normalized completion-state enum?
- **Why it matters.** Today four surfaces describe action items
  differently: README's four-column table, the divergence three-column table,
  the per-party block in decision files, and `spec-status` summary text.
  The state engine (W2) and update workflow (W3) need one model.
- **Current surfaces.** `protocol-audit.md` §"Entity: ActionItem",
  `plugin/skills/spec-align/SKILL.md:241`, `plugin/skills/spec-align/SKILL.md:288`,
  `plugin/skills/spec-update/SKILL.md:153`, `README.md:398`, `README.md:400`.
- **Options.**
  - **A. Decision file is authoritative.** Per-party block under
    `decisions/D-{N}.md` carries `owner`, `targetFile`, `requiredChanges`,
    `acceptanceCriterion`, `completionState`. Divergence table is a derived
    summary, not a parse target. Enum: `pending` / `complete` /
    `no-change-needed`.
  - **B. Divergence table is authoritative.** Resolved divergence carries
    the table; decision file is human prose only. Enum same as A.
  - **C. Both, with reconciliation rules.** Schema requires the two to
    match; validator asserts equality. Doubles the write cost but matches
    today's drifted reality.
- **Default if no answer.** A — decision files already carry the per-party
  detail and are the only surface where `requiredChanges` and
  `acceptanceCriterion` exist today.
- **Decision.** Resolved 2026-05-01 — see resolution log.

## D4 — `SIGNALS.md` structured vs free-form

- **Question.** Is `SIGNALS.md` a structured event log with typed fields, a
  current-state summary, or a free-form bulletin board?
- **Why it matters.** No shipped prompt defines a row, bullet, or section
  template. `spec-status` and `spec-parse` consume it as prose. If the
  state engine treats it as structured, every existing workspace breaks.
- **Current surfaces.** `protocol-audit.md` §"Entity: Signal",
  `plugin/SHARED-CONTEXT.md:73`, `plugin/skills/spec-status/SKILL.md:62`,
  `plugin/skills/spec-parse/SKILL.md:73`, `plugin/skills/spec-align/SKILL.md:301`,
  `plugin/skills/spec-update/SKILL.md:176`.
- **Options.**
  - **A. Free-form, out of schema.** Schema has no SIGNALS contract. The
    state engine surfaces blockers via `WorkspaceHealth` derived from
    DIVERGENCES + last-sync staleness, not from SIGNALS.
  - **B. Structured event log.** Schema defines a typed row format
    (`status`, `source`, `updatedAt`, optional `scope`). Existing prose
    bullets must be migrated.
  - **C. Hybrid.** Schema defines an optional structured section under a
    fixed heading; legacy prose remains valid above/below it.
- **Default if no answer.** A — least disruptive, and `WorkspaceHealth` /
  `ConsistencyScore` already cover the operational need.
- **Decision.** Resolved 2026-05-01 — see resolution log.

## D5 — Single timestamp policy

- **Question.** What timestamp format(s) are canonical across markdown
  entities and JSON state files?
- **Why it matters.** Four formats coexist today (date-only, ISO 8601,
  `tool @ commit (date)`, bracketed-date bullets). A schema cannot validate
  a timestamp without naming the format.
- **Current surfaces.** `protocol-audit.md` §"Cross-cutting metadata →
  Timestamps", with citations to spec-init / spec-review / spec-update /
  spec-parse / spec-align.
- **Options.**
  - **A. ISO 8601 everywhere.** Markdown human-facing dates also become ISO
    timestamps. Templates and existing fixtures must be rewritten.
  - **B. Mixed by surface.** JSON state uses ISO 8601. Markdown event lines
    keep `tool @ commit (date)`. Markdown human-readable fields (Joined,
    Resolved at when shown without commit) keep date-only. Schema declares
    the format per field.
  - **C. ISO 8601 in JSON, free-form in markdown.** Schema does not
    constrain markdown dates at all. Validator only checks JSON timestamps.
- **Default if no answer.** B — matches reality, costs nothing to adopt,
  but locks schema to per-field declarations.
- **Decision.** Resolved 2026-05-01 — see resolution log.

## D6 — `INDEX.md` in or out of schema

- **Question.** Is `INDEX.md` part of the protocol contract, or a derived
  artifact whose shape can evolve independently?
- **Why it matters.** If derived, the state engine generates it instead of
  parsing it. If part of the contract, the engine and any future Spec
  Server must round-trip it byte-faithfully.
- **Current surfaces.** `protocol-audit.md` §"Entity: Index",
  `plugin/skills/spec-parse/SKILL.md:41`, `plugin/skills/spec-parse/SKILL.md:46`,
  `plugin/skills/spec-parse/SKILL.md:75`.
- **Options.**
  - **A. Derived artifact, out of schema.** Schema does not constrain
    INDEX.md. State engine regenerates it from THESIS / DIVERGENCES /
    COLLABORATORS. Templates may evolve.
  - **B. Part of schema, parsed.** Schema defines required sections.
    Validator asserts shape. The engine consumes INDEX as a faster cache
    over the underlying entities.
- **Default if no answer.** A — INDEX is already regenerated by parse and
  has no consumer that needs guarantees beyond "human-readable."
- **Decision.** Resolved 2026-05-01 — see resolution log.

## D7 — `RULES.md` in or out of schema

- **Question.** Is `RULES.md` part of the schema (typed sections) or a
  free-form code-conventions surface?
- **Why it matters.** Created at init, read by suggest, never written by
  parse — but not enumerated as a W1 entity in `execution-plan.md`. Without
  a decision, a schema PR could either over-constrain or silently exclude
  it.
- **Current surfaces.** `protocol-audit.md` §"Out of scope but observed",
  `plugin/SHARED-CONTEXT.md:35`, `plugin/skills/spec-init/SKILL.md:155`,
  `plugin/skills/spec-suggest/SKILL.md:36`, `plugin/skills/spec-parse/SKILL.md:20`.
- **Options.**
  - **A. Out of schema.** RULES.md is a free-form convention document.
    Schema does not constrain it. spec-suggest reads it as prose.
  - **B. In schema, optional sections.** Schema declares optional named
    sections (e.g. `## Naming`, `## Testing`). Validator only checks that
    declared sections, if present, follow the typed shape.
  - **C. In schema, required structure.** Schema requires a fixed set of
    sections. Init template enforces. Existing user content must migrate.
- **Default if no answer.** A — matches the SIGNALS decision direction
  (D4) and minimizes user-facing churn.
- **Decision.** Resolved 2026-05-01 — see resolution log.

## D8 — Consistency-score model

- **Question.** What is the deterministic consistency-score function:
  bucket boundaries, factor weights, and which signals contribute?
- **Why it matters.** Roadmap Gate B requires the score to be code, not
  prompt prose. The state engine (W2) cannot ship a `ConsistencyScore`
  model without a formula. `spec-status` continues to render whatever the
  AI invents until the formula exists.
- **Current surfaces.** `protocol-audit.md` §"Cross-cutting: consistency
  score surfaces", `plugin/skills/spec-status/SKILL.md:64`,
  `SPECTEAM.md:185`, `tests/prompts/10-status-full.md:53`,
  `docs/design/execution-plan.md:101`, `docs/design/execution-plan.md:122`.
- **Options.**
  - **A. Bands as cutoffs, additive penalties.** Start at 100. Each open
    blocking divergence subtracts 30. Each open directional subtracts 15.
    Each open detail subtracts 5. Each proposed (any priority) subtracts 5.
    Floor at 0. SIGNALS blockers and stale-sync are reported via
    `WorkspaceHealth`, not the score.
  - **B. Bands as enums.** Score is one of `aligned` / `proposed` /
    `directional` / `blocking`, not a number. The 0-100 form becomes a
    rendering choice, not a computed value.
  - **C. Bands as cutoffs, weighted factors.** Same factor list as A but
    with per-factor weights configurable per workspace via
    `.spec/config.json`. Higher complexity, higher flexibility.
- **Default if no answer.** A — deterministic, matches the band ranges
  the prompts already advertise, and produces the integer that
  `tests/mock-scenarios/README.md:31` already asserts.
- **Decision.** Resolved 2026-05-01 — see resolution log.

## Resolution log

When a decision is answered, append a one-line entry here with the date and
the chosen option letter.

- 2026-05-01: **D1 → A** (Role mandatory in schema, lazy migration). Validator rejects rows without it; legacy `COLLABORATORS.md` is rewritten on first read by a migration helper.
- 2026-05-01: **D2 → A** (Vote list only). Resolved and fully-closed both keep `Final Votes`; README's compact `Proposer`/`Confirmer` example is to be rewritten or marked legacy.
- 2026-05-01: **D3 → A** (Decision file is authoritative). Per-party block under `decisions/D-{N}.md` carries `owner`, `targetFile`, `requiredChanges`, `acceptanceCriterion`, `completionState`. Divergence summary table is derived. Enum: `pending` / `complete` / `no-change-needed`.
- 2026-05-01: **D4 → A** (`SIGNALS.md` free-form, out of schema). Schema does not constrain SIGNALS; state engine surfaces blockers via `WorkspaceHealth` derived from DIVERGENCES + last-sync staleness.
- 2026-05-01: **D5 → B** (Mixed by surface). JSON state uses ISO 8601. Markdown event lines keep `tool @ commit (date)`. Markdown human-readable fields (`Joined`, `Resolved at` without commit) keep date-only. Schema declares the format per field.
- 2026-05-01: **D6 → A** (`INDEX.md` derived artifact, out of schema). State engine regenerates it from THESIS / DIVERGENCES / COLLABORATORS; templates may evolve.
- 2026-05-01 remediation: Phase 2 implementation was realigned to D4/D6. `@specteam/schema` and `spec validate` no longer treat `SIGNALS.md` or `INDEX.md` as strict schema-validation targets.
- 2026-05-01: **D7 → A** (`RULES.md` out of schema). Free-form code-conventions surface; spec-suggest reads it as prose.
- 2026-05-01: **D8 → A** (Bands as cutoffs, additive penalties). Start at 100. Open blocking: -30. Open directional: -15. Open detail: -5. Proposed (any priority): -5. Floor at 0. SIGNALS blockers and stale-sync are reported via `WorkspaceHealth`, not the score.

## Related documents

- [Protocol Audit](./protocol-audit.md) — the source of every entry above.
- [Phase 2 Tasks](./phase-2-tasks.md) — FN-2 (`@specteam/schema`) consumes
  these decisions. FN-2 cannot start until enough of D1–D8 are answered to
  declare each entity's shape.
- [Roadmap](./roadmap.md) — Workstream 1 done-when criterion.
- [Execution Plan](./execution-plan.md) — Workstream 1 task breakdown.
