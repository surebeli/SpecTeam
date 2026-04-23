---
name: spec-align
short-description: "Resolve divergences via Propose → Review → Finalize"
description: "Resolve divergence between collaborators via a consensus workflow. Reads open/proposed divergences from DIVERGENCES.md. A proposer submits a resolution, other parties approve or reject, and the proposer finalizes after consensus. THESIS.md is only updated at finalization time."
user-invocable: true
argument-hint: "<D-001 | topic keyword | 'all'>"
triggers: []
callable-by: []
estimated-tokens:
  context: 2500
  skill: 3000
  data-read: variable
  output: 2000
  total: ~7500+
---

# Skill: align

Facilitate convergence on specific divergences. Consensus flow: **Propose → Review → Lead Finalize**.

- Proposer chooses a resolution → divergence becomes `proposed`
- Other parties review, approve, reject, or counter-propose
- Proposer finalizes after consensus → divergence becomes `resolved`
- THESIS.md Decision Log is **only updated at finalization time**, not at proposal or approval time.

## Parameters

- `$ARGUMENTS`: **Required.** Can optionally start with `--dry-run`, followed by one of:
  - `D-{N}` — resolve a specific divergence by ID (e.g. `D-002`)
  - `{topic keyword}` — fuzzy match against divergence titles in DIVERGENCES.md
  - `all` — iterate through all actionable divergences (open + proposed awaiting current user)

## Execution Steps

### Step 1 — Load context

1. Read `git config spec.member-code` to determine current identity (`{me}`). Apply identity guard.
2. Run `git status` and display the result.
3. Read `.spec/COLLABORATORS.md`.
4. Read `.spec/THESIS.md` (current North Star).

### Step 2 — Load divergence list from DIVERGENCES.md

1. Read `.spec/DIVERGENCES.md`.
   - If the file does not exist or has no actionable items:
     Output: `✅ No actionable divergences. Run /spec-review first to re-analyze.`
     Stop.
2. Parse all divergences. Classify each by what `{me}` can do:
   - **`open`** → `{me}` can propose a resolution (Mode A)
   - **`proposed` by someone else, awaiting `{me}`** → `{me}` can approve/reject (Mode B)
   - **`proposed` by `{me}`, awaiting other party** → inform and skip (or allow withdrawal)
   - **`resolved`** → skip
3. Match `$ARGUMENTS` against actionable items:
   - If `all` → queue all actionable items: Mode B items first (pending approvals), then Mode A items (open).
   - If `D-{N}` → select that specific divergence.
   - If keyword → fuzzy-match titles; if ambiguous, list and ask. **Stop and wait.**
   - If no match → show actionable list and ask user to specify. **Stop and wait.**

### Step 3A — Mode A: Propose resolution (divergence is `open`)

Read the relevant collaborator documents under `.spec/design/` for current content.

Output:

---

**[Propose Resolution — {D-N}: {title}]**

**Divergence summary** (from DIVERGENCES.md):
- Parties: {code-1} vs {code-2}
- Nature: {technology choice / architecture direction / priority}
- Found at: {date}

**Current positions comparison:**

| | {code-1} | {code-2} |
|--|----------|----------|
| Position | {summary from design/{code-1}/...} | {summary from design/{code-2}/...} |
| Advantage | {advantage} | {advantage} |
| Risk | {risk} | {risk} |
| THESIS alignment | {assessment} | {assessment} |

**AI recommended resolution:**

> {Merged or best-choice resolution with reasoning based on THESIS}

Please choose your proposal:
1. Adopt {code-1}'s position
2. Adopt {code-2}'s position
3. Adopt AI-recommended merged resolution
4. Custom decision (please describe)
5. Skip — handle this divergence later

---

**Stop and wait for the user to reply.**

After user chooses (skip option 5 to next):

