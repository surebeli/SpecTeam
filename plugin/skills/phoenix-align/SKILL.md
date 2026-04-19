---
name: phoenix-align
short-description: "Resolve divergences via Propose → Approve"
description: "Resolve divergence between collaborators via two-phase Propose → Approve workflow. Reads open/proposed divergences from DIVERGENCES.md. Proposer picks a resolution (status becomes proposed); the other party approves or rejects (status becomes resolved or reverts to open). THESIS.md is only updated after both parties agree."
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

Facilitate convergence on specific divergences. Two-phase: **Propose → Approve**.

- Proposer chooses a resolution → divergence becomes `proposed`
- Other party confirms or rejects → divergence becomes `resolved` or reverts to `open`
- THESIS.md Decision Log is **only updated after approval**, not at proposal time.

## Parameters

- `$ARGUMENTS`: **Required.** One of:
  - `D-{N}` — resolve a specific divergence by ID (e.g. `D-002`)
  - `{topic keyword}` — fuzzy match against divergence titles in DIVERGENCES.md
  - `all` — iterate through all actionable divergences (open + proposed awaiting current user)

## Execution Steps

### Step 1 — Load context

1. Read `git config phoenix.member-code` to determine current identity (`{me}`). Apply identity guard.
2. Run `git status` and display the result.
3. Read `.phoenix/COLLABORATORS.md`.
4. Read `.phoenix/THESIS.md` (current North Star).

### Step 2 — Load divergence list from DIVERGENCES.md

1. Read `.phoenix/DIVERGENCES.md`.
   - If the file does not exist or has no actionable items:
     Output: `✅ No actionable divergences. Run /phoenix-review first to re-analyze.`
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

Read the relevant collaborator documents under `.phoenix/design/` for current content.

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

1. **Update `.phoenix/DIVERGENCES.md`** — change status from `open` to `proposed`:
   ```markdown
   ### D-{N}: {title}

   **Status**: `proposed` 🟡
   **Parties**: {code-1}, {code-2}
   **Nature**: {classification}
   **Priority**: {priority}
   **Found at**: review @ `{original_commit}` ({date})
   **Proposer**: {me}
   **Proposed at**: align @ `{current_commit}` ({date})
   **Proposed decision**: {chosen resolution summary}
   **Reasoning**: {reasoning}

   _Awaiting confirmation from {other_party}_
   ```
2. **Do NOT update THESIS.md** — it is only updated after approval.
3. Commit: `"[PhoenixTeam] align — D-{N}: {title} proposed by {me}, awaiting {other} confirmation"`

Output: `"✅ Proposal submitted. {other_party} can run /phoenix-align D-{N} after their next pull to confirm or reject."`

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

**Sub-step A — Generate Action Items** (before writing to files):

Read each involved party's current documents under `.phoenix/design/`. For each party:
- Determine whether their source document needs to change to reflect the decision.
- If already aligned → mark as "No changes needed" and skip the instruction block.
- If changes needed → produce a detailed per-party instruction block (see format below). Be specific: what to add, remove, or rewrite, and in which file. Include a concrete acceptance criterion so `update` can verify automatically.

Output to the user:

```
## Source Document Action Items — D-{N}: {title}

| Collaborator | Source file | Status |
|--------------|-------------|--------|
| {code-1} | `./design/api.md` | ⏳ Pending update |
| {code-2} | `./design/api-proposal.md` | ⏳ Pending update |

---

##### [{code-1}] Change Instructions

**Background**: {what the disagreement was — one sentence}
**Decision**: {clear, unambiguous statement of what was decided}
**Rationale**: {reasoning — why this choice over the alternative}

**File**: `./design/api.md`
**Required changes**:
- {concrete item 1, e.g. "keep existing REST endpoint design"}
- {concrete item 2, e.g. "remove GraphQL alternative from section 3"}
- {concrete item 3 if needed}

**Acceptance criterion**: {one-sentence check, e.g. "document contains no mention of GraphQL, resolver, or schema"}

---

##### [{code-2}] Change Instructions

**Background**: {same as above}
**Decision**: {same as above}
**Rationale**: {same as above}

**File**: `./design/api-proposal.md`
**Required changes**:
- {concrete item 1}
- {concrete item 2}

**Acceptance criterion**: {one-sentence check}

---

After completing your changes, run /phoenix-update to sync and auto-verify.
```

