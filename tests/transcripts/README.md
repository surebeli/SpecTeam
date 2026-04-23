# Transcript Validation

This directory documents the recommended way to validate real prompt output from the manual SpecTeam scenarios.

## Goal

The prompt tests under `tests/prompts/` are still run manually, but the expected interaction spine is now machine-checkable.

Capture the raw AI output for each scenario into a plain text file, then validate it with the shared checker.

## Recommended Order

Use this sequence when validating the live workflow:

1. `01-init-founder`
2. `05-review-conflict`
3. `06-align-propose`
4. `07-align-approve`
5. `11-align-finalize`

This follows the actual dependency chain better than skipping directly from init to align.

## Validation Commands

```bash
node tests/validate-divergences.js transcript 01-init-founder path/to/01-init-founder.txt
node tests/validate-divergences.js transcript 05-review-conflict path/to/05-review-conflict.txt
node tests/validate-divergences.js transcript 06-align-propose path/to/06-align-propose.txt
node tests/validate-divergences.js transcript 07-align-approve path/to/07-align-approve.txt
node tests/validate-divergences.js transcript 11-align-finalize path/to/11-align-finalize.txt
```

For a quick smoke test of the validator itself, use the sample captures under `tests/transcripts/fixtures/`.

## What The Checker Verifies

The checker is intentionally lightweight. It validates ordered critical markers rather than every exact sentence.

Examples:

1. init founder must include the three interactive setup steps, completion text, and branch protection
2. review conflict must include the review report structure and at least one divergence id
3. align propose must include the propose header, recommendation block, choice menu, and submission confirmation
4. align approve must include the confirm header and approval-recorded message
5. align finalize must include the proposer-lead prompt, current votes, action item preview, and final alignment summary