1. **Update `.spec/DIVERGENCES.md`** — change status from `open` to `proposed`:
   ```markdown
   ### D-{N}: {title}

   **Status**: `proposed` 🟡
   **Parties**: {code-1}, {code-2}, {others}
   **Nature**: {classification}
   **Priority**: {priority}
   **Found at**: review @ `{original_commit}` ({date})
   **Proposer (Lead)**: {me}
   **Proposed at**: align @ `{current_commit}` ({date})
   **Proposed decision**: {chosen resolution summary}
   **Reasoning**: {reasoning}

   **Votes**:
   - {me}: `propose`

   _Awaiting reviews from others. The Proposer will finalize when consensus is reached._
   ```
2. **Do NOT update THESIS.md** — it is only updated at finalization time.
3. Commit: `"[SpecTeam] align — D-{N}: {title} proposed by {me}, awaiting {other} confirmation"`

*(Note: If `--dry-run` was passed, skip updating files and committing. Just output the proposed file changes.)*

Output: `"✅ Proposal submitted. {other_party} can run /spec-align D-{N} after their next pull to confirm or reject."`

### Step 3B — Mode B: Review and approve/reject (divergence is `proposed`, awaiting `{me}`)

Read the relevant collaborator documents and the proposal details from DIVERGENCES.md.

Output:

---

**[Confirm Resolution — {D-N}: {title}]**

**Original divergence:**
- Parties: {code-1} vs {code-2}
- Nature: {classification}

**{proposer}'s proposal:**
> Decision: {proposed resolution}
> Reasoning: {reasoning}
> Proposed at: {date}

**Original positions comparison:**

| | {code-1} | {code-2} |
|--|----------|----------|
| Position | {summary} | {summary} |
| THESIS alignment | {assessment} | {assessment} |

Please choose:
1. ✅ Agree with this proposal
2. ❌ Reject — revert to open (please provide rejection reason)
3. 🔄 Modify and counter-propose (your modified version becomes the new proposal)
4. ⏭ Skip for now

---

**Stop and wait for the user to reply.**

Based on user's choice:

**Option 1 — Approve:**

1. Add `{me}`'s `Approve` vote to the "Votes" section for this proposal in `DIVERGENCES.md`.
2. The status remains `proposed`.
3. Commit: `"[SpecTeam] align — D-{N}: {title} approved by {me}, awaiting Lead's final confirmation"`
4. Output: `"✅ Approval recorded. The original proposer (Lead) will finalize the resolution once consensus is reached."`
5. **Stop here** (do not generate action items).

**Option 2 — Reject:**
1. Update DIVERGENCES.md — revert to `open`, append rejection note:
   ```markdown
   ### D-{N}: {title}

   **Status**: `open` 🔴
   **Parties**: {code-1}, {code-2}
   ...original fields...

   **Proposal history**:
   - [{date}] {proposer} proposed: {resolution} — ❌ Rejected by {me}, reason: {rejection reason}
   ```
2. Commit: `"[SpecTeam] align — D-{N}: {title} proposal rejected by {me}"`

**Option 3 — Modify and counter-propose:**
1. Update DIVERGENCES.md — keep as `proposed` but change proposer to `{me}`:
   ```markdown
   **Proposer**: {me}
   **Proposed at**: align @ `{current_commit}` ({date})
   **Proposed decision**: {modified resolution}
   **Reasoning**: {new reasoning}

   _Awaiting review from {original_proposer}. The proposer who owns the active proposal will finalize after consensus is reached._

   **Proposal history**:
   - [{date}] {original_proposer} proposed: {original resolution} — 🔄 Modified by {me}
   ```
2. Commit: `"[SpecTeam] align — D-{N}: {title} modified proposal by {me}, awaiting {original_proposer}"`

### Step 3C — Proposed by `{me}` (Lead), managing consensus

Read the current `Votes` from DIVERGENCES.md.

