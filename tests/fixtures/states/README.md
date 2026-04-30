# SpecTeam State Fixtures

These fixtures seed Workstream 1 schema work with minimal but complete `.spec`
trees covering the main workflow states and one legacy format.

| Fixture | Purpose | Key invariants exercised |
|---------|---------|--------------------------|
| `clean-workspace` | Aligned collaborators with no divergences | Roles + Main Branch present, no pending divergences, explicit empty signals marker |
| `conflicted` | Open blocking divergence before proposal | Modern collaborator registry, open divergence shape, blocker signal |
| `proposed-multi-party` | Three-party proposal awaiting final consensus | Proposed divergence validated by existing validator, multi-party collaborator map, partial votes |
| `resolved-pending-action-items` | Decision finalized but source updates still pending | Resolved divergence validated by existing validator, decision file present, pending action item remains |
| `fully-closed` | All source updates complete after a resolved decision | Decision file retained, fully-closed divergence metadata, completion signal |
| `legacy-pre-3.0` | Older workspace shape for future migration logic | No `Role` column, no `Main Branch` header, compact divergence formatting |

Reuse notes:
- API protocol fixtures reuse the Alice/Bob REST-vs-GraphQL scenario.
- Payment fixtures reuse the Alice/Bob/Carol three-way payment architecture scenario.
- Legacy keeps the same collaborator identities, but intentionally preserves older metadata shape.
