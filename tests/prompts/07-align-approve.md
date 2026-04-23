# Test 07: Align — Approve Proposal

## Scenario
The other party approves a proposed resolution. The vote should be recorded, but the proposer must still return to finalize before THESIS.md and decision files are updated.

## Prerequisites
- SpecTeam workflow with two members: `alice` and `bob`
- D-001 in `proposed` 🟡 state, proposed by `alice`, awaiting `bob`
- Current identity: `bob` (he is the approver)

## Test Prompt
```
/spec-align D-001
```

## Expected Interactions
1. AI shows alice's proposal details and reasoning
2. AI shows original comparison table
3. AI asks bob to choose (Agree / Reject / Modify / Skip) → reply: `1` (Agree)

## Golden Dialogue Checkpoints

### Checkpoint 1 — Approval header
```text
**[Confirm Resolution — D-001: {title}]**
```

### Checkpoint 2 — Proposal block
```text
**{proposer}'s proposal:**
> Decision: {proposed resolution}
> Reasoning: {reasoning}
> Proposed at: {date}
```

### Checkpoint 3 — Review options
```text
Please choose:
1. ✅ Agree with this proposal
2. ❌ Reject — revert to open (please provide rejection reason)
3. 🔄 Modify and counter-propose (your modified version becomes the new proposal)
4. ⏭ Skip for now
```

### Checkpoint 4 — Approval output
```text
✅ Approval recorded. The original proposer (Lead) will finalize the resolution once consensus is reached.
```

## Verification Checklist

### DIVERGENCES.md
- [ ] D-001 status remains `proposed` 🟡
- [ ] `Votes` section includes `- bob: \`approve\``
- [ ] Proposal details from alice are preserved
- [ ] Proposal is still awaiting Lead finalization

### THESIS.md
- [ ] ⚠️ THESIS.md Decision Log is still unchanged at this stage
- [ ] No new D-001 decision entry written yet

### Decision Files
- [ ] `.spec/decisions/D-001.md` does NOT exist yet
- [ ] No action items generated yet

### Commit
- [ ] Message: `[SpecTeam] align — D-001: {title} approved by bob, awaiting Lead's final confirmation`

### Output
- [ ] Confirmation: `Approval recorded. The original proposer (Lead) will finalize the resolution once consensus is reached.`