Output:
```
⏳ D-{N}: {title} — You are the Proposer (Lead).
   Proposed decision: {summary}
   Proposed at: {date}
   
   Current Votes:
   {list of votes}

   Options:
   1. ✅ Finalize and Resolve (Consensus reached)
   2. ❌ Withdraw proposal (revert to open)
   3. ⏭ Skip for now
```

If user chooses to Finalize and Resolve (Option 1):

**Sub-step A — Generate Action Items** (before writing to files):

Read each involved party's current documents under `.spec/design/`. For each party:
- Determine whether their source document needs to change to reflect the decision.
- If already aligned → mark as "No changes needed" and skip the instruction block.
- If changes needed → produce a detailed per-party instruction block. Be specific: what to add, remove, or rewrite, and in which file. Include a concrete acceptance criterion so `update` can verify automatically.

Output to the user:

```
## Source Document Action Items — D-{N}: {title}

| Collaborator | Source file | Status |
|--------------|-------------|--------|
| {code-1} | `./design/api.md` | ⏳ Pending update |
| {code-2} | `./design/api-proposal.md` | ⏳ Pending update |

---

##### [{code-1}] Change Instructions

**Background**: {what the disagreement was}
**Decision**: {clear, unambiguous statement of what was decided}
**Rationale**: {reasoning}

**File**: `./design/api.md`
**Required changes**:
- {concrete item}

**Acceptance criterion**: {one-sentence check}

---

After completing your changes, run /spec-update to sync and auto-verify.
```

**Sub-step B — Write to files:**

1. **Create `.spec/decisions/D-{N}.md`** — write the full decision + per-party instruction blocks here:
   ```markdown
   # D-{N}: {title} — Change Instructions

   **Decision**: {resolution summary}
   **Proposer (Lead)**: {me} | **Resolved at**: {date}

   ---

   ## [{code-1}] Change Instructions
   ...
   ```
   If a party needs no changes → omit their block entirely.

2. **Update DIVERGENCES.md** — move from Open to Resolved. Keep this entry lean:
   ```markdown
   ### D-{N}: {title} ✅

   **Status**: `resolved`
   **Parties**: {code-1}, {code-2}, {others}
   **Resolved at**: align @ `{current_commit}` ({date})
   **Decision**: {resolution summary}
   **Rationale**: {reasoning}
   **Final Votes**: {summary of votes}
   **Change Instructions**: see `.spec/decisions/D-{N}.md`

   #### Source Document Action Items

   | Collaborator | Source file | Status |
   |--------------|-------------|--------|
   | {code-1} | `{source path}` | ⏳ Pending update |
   | {code-2} | `{source path}` | ✅ No changes needed |
   ```
3. **Now update `.spec/THESIS.md`** Decision Log:
   ```markdown
   ## Decision Log
   - [{date}] **D-{N}: {title}**: {resolution summary}.
     - Proposed and finalized by: {me}
     - Rationale: {reasoning}
   ```
4. Archive superseded proposals if applicable.
5. Update `.spec/SIGNALS.md` — remove blocker, add resolved entry.
6. Commit: `"[SpecTeam] align — D-{N}: {title} finalized and resolved by Lead ({me})"`

If user chooses to withdraw (Option 2):
1. Revert status to `open` in DIVERGENCES.md, clear votes, append withdrawal note.
2. Commit: `"[SpecTeam] align — D-{N}: {title} proposal withdrawn by {me}"`

### Step 4 — Continue or summarize

- If `$ARGUMENTS` is `all` and more actionable items remain → go back to Step 3 for the next one.
- Output summary:

```
## Alignment Summary

Processed this session:
- 🟡 D-{N}: {title} — proposed, awaiting {other} confirmation
- ✅ D-{N}: {title} — finalized and resolved
- ❌ D-{N}: {title} — rejected, reverted to open
- ⏭ D-{N}: {title} — skipped

Remaining:
- open: {count}
- proposed (awaiting others): {count}
```

- If proposed items exist → recommend push to notify the other party
- If all resolved → recommend push
- If open items remain → recommend next align
