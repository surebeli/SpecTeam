---
name: spec-suggest
short-description: "AI-driven workflow suggestions"
description: "Generate 3 prioritized workflow suggestions based on recent git diffs, THESIS alignment, divergence state (DIVERGENCES.md), and cross-collaborator document analysis. Divergence-aware: prioritizes open/proposed divergences in suggestions."
user-invocable: true
argument-hint: "[specific question or topic]"
triggers: []
callable-by: []
estimated-tokens:
  context: 2500
  skill: 900
  data-read: variable
  output: 600
  total: ~4000+
---

# Skill: suggest (Diff-based, Divergence-aware)

Provide intelligent workflow suggestions grounded in real changes and divergence state.

## Parameters

- `$ARGUMENTS`: Optional specific question or topic to focus suggestions on.

## Execution Steps

1. Read `git config spec.member-code` to determine current identity (`{me}`). Apply identity guard.
2. Determine diff range for recent changes:
   - Read `.spec/last-review.json` → if it contains `head_commit`, use `git diff {head_commit}..HEAD -- .spec/` (changes since last review — most meaningful anchor)
   - Else read `.spec/last-parse.json` → if it contains `head_commit`, use `git diff {head_commit}..HEAD -- .spec/`
   - Else fallback: `git diff HEAD~5..HEAD -- .spec/`
   
   Generate changes grouped by member code.
3. Read the following files:
   - `.spec/THESIS.md` (North Star / design constitution)
   - `.spec/RULES.md` (code conventions)
   - `.spec/INDEX.md` (current document index)
   - `.spec/COLLABORATORS.md` (member map)
   - `.spec/DIVERGENCES.md` (divergence registry, if exists)

### Step 4 — Divergence-aware suggestion generation

Generate **3 workflow suggestions** (priority ordered).

**Priority rules** — divergence state takes precedence over diff-only insights:

1. **Highest priority**: `proposed` divergences awaiting `{me}` → suggest confirming/rejecting
   - E.g., `"🟡 D-002 awaiting your confirmation: bob proposes adopting GraphQL. Recommend running /spec-align D-002 to review and decide."`

2. **High priority**: `resolved` divergences with pending Action Items for `{me}` → suggest updating source docs
   - E.g., `"✅ D-001 resolved: adopt REST API. Your source document ./design/api-proposal.md has not been updated per the decision. Recommend running /spec-update to sync."`

3. **High priority**: `open` blocking divergences → suggest initiating align
   - E.g., `"🔴 D-003 (blocking) alice vs bob unresolved on API style. Based on alice's latest diff (added REST endpoint docs), recommend running /spec-align D-003 to propose a resolution."`

4. **Normal priority**: Diff-based insights (THESIS conflicts, redundant proposals, missing coverage, merge opportunities)
   - E.g., `"Based on bob's diff (refactored deployment plan): diverges from THESIS 'single-machine deployment' goal. Recommend confirming whether THESIS needs updating."`

**Each suggestion must**:
- Cite a specific collaborator's diff OR a specific divergence ID as evidence
- Format: `"Based on {code}'s diff ({specific change}) / Based on D-{N} ({status}), recommend..."`
- Include a concrete next action (which skill to run, with parameters)

5. If `$ARGUMENTS` provides a specific question, focus all 3 suggestions on that topic but still incorporate divergence awareness.
6. If no DIVERGENCES.md exists, fall back to pure diff-based suggestions (original behavior).
