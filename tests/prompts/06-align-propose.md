# Test 06: Align — Propose Resolution

## Scenario
A collaborator proposes a resolution for an open divergence. The status should change to `proposed` but THESIS.md should NOT be updated yet.

## Prerequisites
- SpecTeam workflow with two members: `alice` and `bob`
- DIVERGENCES.md has at least one `open` divergence (D-001)
- Current identity: `alice` (she is the proposer)

## Test Prompt
```
/spec-align D-001
```

## Expected Interactions
1. AI shows comparison table (position / advantage / risk / THESIS alignment)
2. AI shows AI-recommended resolution
3. AI asks user to choose (1-5 options) → reply: `3` (adopt AI recommendation)

## Golden Dialogue Checkpoints

### Checkpoint 1 — Proposal header
```text
**[Propose Resolution — D-001: {title}]**
```

### Checkpoint 2 — Comparison table
- Table includes both parties
- Rows include `Position`, `Advantage`, `Risk`, and `THESIS alignment`

### Checkpoint 3 — AI recommendation
```text
**AI recommended resolution:**

> {Merged or best-choice resolution with reasoning based on THESIS}
```

### Checkpoint 4 — Choice menu
```text
Please choose your proposal:
1. Adopt {party-1}'s position
2. Adopt {party-2}'s position
3. Adopt AI-recommended merged resolution
4. Custom decision (please describe)
5. Skip — handle this divergence later
```

### Checkpoint 5 — Submission output
```text
✅ Proposal submitted. {other_party} can run /spec-align D-001 after their next pull to confirm or reject.
```

## Verification Checklist

### Display
- [ ] Comparison table shown with both parties' positions
- [ ] Each position has: advantage, risk, THESIS alignment assessment
- [ ] AI recommendation provided with reasoning

### DIVERGENCES.md Updates
- [ ] D-001 status changed from `open` 🔴 to `proposed` 🟡
- [ ] `Proposer (Lead): alice` field added
- [ ] `Proposed at: align @ {commit} ({date})` field added
- [ ] `Proposed decision: {chosen resolution}` field added
- [ ] `Reasoning: {rationale}` field added
- [ ] `Votes` section added with `- alice: \`propose\``
- [ ] `_Awaiting reviews from others. The Proposer will finalize when consensus is reached._` notice added

### THESIS.md
- [ ] ⚠️ THESIS.md Decision Log was NOT updated (only updated at finalization time)
- [ ] Existing THESIS content unchanged

### Commit
- [ ] Message: `[SpecTeam] align — D-001: {title} proposed by alice, awaiting bob confirmation`

### Output
- [ ] Confirmation: "Proposal submitted. bob can run /spec-align D-001 after their next pull to confirm or reject."
