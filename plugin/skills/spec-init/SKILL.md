---
name: spec-init
short-description: "Initialize or join the SpecTeam workflow"
description: "Initialize SpecTeam: set up collaborator identity, normalize source design docs into .spec/, create core files, and establish Git diff baseline. Use this when starting the SpecTeam workflow for the first time or onboarding a new collaborator."
user-invocable: true
argument-hint: "[--branch=spec-docs | --submodule]"
triggers: [spec-parse]
callable-by: []
estimated-tokens:
  context: 2500
  skill: 2000
  data-read: variable
  output: 800
  total: ~5300+
---

# Skill: init

Initialize the SpecTeam workflow state for the current collaborator.

## Parameters

- `$ARGUMENTS`: Optional repo mode flag (`--branch=spec-docs` or `--submodule`). Default: Mode A (dedicated branch `spec-docs`).

## Execution Steps (follow strictly in order)

### Step 0 — Detect first-init vs join

Check whether `.spec/` directory already exists:
- If **NOT exists** → this is a **first init** (founder mode). Continue to Step 1.
- If **exists** → this is a **join** (collaborator mode). Mark `{is_founder} = false`.

### Step 1 — Record main branch

Run `git branch --show-current` and capture the output as `{main_branch}`.
Run `git config --local spec.main-branch {main_branch}` to persist it locally.

This branch becomes the **protected SpecTeam branch** — all other skills will refuse to execute on any other branch.

- **Founder mode**: Write `{main_branch}` into COLLABORATORS.md header (see Step 7).
- **Join mode**: Read the `Main Branch` field from existing COLLABORATORS.md and run `git config --local spec.main-branch {main_branch}` to sync to local machine.

### Step 3 — Ask for member code

Run `git config user.name` and capture the output as `{git_name}`.

Output the following block **verbatim** (substituting `{git_name}`), then **stop and wait** for the user to reply:

---

**[SpecTeam init — Step 1]**

Please provide your member code (nickname / collaborator ID, e.g. alice, bob, dev-007).
This code identifies your documents across the shared workflow.
(Press Enter to use your Git username automatically: `{git_name}`)

---

After the user replies:
- If the reply is **empty or whitespace**, use `{git_name}` (from `git config user.name`) as the member code.
- If `git config user.name` is also empty, fall back to the output of `git config user.email`, stripping the `@...` domain part.
- Sanitize the final code: lowercase, replace spaces with `-`, keep only `[a-z0-9_-]`.
- **Persist identity locally**: Run `git config --local spec.member-code {code}` to save the member code into `.git/config`. This is machine-local and not committed to the repo, so each collaborator's clone has their own identity.

### Step 4 — Ask for project goal (founder mode only)

**Only if `{is_founder} = true`（`.spec/` does not exist)**, output the following block **verbatim**, then **stop and wait**:

---

**[SpecTeam init — Step 2: Set project goal]**

You are the first to initialize SpecTeam on this project. Please briefly describe the shared project goal / mission (1–3 sentences).
This will be written to THESIS.md as the North Star — all future collaborators will align to it.

Example:
- "Refactor the NECallKit call flow to unify iOS/Android signaling sequence"
- "Design the SpecTeam MVP product plan, targeting launch within 3 months"

---

Save the user's reply as `{project_goal}`.

**If `{is_founder} = false` (join mode)**, skip this step. The existing THESIS.md already contains the project goal.

### Step 5 — Ask for source directories

Output the following block **verbatim**, then **stop and wait**:

---

**[SpecTeam init — Step 3: Specify document directories]**

Please provide the local design document directories (comma-separated for multiple).
Example: `./design`, `./docs/alice-proposal`, `./superpowers-output`
These can be plan-generated, superpowers plugin output, or spec-driven-dev rule output.

---

### Step 6 — Show existing THESIS and divergence state (join mode only)

**Only if `{is_founder} = false`**, read `.spec/THESIS.md` and `.spec/DIVERGENCES.md` (if exists), then display:

---

**[Project Goal Review]**

Current project North Star (set by {founder_code}):

> {THESIS.md North Star content}

**[Current Divergence State]**

{If DIVERGENCES.md exists:}
- 🔴 Unresolved: {count} | 🟡 Awaiting confirmation: {count} | ✅ Resolved: {count}
{List open/proposed items if any}

{If DIVERGENCES.md does not exist:}
_(No divergence records yet)_

Please confirm you have reviewed the project goal and current workflow state. Your documents will be aligned to this baseline.

---

(This is informational — no need to wait for confirmation, proceed immediately.)

### Step 7 — Execute initialization

1. Run `git status` and display the result.
2. Create `.spec/` directory if it doesn't exist.
3. Create/update `.spec/COLLABORATORS.md` with:
   - **Founder mode**: write the `Main Branch` metadata header
   - Current user's member code appended to the shared registry
   - Source directory → `.spec/design/{code}/` mapping
   - Format:
     ```markdown
     # SpecTeam Collaborators

     **Main Branch**: {main_branch}

     ## Members
     | Code | Source Directories | Spec Path | Joined |
     |------|-------------------|--------------|--------|
     | {code} | {dirs} | .spec/design/{code}/ | {date} |
     ```
   - **Join mode**: read `Main Branch` from existing COLLABORATORS.md → run `git config --local spec.main-branch {main_branch}` to sync the protected branch to the local machine.
4. For each source directory, copy all `.md` files into `.spec/design/{code}/` (preserve relative paths, max 2 levels):
   - Keep original filenames
   - Prepend `<!-- Spec Normalized Document -->` header to each file
   - Extract title and key decision points from design proposals
5. Create/update core files:
   - `.spec/THESIS.md`:
     - **Founder mode**: Write `{project_goal}` as the North Star section
     - **Join mode**: Keep existing content, do not overwrite
   - `.spec/RULES.md` — Code conventions (create if not exists)
   - `.spec/SIGNALS.md` — Runtime status (create if not exists)
6. Run `git add .spec/` and commit:
   - Founder: `"[SpecTeam] init — {code} created project and normalized design documents"`
   - Join: `"[SpecTeam] init — {code} joined workflow and normalized design documents"`
7. **Automatically trigger `/spec-parse`** (execute the parse skill inline).
8. Output:
   - Founder: `"Initialization complete! You are the project founder. Project goal written to THESIS.md, documents normalized to .spec/design/{code}/, Git diff baseline established."`
   - Join: `"Initialization complete! You have joined the workflow. Identity recorded as {code}, documents normalized to .spec/design/{code}/. See THESIS.md for the project goal."`
9. Output branch protection notice:

```
⚠️ [Branch Protection]

SpecTeam data (DIVERGENCES.md, decisions/, last-*.json, etc.) is branch-specific.
Follow these rules to prevent divergence state corruption:

  ✅ Recommended: Run all SpecTeam skills only on the main branch (or spec-docs dedicated branch)
  ✅ Safe: Make code-only changes on feature branches without running any spec-* commands
  ❌ Dangerous: Running any skill on a feature branch (commits .spec/); switching back to main will cause state inconsistency

Main branch locked to: {main_branch}
Operations on any other branch will be rejected by the branch guard.
```
