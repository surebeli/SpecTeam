# Phase 2 Review

Review date: 2026-05-01

Scope:

- `docs/design/phase-2-tasks.md`
- `docs/design/W1-decisions.md`
- Phase 2 commits on `phase-2-foundation`:
  - `7a3a746` FN-2 schema and validator
  - `a70eedb` FN-3 parsers and migration
  - `8b2435f` FN-4 CLI validate command
  - `c96178e` workspace test-script follow-up

## Review Conclusion

Phase 2 is runnable but not ready to merge or publish as-is.

The implementation passed local build and workspace tests, but the plan and
implementation diverged from design decisions and protocol invariants. The most
important issue is that the CLI can report success for a valid clean workspace
while the schema package itself cannot parse and validate that same empty
`DIVERGENCES.md` state.

## Verification Performed

Commands rerun during review:

- `npm run build` passed.
- `npm test --workspaces` passed after running outside the sandbox.
- `node packages\cli\bin\spec.js validate --path=packages\spec-fixtures\states\clean-workspace --json` passed.
- `npm pack --dry-run --workspace specteam-cli --json` completed, but showed
  that `@specteam/schema` is not bundled in the CLI package.

Additional read-only checks:

- Direct `parseDivergences(clean-workspace/DIVERGENCES.md)` returned `PX-P001`.
- `spec validate --path=packages/spec-schema` returned `Summary: 0 passed, 0 failed`
  with exit code 0 even though the directory is not a `.spec` workspace.
- `.github/workflows/validate.yml` contains path triggers for packages but no
  Node build/test job.

## Blocking Findings

### P0: Empty `DIVERGENCES.md` is valid protocol state but invalid schema-package state

Evidence:

- `packages/spec-fixtures/states/clean-workspace/DIVERGENCES.md` contains the
  canonical empty registry sections.
- `packages/spec-schema/src/parsers/divergences.parser.ts` returns `PX-P001`
  when no `### D-NNN:` entries are present.
- `packages/spec-schema/src/schemas/divergence.schema.json` requires
  `entries.minItems = 1`.
- `packages/cli/bin/spec.js` bypasses schema validation for empty divergence
  registries via `isEmptyDivergenceRegistry()`.

Why it matters:

The Phase 2 goal says fixtures validate against the schema package. Instead,
the CLI hides a schema/parser failure with a consumer-side special case.

Required fix:

- Make empty divergence registries parse to a valid typed value with
  `entries: []`.
- Allow `entries` to be empty in `divergence.schema.json`.
- Remove the CLI-side empty-registry bypass.
- Add parser+validator tests for `clean-workspace/DIVERGENCES.md`.

Acceptance:

- Direct parser smoke must pass:
  `parseDivergences(clean-workspace/DIVERGENCES.md)` returns `ok: true`.
- Direct validator smoke must pass:
  `validate("divergence", parsed.value)` returns `ok: true`.
- `spec validate --path=packages/spec-fixtures/states/clean-workspace` still exits 0.

### P0: Task plan conflicts with W1 decisions for `SIGNALS.md` and `INDEX.md`

Evidence:

- `docs/design/W1-decisions.md` D4 resolves `SIGNALS.md` as free-form and out
  of schema.
- `docs/design/W1-decisions.md` D6 resolves `INDEX.md` as a derived artifact and
  out of schema.
- `docs/design/phase-2-tasks.md` still asks for `signal.schema.json`,
  `index-doc.schema.json`, `signals.parser.ts`, and `index.parser.ts`.
- `packages/cli/bin/spec.js` validates `SIGNALS.md` and `INDEX.md` by default.

Why it matters:

The implementation followed an outdated task surface instead of the resolved
phase decisions. This makes the protocol boundary unclear for later phases.

Required fix:

Choose exactly one path:

- Preferred: update Phase 2 implementation to honor W1 decisions by removing
  Signal/Index from strict schema validation and CLI default validation.
- Alternative: explicitly reopen and revise W1 decisions D4/D6, then update
  the task plan and review record to explain why these entities are now in
  schema scope.

Acceptance:

- `phase-2-tasks.md`, `W1-decisions.md`, schemas, parsers, CLI targets, and
  tests all agree on whether Signal/Index are in schema scope.
- No entity marked out-of-schema is validated by default in `spec validate`.

### P0: Published `specteam-cli` would depend on a local schema path

Evidence:

- `packages/cli/package.json` declares
  `"@specteam/schema": "file:../spec-schema"`.
- `npm pack --dry-run --workspace specteam-cli --json` shows no bundled
  `@specteam/schema` payload.

Why it matters:

The public CLI package cannot safely depend on a sibling monorepo path after
publication. A dry-run pack is not enough to prove installability.

Required fix:

Choose one publish strategy:

