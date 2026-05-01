# Phase 2 Remediation Prompt

Use this prompt to drive an implementation agent through the Phase 2
remediation work.

```text
You are remediating SpecTeam Phase 2 after implementation review.

Read these files first:
- docs/design/phase-2-review.md
- docs/design/task-planning-review-gate.md
- docs/design/phase-2-tasks.md
- docs/design/W1-decisions.md

Goal:
Fix the Phase 2 implementation so it matches the review findings and the
resolved W1 decisions. Do not broaden scope beyond the remediation items.

Hard rules:
- Do not edit plugin/skills/*/SKILL.md.
- Do not edit SPECTEAM.md.
- Do not use --no-verify.
- Do not hide schema/parser failures in the CLI.
- Do not make Signal/Index schema behavior inconsistent with W1 decisions. If
  you believe the implementation should keep Signal/Index in schema scope, stop
  and update the design decision docs first instead of silently proceeding.
- Preserve unrelated user changes.

Required fixes:

1. Empty divergence registry
- Make packages/spec-fixtures/states/clean-workspace/DIVERGENCES.md parse as a
  valid divergence document.
- parseDivergences(empty registry) must return ok: true with entries: [].
- validate("divergence", parsed.value) must return ok: true.
- Remove the empty-registry bypass from packages/cli/bin/spec.js.
- Add/adjust tests so the schema package directly tests
  clean-workspace/DIVERGENCES.md.

2. W1 decision reconciliation
- Reconcile docs/design/W1-decisions.md D4/D6 with implementation.
- Preferred path: treat SIGNALS.md and INDEX.md as out-of-schema for Phase 2 and
  remove them from strict spec validate defaults.
- If choosing a different path, update W1 decisions and phase-2 review with the
  explicit rationale before changing code.

3. CLI package installability
- Fix packages/cli/package.json so a published/packed specteam-cli does not
  depend on an unusable local file:../spec-schema path.
- Choose one strategy: publishable @specteam/schema dependency, bundled schema
  payload, or explicit Phase 2 repo-only CLI with metadata/docs updated.
- Add a packed-install smoke or clearly document the deferral if publication is
  out of scope.

4. CI coverage
- Update .github/workflows/validate.yml so package changes run Node validation:
  npm ci
  npm run build
  npm test --workspaces
  node packages/cli/bin/spec.js validate --path=packages/spec-fixtures/states/clean-workspace
- Include package.json and package-lock.json in workflow path triggers.

5. Empty target validation
- spec validate must fail when pointed at an existing directory with no
  recognized .spec files.
- Add a stable error code such as PX-E004 and test it.

Required verification before final response:
- npm run build
- npm test --workspaces
- direct node smoke for parseDivergences + validate on
  packages/spec-fixtures/states/clean-workspace/DIVERGENCES.md
- spec validate against clean-workspace
- spec validate against a non-.spec directory must exit 1
- package/install smoke for specteam-cli if publishability is retained

Final response requirements:
- List changed files.
- Summarize which review findings were closed.
- List exact verification commands and outcomes.
- Call out any remaining deferrals with file references.
```
