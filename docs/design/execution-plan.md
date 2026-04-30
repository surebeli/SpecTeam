# SpecTeam Foundation Execution Plan

This document expands the first four workstreams in the roadmap into an execution-level plan.

It is intentionally scoped to the platform foundation:

- Protocol Specification
- Local State Engine
- Decision Workflow State Machine
- Spec Server

It does not yet cover the human arbitration UI, real-time sync, or enterprise operations in depth.

## Scope

The goal of this plan is to move SpecTeam from a prompt-driven workflow prototype to a reusable product core.

The guiding constraint is simple: every deterministic rule should move into shared code or schemas before new surfaces are built on top of it.

## Working Assumptions

1. `.spec/` remains the repository-local source of truth during this stage.
2. Prompt skills continue to exist during migration, but they should consume shared state rather than invent it.
3. The CLI and VS Code extension should become consumers of the same derived state, not owners of business rules.
4. MCP connectors should normalize imported content into the same document contract used by the rest of the system.

## Proposed Module Boundaries

These names are placeholders for logical modules. They can be implemented as packages, folders, or internal libraries later.

| Module | Responsibility | Depends on | Primary Consumers |
|--------|----------------|------------|-------------------|
| `spec-schema` | Document schemas, parsing rules, migration helpers, validation errors | None | state engine, workflow engine, tests, server |
| `spec-state` | Repository scan, normalized workspace snapshot, derived state and consistency scoring | `spec-schema` | CLI, extension, server, tests |
| `spec-workflow` | Divergence state transitions, vote handling, action item lifecycle, decision generation contract | `spec-schema`, `spec-state` | server, prompts, tests |
| `spec-server` | MCP resources, query APIs, action endpoints, subscriptions later | `spec-state`, `spec-workflow` | tools, agents, UI |
| `spec-fixtures` | Sample `.spec/` states, regression cases, migration fixtures | `spec-schema` | tests for all modules |

## Workstream 1 - Protocol Specification

### Objective

Define one machine-readable contract for the core `.spec/` documents so every runtime surface reads the same structure.

### Primary Outputs

- Canonical field definitions for `COLLABORATORS`, `THESIS`, `SIGNALS`, `DIVERGENCES`, and `decisions/D-*.md`
- Versioning strategy for schema evolution
- Migration policy for legacy repositories
- Parsing and validation error model
- Fixtures that represent valid, invalid, and migrated states

### Task Breakdown

| Task | Description | Output |
|------|-------------|--------|
| 1.1 Current format audit | Inventory how each core `.spec/` document is described in prompt skills, README examples, and tests | Format inventory with mismatches and ambiguities |
| 1.2 Canonical data model | Define the minimum required fields, optional fields, and derived fields for each core document | Schema draft for each document type |
| 1.3 Metadata strategy | Define how schema version, generator identity, and timestamps are encoded in machine-readable form | Metadata envelope rules |
| 1.4 Validation rules | Define required-field validation, referential integrity, and unsupported-state handling | Validation rule set and error catalog |
| 1.5 Migration rules | Define how older repositories upgrade forward without breaking prompts | Migration spec and fixture coverage |
| 1.6 Fixture pack | Create representative fixtures for clean, conflicted, proposed, resolved, and partially migrated states | Shared test fixture library |

### Canonical Entities To Lock Down

| Entity | Must become explicit |
|--------|----------------------|
| Collaborator | `code`, `role`, `sourceDirectories`, `specPath`, `joinedAt`, optional ownership metadata |
| Divergence | `id`, `status`, `parties`, `priority`, `nature`, `foundAt`, `proposal`, `votes`, `history`, `changeInstructionsRef` |
| Decision | `decisionId`, `resolutionSummary`, `rationale`, `finalizedBy`, `resolvedAt`, `actionItems` |
| Action Item | `owner`, `targetFile`, `requiredChanges`, `acceptanceCriterion`, `completionState` |
| Signal | blocker, status, source, updatedAt, optional scope |

### Exit Criteria