**Sub-step B — Write to files:**

1. **Create `.phoenix/decisions/D-{N}.md`** — write the full decision + per-party instruction blocks here:
   ```markdown
   # D-{N}: {title} — Change Instructions

   **Decision**: {resolution summary}
   **Proposer**: {proposer} | **Confirmer**: {me} | **Resolved at**: {date}

   ---

   ## [{code-1}] Change Instructions

   **Background**: {background}
   **Decision**: {decision}
   **Rationale**: {reasoning}

   **File**: `{source path}`
   **Required changes**:
   - {item 1}
   - {item 2}

   **Acceptance criterion**: {acceptance criterion}

   ---

   ## [{code-2}] Change Instructions

   **Background**: {background}
   **Decision**: {decision}
   **Rationale**: {reasoning}

   **File**: `{source path}`
   **Required changes**:
   - {item 1}

   **Acceptance criterion**: {acceptance criterion}
   ```
   If a party needs no changes → omit their block entirely (their status in the table below will be ✅ No changes needed).

2. **Update DIVERGENCES.md** — move from Open to Resolved. Keep this entry lean (summary + status table + reference to decisions file):
   ```markdown
   ### D-{N}: {title} ✅

   **Status**: `resolved`
   **Parties**: {code-1}, {code-2}
   **Proposer**: {proposer} | **Confirmer**: {me}
   **Resolved at**: align @ `{current_commit}` ({date})
   **Decision**: {resolution summary}
   **Rationale**: {reasoning}
   **Change Instructions**: see `.phoenix/decisions/D-{N}.md`

   #### Source Document Action Items

   | Collaborator | Source file | Status |
   |--------------|-------------|--------|
   | {code-1} | `{source path}` | ⏳ Pending update |
   | {code-2} | `{source path}` | ✅ No changes needed |
   ```
2. **Now update `.phoenix/THESIS.md`** Decision Log:
   ```markdown
   ## Decision Log
   - [{date}] **D-{N}: {title}**: {resolution summary}.
     - Proposed by: {proposer} | Confirmed by: {me}
     - Rationale: {reasoning}
   ```
3. Archive superseded proposals if applicable (move to `.phoenix/archive/{YYYYMMDD}/`).
4. Update `.phoenix/SIGNALS.md` — remove blocker, add resolved entry.
5. Commit: `"[PhoenixTeam] align — D-{N}: {title} decision reached ({proposer} proposed, {me} confirmed)"`

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
2. Commit: `"[PhoenixTeam] align — D-{N}: {title} proposal rejected by {me}"`

**Option 3 — Modify and counter-propose:**
1. Update DIVERGENCES.md — keep as `proposed` but change proposer to `{me}`:
   ```markdown
   **Proposer**: {me}
   **Proposed at**: align @ `{current_commit}` ({date})
   **Proposed decision**: {modified resolution}
   **Reasoning**: {new reasoning}

   _Awaiting confirmation from {original_proposer}_

   **Proposal history**:
   - [{date}] {original_proposer} proposed: {original resolution} — 🔄 Modified by {me}
   ```
2. Commit: `"[PhoenixTeam] align — D-{N}: {title} modified proposal by {me}, awaiting {original_proposer}"`

### Step 3C — Proposed by `{me}`, awaiting other party

Output:
```
⏳ D-{N}: {title} — Your proposal is awaiting confirmation from {other_party}.
   Proposed decision: {summary}
   Proposed at: {date}

   Options:
   1. Withdraw proposal (revert to open)
   2. Skip
```

If user chooses to withdraw:
1. Revert status to `open` in DIVERGENCES.md, append withdrawal note.
2. Commit: `"[PhoenixTeam] align — D-{N}: {title} proposal withdrawn by {me}"`

### Step 4 — Continue or summarize

- If `$ARGUMENTS` is `all` and more actionable items remain → go back to Step 3 for the next one.
- Output summary:

```
## Alignment Summary

Processed this session:
- 🟡 D-{N}: {title} — proposed, awaiting {other} confirmation
- ✅ D-{N}: {title} — confirmed and resolved
- ❌ D-{N}: {title} — rejected, reverted to open
- ⏭ D-{N}: {title} — skipped

Remaining:
- open: {count}
- proposed (awaiting others): {count}
```

- If proposed items exist → recommend push to notify the other party
- If all resolved → recommend push
- If open items remain → recommend next align
