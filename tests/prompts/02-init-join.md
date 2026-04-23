# Test 02: Init — Join Mode

## Scenario
A second collaborator joins an existing SpecTeam workflow.

## Prerequisites
- `.spec/` directory already exists (created by founder)
- `.spec/COLLABORATORS.md` has at least one existing member (e.g., `alice`)
- `.spec/THESIS.md` has an existing project goal
- The joining person has their own design document directory

## Test Prompt
```
/spec-init
```

## Expected Interactions
1. AI asks for member code → reply: `bob`
2. AI should NOT ask for project goal (join mode skips this step)
3. AI shows existing THESIS.md content and divergence state for review
4. AI asks for document directories → reply: `./docs/bob-proposal`

## Verification Checklist

### Join Behavior
- [ ] AI detected `.spec/` exists → entered join mode (not founder mode)
- [ ] Project goal step was skipped
- [ ] Existing THESIS.md content was displayed

### Directory Structure
- [ ] `.spec/design/bob/` created with copied documents
- [ ] `.spec/design/alice/` untouched (existing member's files preserved)
- [ ] Each copied file has `<!-- Spec Normalized Document -->` header

### COLLABORATORS.md
- [ ] `bob` row appended to members table
- [ ] `alice` row preserved (not overwritten)
- [ ] `Main Branch` field preserved from founder's init

### Git State
- [ ] `git config spec.member-code` returns `bob`
- [ ] `git config spec.main-branch` matches the value in COLLABORATORS.md
- [ ] Commit message: `[SpecTeam] init — bob joined workflow...`

### INDEX.md
- [ ] Updated by auto-triggered parse
- [ ] Contains entries for both `alice` and `bob` document trees
