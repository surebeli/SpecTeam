# SpecTeam Technical Architecture

> Chinese version: [architecture.zh-CN.md](./architecture.zh-CN.md)

This document describes the architecture that supports the current product thesis:
**SpecTeam keeps specs, decisions, and AI agents aligned.**

It is intentionally narrower than a full "AI collaboration platform" architecture. It
describes what exists today, and what the [roadmap](./roadmap.md) will add next. It
does not pre-commit to any real-time, CRDT, server, or database stack — those belong
to later gates and are explicit non-goals for the current PMF phase.

## Design Principles

1. **Git is the source of truth.** Every collaboration artifact lives in the repo.
   Specs, decisions, divergence state, and action items are all plain files under
   `.spec/` so they version, diff, review, and merge like code.
2. **Prompt skills own judgment; code owns determinism.** Parsing, state scoring,
   and transition guards belong in code. Framing divergences and proposing decisions
   stay in prompts. This split is the plan of record for the tooling refactor in
   the roadmap.
3. **Every surface consumes the same state.** The CLI, the VS Code extension, and
   future servers must derive workspace state from one shared engine instead of each
   re-parsing markdown with its own regex.
4. **Async first.** The async Git workflow must be complete and trustworthy before
   any real-time sync or subscription layer is considered.
5. **Thin product surfaces.** Distribution stays as prompt skills + lightweight CLI
   + lightweight VS Code view. Heavier surfaces wait for the underlying contract to
   stabilize.

## Current Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your Git repository                      │
│                                                                 │
│   .spec/                                                        │
│     ├── THESIS.md          ← North Star + Decision Log          │
│     ├── COLLABORATORS.md   ← Identity map                       │
│     ├── DIVERGENCES.md     ← Divergence registry (D-001…)       │
│     ├── SIGNALS.md         ← Runtime status & blockers          │
│     ├── RULES.md           ← Code conventions                   │
│     ├── INDEX.md           ← Auto-generated document index      │
│     ├── decisions/         ← Per-divergence decision records    │
│     └── design/{code}/     ← Normalized per-collaborator specs  │
└───────────────────────────────┬─────────────────────────────────┘
                                │ read / write
        ┌───────────────────────┼────────────────────────┐
        │                       │                        │
        ▼                       ▼                        ▼
