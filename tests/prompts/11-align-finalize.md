# Test 11: Align — Lead Finalize Resolution

## Scenario
The original proposer returns after approvals are recorded and finalizes the consensus. This is the step that writes decision files, updates THESIS.md, and marks the divergence as resolved.

## Prerequisites
- SpecTeam workflow with two members: `alice` and `bob`
- D-001 is in `proposed` 🟡 state
- `Votes` section includes `alice: propose` and `bob: approve`
- Current identity: `alice` (she is the proposer / Lead)

## Test Prompt
```
/spec-align D-001
```

## Expected Interactions
1. AI detects that alice is the current proposer (Lead)
2. AI shows the current votes and the proposed decision summary
3. AI asks alice to choose (Finalize / Withdraw / Skip) → reply: `1` (Finalize)
4. AI generates action items before writing final files

## Golden Dialogue Checkpoints

### Checkpoint 1 — Lead mode prompt
```text
⏳ D-001: {title} — You are the Proposer (Lead).
	Proposed decision: {summary}
	Current Votes:
```

### Checkpoint 2 — Finalization choices
```text
Options:
1. ✅ Finalize and Resolve (Consensus reached)
2. ❌ Withdraw proposal (revert to open)
3. ⏭ Skip for now
```

### Checkpoint 3 — Action item preview
```text
## Source Document Action Items — D-001: {title}
```

### Checkpoint 4 — Session summary
```text
## Alignment Summary
```

## Verification Checklist

### Decision File
- [ ] `.spec/decisions/D-001.md` created
- [ ] Contains `# D-001: {title} — Change Instructions` header
- [ ] Contains `Decision`, `Proposer (Lead)`, and `Resolved at` metadata
- [ ] Includes per-party change instructions only for collaborators who still need updates
- [ ] Each instruction block includes file path, required changes, and acceptance criterion

### DIVERGENCES.md
- [ ] D-001 status changed from `proposed` 🟡 to `resolved` ✅
- [ ] `Resolved at: align @ {commit} ({date})` field added
- [ ] `Decision: {resolution summary}` field added
- [ ] `Rationale: {reasoning}` field added
- [ ] `Final Votes` summary recorded
- [ ] `Change Instructions: see .spec/decisions/D-001.md` reference added
- [ ] Source document action items table present with per-party status

### THESIS.md
- [ ] ✅ Decision Log section updated at this step
- [ ] Entry format: `[{date}] **D-001: {title}**: {resolution summary}`
- [ ] Includes `Proposed and finalized by: alice`
- [ ] Includes rationale

### SIGNALS.md
- [ ] Relevant blocker removed (if D-001 was blocking)
- [ ] Resolved entry added

### Commit
- [ ] Message: `[SpecTeam] align — D-001: {title} finalized and resolved by Lead (alice)`

### Output
- [ ] Session summary shows D-001 as `resolved`
- [ ] AI recommends `/spec-push` if no blocking divergences remain