- A parser can load every supported `.spec/` document into a stable in-memory model.
- Fixtures exist for both current and legacy shapes.
- The roadmap no longer relies on informal markdown interpretation for core entities.

## Workstream 2 - Local State Engine

### Objective

Build one deterministic engine that derives workspace state from repository contents.

### Responsibilities

- Read `.spec/` documents and normalize them into one workspace snapshot
- Derive actionable items for the current user and for all collaborators
- Compute divergence summaries and consistency score
- Expose a stable query surface for CLI, extension, tests, and server

### Core Domain Model

| Model | Purpose |
|-------|---------|
| `WorkspaceSnapshot` | Raw and normalized view of the repository's Spec state |
| `CollaboratorView` | One collaborator's role, source mapping, and pending work |
| `DivergenceView` | Fully normalized divergence with proposal, vote, and actionability state |
| `DecisionView` | Resolved decision plus action item progress |
| `ConsistencyScore` | Numeric score plus contributing factors and explanations |
| `WorkspaceHealth` | Missing files, invalid fields, stale sync markers, unresolved blockers |

### Task Breakdown

| Task | Description | Output |
|------|-------------|--------|
| 2.1 Repository reader | Read `.spec/` and related git metadata into a raw input structure | Repository loading layer |
| 2.2 Normalization layer | Convert parsed files into canonical views independent of markdown formatting | Normalized state models |
| 2.3 Derived state rules | Compute pending approvals, open divergences, stale sync, and source-update obligations | Deterministic derivation functions |
| 2.4 Consistency scoring | Turn the prompt-described score into code with explainable factors | Scoring engine with factor breakdown |
| 2.5 Query contract | Define stable selectors like `getWorkspaceState`, `listActionableDivergences`, `getPendingActionItems` | Public state API |
| 2.6 Regression coverage | Ensure existing examples and mock scenarios resolve to stable outputs | State engine test suite |

### Output Contract

The state engine should be able to answer these questions without prompt interpretation:

- Who am I in this workspace?
- Which divergences are actionable for me right now?
- Which decisions are resolved but not fully closed?
- Why is the consistency score not 100?
- Which files or metadata are invalid, stale, or missing?

### Exit Criteria

- The CLI and extension can consume the same derived state object.
- Consistency score is computed by code and includes explanation factors.
- Test scenarios produce reproducible outputs from fixtures alone.

## Workstream 3 - Decision Workflow State Machine

### Objective

Turn divergence resolution from a prompt convention into a deterministic workflow engine with explicit invariants.

### Core Invariants

1. A divergence must have exactly one active status.
2. Only valid role holders can propose, approve, reject, finalize, or withdraw.
3. `resolved` requires a coherent decision record and action item snapshot.
4. `fully-closed` requires all required action items to be complete.
5. Invalid vote combinations must be rejected before any file mutation is written.

### Commands To Support

| Command | Result |
|---------|--------|
| `proposeResolution` | Moves `open` to `proposed` and records proposer, rationale, and vote |
| `approveProposal` | Adds a valid approval to a proposed divergence |
| `rejectProposal` | Reverts to `open` with preserved history |
| `modifyProposal` | Replaces the active proposal while preserving history |
| `finalizeResolution` | Moves `proposed` to `resolved`, creates decision output, generates action item set |
| `withdrawProposal` | Reverts a proposal to `open` with explicit history |
| `markActionItemComplete` | Updates action item progress toward `fully-closed` |
| `recomputeClosure` | Re-evaluates whether a resolved divergence is now fully closed |

### Task Breakdown

| Task | Description | Output |
|------|-------------|--------|
| 3.1 State transition table | Define valid from-state to to-state transitions and rejection reasons | Transition matrix |
| 3.2 Permission model | Encode maintainer, contributor, observer behavior for workflow actions | Workflow authorization rules |
| 3.3 Vote semantics | Define how proposer, reviewers, and finalization interact in multi-party cases | Vote aggregation rules |
| 3.4 Decision generation contract | Define what must exist in decision files before a divergence can resolve | Decision creation validator |
| 3.5 Action item lifecycle | Define pending, complete, no-change-needed, and stale states | Action item lifecycle rules |
| 3.6 Failure recovery | Define how partial writes, invalid history, and stale source updates are surfaced | Recoverable workflow error model |