┌────────────────┐   ┌────────────────────┐   ┌────────────────────┐
│  Prompt skills │   │     SpecTeam CLI   │   │ VS Code extension  │
│  (plugin/)     │   │     (cli/)         │   │ (vscode-extension/)│
│                │   │                    │   │                    │
│ Invoked inside │   │ `spec install`     │   │ Divergence Review  │
│ Claude Code /  │   │ `spec init`        │   │ tree view          │
│ Codex / any    │   │ `spec status`      │   │                    │
│ LLM tool loop  │   │ `spec sos`         │   │ Launches           │
│                │   │                    │   │ `/spec-align` in   │
│ Runs review /  │   │ Thin local         │   │ an integrated      │
│ align / parse  │   │ dashboard, no      │   │ terminal           │
│ / update / …   │   │ business logic     │   │                    │
└────────────────┘   └────────────────────┘   └────────────────────┘
```

### Prompt skills — the workflow engine

`plugin/skills/spec-*/SKILL.md` defines the entire collaboration loop. Each skill is
a deterministic prompt executed by the AI tool. The skills enforce:

- identity guard via `git config spec.member-code`,
- branch guard via `git config spec.main-branch`,
- the four-state divergence lifecycle `open → proposed → resolved → fully-closed`,
- the Propose → Approve two-phase decision rule,
- source-document read-only invariant (only `.spec/` is ever mutated).

See `plugin/SHARED-CONTEXT.md` for the shared plugin contract and
`plugin/CLAUDE.md` / `plugin/AGENTS.md` for platform-specific overrides.

### CLI (`specteam-cli`) — zero-token local surface

`cli/bin/spec.js` is a thin Node CLI with no business logic. It exists to:

- scaffold `.spec/` and trigger `/spec-init` (`spec init`),
- install the skill prompts into `.claude/commands/` (`spec install`),
- render a local dashboard of DIVERGENCES.md status without burning tokens (`spec status`),
- detect Git tree merge conflicts and hand off to `/spec-sos` (`spec sos`).

Its parsing is intentionally simple today and will move onto the shared state engine
as part of the roadmap's tooling refactor.

### VS Code extension — lightweight visibility

`vscode-extension/` contributes a `SpecTeam` activity-bar view that renders
`.spec/DIVERGENCES.md` as a tree and launches `/spec-align D-xxx` in an integrated
terminal for the user's AI CLI. It does not run resolution logic itself.

## State Model

Everything SpecTeam cares about is derivable from the `.spec/` tree plus local Git
config. Canonical fields:

| Artifact | Purpose | Written by | Read by |
|----------|---------|-----------|---------|
| `THESIS.md` | North Star + Decision Log (append-only) | `spec-init`, `spec-align` finalize | all skills, `spec-status` |
| `COLLABORATORS.md` | Member code ↔ design directory map, main branch record | `spec-init`, `spec-whoami` | all skills |
| `DIVERGENCES.md` | D-NNN registry with stable IDs and lifecycle state | `spec-review`, `spec-align` | CLI, VS Code, `spec-push`, `spec-status` |
| `SIGNALS.md` | Runtime status & blockers | any skill | all surfaces |
| `decisions/D-NNN.md` | Per-divergence decision + acceptance criteria | `spec-align` | `spec-update`, `spec-review` |
| `INDEX.md` | Generated document index | `spec-parse` | all surfaces |
| `last-review.json`, `last-sync.json`, `last-parse.json` | Anchors for incremental work | review / update / parse | review / update / parse |

Local (never committed) identity lives in `git config`: `spec.member-code`,
`spec.main-branch`.

## Divergence Lifecycle

```
    open 🔴  ──(spec-align propose)──▶  proposed 🟡
                                           │
                       (other collaborator approves)
                                           │
                                           ▼
                                      resolved ✅
                                           │
              (spec-update marks all source action items complete)
                                           │
                                           ▼
                                    fully-closed 🔒
```

Rules:

- `propose` is non-destructive — THESIS is only written after approval.
- Resolution always records a decision file under `decisions/` with acceptance
  criteria that `spec-update` later verifies.
- Resolved entries are never deleted. They are the audit trail.

## What Is Deliberately Not Here Yet

These belong to later roadmap gates and must not be assumed to exist:

- A standalone Spec runtime or server.
- A shared state engine consumed by both CLI and extension — today each does its
  own lightweight regex parse.
- MCP connector catalog. `spec-import` is the extension point, but no connectors
  are shipped; the skill relies on whatever fetching capability the host AI tool
  provides.
- Real-time sync (CRDT, signaling, subscriptions).
- A web arbitration dashboard.
- RBAC, audit storage, enterprise deployment, private-cloud packaging.

The [roadmap](./roadmap.md) describes the dependency order in which these would be
added, and the [PRD](./product-requirements.md) lists them as explicit non-goals for
the current PMF phase.

## Evolution Path

The near-term foundation work, in dependency order:

1. **Protocol spec** — versioned JSON schemas for `COLLABORATORS`, `THESIS`,
   `DIVERGENCES`, `decisions/*`, `SIGNALS`, plus a parser contract and fixtures.
2. **Local state engine** — one library that turns a `.spec/` tree into a typed
   workspace snapshot, divergence index, pending-approval list, and consistency
   score. Replaces the duplicated regex paths in CLI and VS Code.
3. **Decision workflow state machine** — code-enforced transition rules for the
   four divergence states and the Propose → Approve contract.
4. **Spec server (optional)** — only after (2) and (3) are stable, expose the
   engine as an MCP/API surface for external tools and agents.

Everything beyond those four items stays gated behind PMF signal from the current
wedge.

## Related Documents

- [Product Requirements](./product-requirements.md)
- [Roadmap](./roadmap.md)
- [PMF Validation Loop](./pmf-loop.md)
- [Foundation Execution Plan](./execution-plan.md)
