# SpecTeam Product Roadmap

This roadmap is ordered by dependency and parallel execution boundaries rather than by calendar time.

It reflects the current reality of the repository:

- The core collaboration workflow is implemented in prompt skills.
- The CLI and VS Code extension are thin UX layers.
- MCP connectors exist as reference implementations.
- A standalone Spec runtime or server does not exist yet.

The purpose of this roadmap is to move SpecTeam from a prompt-first workflow prototype toward a productized collaboration platform without skipping necessary foundation work.

## Planning Principles

1. Codify deterministic logic before adding more UI.
2. Make every surface consume the same state model instead of parsing markdown independently.
3. Standardize connector contracts before expanding the connector catalog.
4. Add real-time infrastructure only after the async workflow is stable.
5. Delay enterprise features until the core collaboration loop is trustworthy.

## Target Outcome

SpecTeam should evolve into a collaboration platform where:

- Agents share one reliable project state.
- humans can review, approve, and audit decisions without depending on chat-only workflows.
- external tools and document sources plug into one runtime contract.
- real-time status becomes an optimization layer, not the first dependency.

## Main Dependency Chain

| Order | Workstream | Depends on | Why it comes now | Key Deliverables | Done when |
|------|------------|------------|------------------|------------------|-----------|
| 1 | Protocol Specification | None | The repo currently relies on markdown conventions spread across prompt skills. Those conventions need a stable schema before they can be shared by code, UI, and server layers. | Versioned schemas for `COLLABORATORS`, `THESIS`, `SIGNALS`, `DIVERGENCES`, `decisions`, migration rules, parser contract, sample fixtures | A machine can parse core `.spec/` files without prompt-specific assumptions |
| 2 | Local State Engine | 1 | CLI, extension, and future services need one canonical way to derive status, actionable items, and consistency from repository state. | Workspace snapshot model, divergence index, pending approvals, consistency score logic, source-of-truth aggregation library | CLI, extension, and tests resolve the same repository state from the same engine |
| 3 | Decision Workflow State Machine | 1, 2 | Divergence handling is still described mostly as prompt behavior. The lifecycle needs explicit guardrails and validation rules. | `open -> proposed -> resolved -> fully-closed` transitions, vote rules, proposer/follower logic, action-item completion rules | Invalid state transitions are blocked by code rather than by convention |
| 4 | Spec Server | 2, 3 | Once local state and workflow rules are stable, they can be exposed as reusable APIs for tools and agents. | MCP resources, query APIs, action endpoints, workspace state service, standard response shapes | Tools can consume Spec state without directly parsing repository files |
| 5 | Tooling Refactor | 2 initially, 4 fully | The current CLI and VS Code extension duplicate lightweight parsing logic and should move onto shared state APIs. | CLI uses shared state engine/server, VS Code extension reads standardized state, consistent action handling | Tool UX no longer depends on ad hoc markdown regex parsing |
| 6 | Human Arbitration Center MVP | 4, 5 | A human-facing dashboard only becomes durable after the state model and decision actions are stable. | Divergence list, proposal comparison view, approval flow, decision history, action-item view | A human can inspect and approve decisions without driving the workflow from chat only |
| 7 | Connector Runtime | 1 initially, 4 fully | Connectors should plug into a common import and normalization pipeline instead of each behaving like a special case. | Connector manifest contract, auth model, normalization pipeline, import orchestration, runtime validation | New connectors can be added without re-implementing import semantics each time |
| 8 | Real-Time State Layer | 4, 6 | Real-time sync only makes sense after Spec has a stable server model and a UI that benefits from subscriptions. | Presence model, SIGNALS broadcast, subscription channels, incremental refresh protocol | Status changes can be pushed rather than discovered only through pull and refresh |
| 9 | Audit and Enterprise Layer | 4, 6, 8 | Compliance, private deployment, permissions, and enterprise support should build on a stable workflow and state architecture. | RBAC, audit storage, deployment model, team isolation, operational controls, admin workflows | Team Pro and Enterprise features have a credible technical base |

## Parallel Workstreams

These tracks can run in parallel once their starting dependency is satisfied.

| Track | Earliest Start | Depends on | Main Output | Notes |
|------|----------------|------------|-------------|-------|
| Contract and Fixture Testing | After 1 | Low | Schema fixtures, parser tests, state transition tests, regression scenarios | This should become the quality gate for workstreams 2 through 7 |
| UI Information Architecture and Prototype | After 2 draft | Medium | Dashboard information architecture, decision detail layout, approval UX prototype | Should use mock state first, not define the backend contract by accident |
| Prompt Logic Migration | After 2 | Medium | A clear split between deterministic logic in code and judgment-heavy logic in prompts | The goal is to reduce prompt burden, not remove prompts entirely |
| Connector Framework Expansion | After 1 | Medium | Shared connector runtime plus higher-value sources like Figma, Linear, GitHub Issues | Do not expand the source catalog before the contract stabilizes |
| Documentation and Demo Track | Immediate | Low | Updated READMEs, sample repos, workflow walkthroughs, architecture narratives | Keeps external messaging aligned with the actual product stage |

## Recommended Execution Rules

1. Every new UI surface should read from the shared state engine or Spec Server, never parse `.spec/*.md` directly.
2. Every rule that can be expressed deterministically should move out of prompt text into code or schemas.
3. Every connector should output one normalized document contract before it is imported into `.spec/design/`.
4. Every major milestone should add fixtures and regression tests before expanding scope.

## Readiness Gates

### Gate A - Protocol is machine-readable

- Core `.spec/` documents have explicit schemas and migration rules.
- Fixtures cover legacy and current file formats.

### Gate B - State is consistent across surfaces

- CLI, VS Code extension, and tests all consume the same derived state.
- Consistency scoring is implemented as code, not only described in prompt text.

### Gate C - Decisions are operable without chat-only mediation

- A human can inspect divergences, review proposals, approve or reject, and track follow-up action items in UI.

### Gate D - Real-time adds leverage instead of complexity

- Async repository workflow already works reliably.
- Real-time subscriptions improve speed, not correctness.

## Explicit Non-Goals For The Next Stage

- Building the full Yjs, Yunxin, and database stack before Spec has a stable state service.
- Expanding to many connectors before a shared contract exists.
- Building a heavy dashboard before the underlying state APIs are trustworthy.
- Treating enterprise deployment requirements as a substitute for core workflow maturity.

## Related Documents

- [Architecture](./architecture.md)
- [Product Requirements](./product-requirements.md)
- [Go-to-Market](./go-to-market.md)
- [Foundation Execution Plan](./execution-plan.md)
- [Chinese Roadmap](./roadmap.zh-CN.md)