### Exit Criteria

- Every workflow mutation is validated against explicit invariants.
- Prompt skills can call shared workflow logic instead of embedding transition rules in prose.
- Multi-party cases are supported without inventing new ad hoc markdown formats.

## Workstream 4 - Spec Server

### Objective

Expose Spec state and workflow actions through one reusable runtime surface for tools, agents, and later UI.

### Minimum Boundary

The first Spec Server should do four things well:

1. Read workspace state through the state engine.
2. Expose canonical query resources.
3. Execute validated workflow actions.
4. Return structured responses that tools can consume without markdown scraping.

### Explicit Non-Goals For The First Server Cut

- No Yjs or CRDT layer yet.
- No external database dependency.
- No long-running audit store beyond repository state and local logs.
- No full web dashboard embedded into the server deliverable.

### Recommended Capability Surface

#### Query Resources

| Resource | Purpose |
|----------|---------|
| `spec://workspace/state` | Full normalized workspace state |
| `spec://workspace/health` | Validation issues, stale files, blockers |
| `spec://collaborators` | Collaborator list and role model |
| `spec://divergences` | Divergence summary list |
| `spec://divergence/{id}` | Full divergence detail |
| `spec://decisions/{id}` | Decision detail and action item progress |
| `spec://signals` | Current signal and blocker state |

#### Action Tools

| Tool | Purpose |
|------|---------|
| `spec_refresh_state` | Recompute and return current state |
| `spec_propose_resolution` | Submit a proposal for an open divergence |
| `spec_record_vote` | Approve, reject, or modify a proposal |
| `spec_finalize_resolution` | Resolve a divergence and emit decision/action items |
| `spec_update_action_item` | Mark action items complete or stale |
| `spec_validate_workspace` | Validate schemas, references, and workflow invariants |

### Task Breakdown

| Task | Description | Output |
|------|-------------|--------|
| 4.1 Server contract | Define request and response shapes for resources and tools | Server API contract |
| 4.2 Runtime adapter | Wrap state engine and workflow engine behind a single runtime layer | Spec runtime service |
| 4.3 Mutation boundary | Ensure all writes go through validated commands rather than direct file edits | Controlled mutation adapter |
| 4.4 Tool integration | Adapt CLI, extension, and prompt flows to consume server responses incrementally | Consumer integration plan |
| 4.5 Observability | Add structured logs and failure categories for debugging | Server diagnostics model |

### Exit Criteria

- Tools can query Spec state without parsing markdown files directly.
- Workflow mutations are executed through validated commands only.
- The server can become the source for later UI and real-time layers without reworking the domain model.

## Dependency Rules

1. Workstream 2 cannot freeze its public query contract before Workstream 1 fixtures are stable.
2. Workstream 3 can begin when Workstream 2 has draft normalized models, but it cannot finalize command semantics until the state model is stable.
3. Workstream 4 can prototype query resources early, but it should not expose mutating tools before workflow invariant tests pass.

## Parallel Support Tracks

| Track | Starts After | Contribution |
|-------|--------------|--------------|
| Contract and fixture tests | Workstream 1 draft | Locks down schemas and regression coverage |
| Prompt migration | Workstream 2 draft | Reduces duplicated logic inside skill text |
| Tooling refactor | Workstream 2 draft, deeper after Workstream 4 | Moves CLI and extension onto shared state instead of custom parsing |

## Recommended Next Documents

- Schema specification for each core `.spec/` file
- State engine interface doc
- Workflow command contract doc
- Spec Server API and resource spec

## Related Documents

- [Roadmap](./roadmap.md)
- [Architecture](./architecture.md)
- [Chinese Execution Plan](./execution-plan.zh-CN.md)