- publish `@specteam/schema` and depend on a normal semver range;
- bundle/internalize the schema package into the CLI package during prepack;
- declare that Phase 2 CLI is repo-only and not publishable, with release notes
  and package metadata adjusted accordingly.

Acceptance:

- Create a package tarball.
- Install it into a temporary directory.
- Run `spec validate` against copied fixtures from that installed package or an
  external fixture path.

### P1: CI green does not verify Phase 2 code

Evidence:

- `.github/workflows/validate.yml` includes package path triggers.
- The workflow has no `setup-node`, `npm ci`, `npm run build`, or
  `npm test --workspaces` step.

Why it matters:

The merge gate says CI green is required, but the current CI cannot fail on
schema, parser, CLI, or package build regressions.

Required fix:

Add a Node CI job that runs:

```bash
npm ci
npm run build
npm test --workspaces
node packages/cli/bin/spec.js validate --path=packages/spec-fixtures/states/clean-workspace
```

Also include root `package.json` and `package-lock.json` in workflow path
triggers.

### P1: `spec validate` reports success for directories with no recognized files

Evidence:

`node packages\cli\bin\spec.js validate --path=packages\spec-schema` returns:

```text
Summary: 0 passed, 0 failed
```

with exit code 0.

Required fix:

- If the target directory exists but contains no recognized `.spec` files,
  return failure.
- Add a stable error code, for example `PX-E004`.
- Add a CLI test for this case.

## Root Cause

The main root cause is planning drift:

- `phase-2-tasks.md` remained the operational source of truth even after
  `W1-decisions.md` resolved narrower boundaries.
- The execution plan did not include a pre-execution review gate that reconciled
  tasks and decisions.
- The validation list favored command success over protocol invariants.
- The publish and CI gates were underspecified.

## Required Documentation Fixes

- Update `phase-2-tasks.md` so it no longer conflicts with `W1-decisions.md`.
- Add or reference `docs/design/task-planning-review-gate.md` as the process
  requirement for future phases.
- Keep this file as the Phase 2 implementation review record.
- After remediation, append a "Remediation Review" section here with the final
  commands run and issue closure status.

## Remediation Exit Criteria

Phase 2 can be reconsidered for merge only when:

- P0 findings are fixed or explicitly re-decided in design docs;
- P1 findings have fixes or accepted follow-up tickets;
- `npm run build` passes;
- `npm test --workspaces` passes;
- direct schema parser/validator smoke for clean empty divergence passes;
- CLI packed/installable smoke passes or CLI publishability is explicitly
  deferred;
- CI contains concrete Node build/test coverage.

## Remediation Review

Remediation date: 2026-05-01

### Commands run

- `npm run build` — passed.
- `npm test --workspaces` — passed.
- `node -e "const fs = require('fs'); const schema = require('./packages/spec-schema/dist'); const text = fs.readFileSync('./packages/spec-fixtures/states/clean-workspace/DIVERGENCES.md', 'utf8'); const parsed = schema.parseDivergences(text); const validated = parsed.ok ? schema.validate('divergence', parsed.value) : parsed; ..."` — passed; `parseDivergences(clean-workspace)` returned `ok: true` with `entries: []`, and `validate('divergence', parsed.value)` returned `ok: true`.
- `node packages/cli/bin/spec.js validate --path=packages/spec-fixtures/states/clean-workspace` — passed with `Summary: 3 passed, 0 failed`.
- `node packages/cli/bin/spec.js validate --path=packages/spec-schema` — failed as expected with `PX-E009`.
- `npm run test:pack-install -w specteam-cli` — passed.

### Issue closure status

- **P0 empty divergence registry** — closed. Empty `DIVERGENCES.md` now parses to a valid divergence document with `entries: []`, validates directly in `@specteam/schema`, and no longer relies on a CLI-side bypass.
- **P0 W1 decision conflict for Signal/Index** — closed. Phase 2 now honors D4/D6: `SIGNALS.md` and `INDEX.md` are out of strict schema scope, excluded from default `spec validate`, and removed from the public `@specteam/schema` validation surface.
- **P0 CLI package installability** — closed. `specteam-cli` no longer depends on `file:../spec-schema`; prepack stages a bundled schema runtime and the packed-install smoke passes.
- **P1 CI green gap** — closed. `.github/workflows/validate.yml` now includes a concrete Node validation job with `npm ci`, `npm run build`, `npm test --workspaces`, and clean-workspace CLI validation, plus root manifest path triggers.
- **P1 empty target validation** — closed. Existing directories with no recognized `.spec` files now fail with `PX-E009`. `PX-E004` remained untouched because it was already assigned in `plugin/ERRORS.md`.

### Remediation result

All blocking findings from this review are closed in the branch implementation. No remediation deferrals remain inside the Phase 2 scope described in this review.
