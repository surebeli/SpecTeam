# SpecTeam Workflow Test Prompts

Structured test scenarios for validating SpecTeam workflow behavior. Each test file defines:
- **Scenario**: What situation is being tested
- **Prerequisites**: Required state before running
- **Test Prompt**: The exact command to run
- **Expected Interactions**: What the AI should ask and how to reply
- **Verification Checklist**: Specific assertions to check (file existence, content, git state)

## Test Matrix

| # | Test | Skill(s) | Category | Complexity |
|---|------|----------|----------|------------|
| 01 | Init — Founder Mode | init, parse | Setup | ⭐⭐ |
| 02 | Init — Join Mode | init, parse | Setup | ⭐⭐ |
| 03 | Update — New File | update, parse | Sync | ⭐ |
| 04 | Update — Delete File | update, parse | Sync | ⭐ |
| 05 | Review — Conflict | review | Analysis | ⭐⭐⭐ |
| 06 | Align — Propose | align | Resolution | ⭐⭐ |
| 07 | Align — Approve Proposal | align | Resolution | ⭐⭐ |
| 08 | Align — Reject | align | Resolution | ⭐⭐ |
| 09 | Push — Drift Warning | push | Safety | ⭐⭐ |
| 10 | Status — Full Dashboard | status | Reporting | ⭐ |
| 11 | Align — Lead Finalize | align | Resolution | ⭐⭐⭐ |

## Skill Coverage

```
Skills covered by test prompts:
  ✅ spec-init      (01, 02)
  ✅ spec-update    (03, 04)
  ✅ spec-review    (05)
  ✅ spec-align     (06, 07, 08, 11)
  ✅ spec-push      (09)
  ✅ spec-status    (10)
  ✅ spec-parse     (01, 02, 03, 04 — auto-triggered)
  ⬜ spec-pull      (requires remote)
  ⬜ spec-whoami    (covered implicitly by init)
  ⬜ spec-suggest   (depends on review state)
  ⬜ spec-diff      (supplementary)
  ⬜ spec-archive   (supplementary)
  ⬜ spec-import    (requires MCP/external source)
```

## How to Run

### Manual (Recommended for first-time validation)
1. Create a fresh Git repository
2. Copy mock scenario data from `tests/mock-scenarios/`
3. Follow each test file's prerequisites and setup steps
4. Run the test prompt and check each verification item

### Manual Dialogue Chain
For live dialogue validation, use `01 -> 05 -> 06 -> 07 -> 11`.

These files now include a `Golden Dialogue Checkpoints` section so you can compare the actual AI conversation against the expected prompt structure without re-reading the skill files.

You can also validate saved transcript captures directly:

```bash
node tests/validate-divergences.js transcript 01-init-founder path/to/01-init-founder.txt
node tests/validate-divergences.js transcript 05-review-conflict path/to/05-review-conflict.txt
node tests/validate-divergences.js transcript 06-align-propose path/to/06-align-propose.txt
node tests/validate-divergences.js transcript 07-align-approve path/to/07-align-approve.txt
node tests/validate-divergences.js transcript 11-align-finalize path/to/11-align-finalize.txt
```

### Recommended Flow (End-to-End)
Run these tests in order to build up state:
```
01-init-founder  →  03-update-new  →  02-init-join  →
05-review-conflict  →  06-align-propose  →  07-align-approve  →
11-align-finalize  →  10-status-full  →  09-push-drift
```

Then separately:
```
08-align-reject  (needs a second open divergence)
04-update-delete  (can run anytime after init)
```

## Artifact Fixture Validation

To validate canonical `.spec/DIVERGENCES.md` structures without an interactive prompt run:

```bash
node tests/validate-divergences.js tests/fixtures/divergences-proposed.md proposed
node tests/validate-divergences.js tests/fixtures/divergences-resolved.md resolved
```

These checks are also included in `tests/run-e2e.sh`.

## Windows PowerShell Wrapper

If you use the PowerShell wrapper, the execution prerequisite is explicit: it is only intended to run on Windows systems with `pwsh`.

By default it stays safe to run from the repository root and only executes the Node-based fixture checks that do not depend on Bash:

```powershell
pwsh -File tests/run-e2e.ps1 -Test divergence-fixtures
pwsh -File tests/run-e2e.ps1 -Test transcript-fixtures
pwsh -File tests/run-e2e.ps1
```

It also supports Windows-native setup and stateful checks for prepared SpecTeam workspaces:

```powershell
pwsh -File tests/run-e2e.ps1 -Setup
pwsh -File tests/run-e2e.ps1 -Test align-finalize -WorkspacePath .\tests\mock-scenarios\demo-3-three-way\workspace
pwsh -File tests/run-e2e.ps1 -AssertOnly -WorkspacePath path\to\your\spec-workspace
```

`-AssertOnly` is the Windows counterpart of the Bash runner's stateful assertion mode and expects a workspace that already contains `.spec/`.

For repeatable Windows smoke runs without manual `cd` or manual workspace preparation, use the built-in smoke workspace entry:

```powershell
pwsh -File tests/run-e2e.ps1 -AssertOnly -SmokeWorkspace assert-only
pwsh -File tests/run-e2e.ps1 -Test align-finalize -SmokeWorkspace demo-3-three-way
pwsh -File tests/run-e2e.ps1 -Test align-propose -SmokeWorkspace proposed-state
pwsh -File tests/run-e2e.ps1 -Test align-approve -SmokeWorkspace proposed-state
```

`assert-only` rebuilds the Windows demo workspace, hydrates the extra `.spec` metadata needed by the full assertion suite, and then runs the checks against that prepared workspace.

`proposed-state` rebuilds the same Windows demo workspace, removes Lead finalization artifacts, and restores a `proposed` divergence registry so `align-propose` and `align-approve` can be validated without falling into `SKIP`.

On non-Windows systems, use `tests/run-e2e.sh` instead.
