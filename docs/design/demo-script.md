# SpecTeam Demo Script

This document provides a ready-to-run demo narrative for the current SpecTeam wedge.

Use it for live calls, recorded walkthroughs, or short product intros.

The goal of the demo is simple:

show that SpecTeam helps teams detect spec divergence, resolve one decision clearly, and sync that outcome back into a shared source of truth.

## Best Demo Scenario

Use the narrowest scenario that makes the problem obvious.

Recommended default:

- a PRD or API spec conflict between two collaborators
- one concrete disagreement, such as REST versus GraphQL
- one clear resolution path that can be explained in under five minutes

For this repository, the simplest demo story maps well to the mock conflict scenario under `tests/mock-scenarios/demo-1-conflict/`.

## Demo Promise

State the promise before showing the tool.

`If your PRD, architecture doc, and AI-generated proposals keep drifting apart, SpecTeam helps your team detect the divergence, make one clear decision, and sync that result back into a shared source of truth.`

## 30-Second Opening

Use this when time is short.

`SpecTeam is for teams whose PRDs, architecture docs, and AI-generated proposals keep drifting apart. In one workflow, it detects the divergence, helps the team make one clear decision, and writes that outcome back into the shared source of truth so humans and AI tools stop working from different assumptions.`

## 90-Second Demo Narrative

1. Start with two conflicting inputs, for example one collaborator proposing REST and another proposing GraphQL.
2. Explain that the problem is not a lack of proposals, but too many contradictory assumptions.
3. Show that SpecTeam detects the disagreement as a divergence.
4. Open one divergence and walk through the review and alignment step.
5. Resolve the decision and show where the shared source of truth now lives.
6. Close by explaining that the value is repeated decision alignment, not just one-time review.

## 5-Minute Live Demo Script

### Step 1 - Set up the problem

Talk track:

`Here is the real issue. One spec says one thing, another says something else, and AI tools amplify the mismatch by proposing different paths. The team is not missing ideas. It is missing a reliable way to detect the divergence and close the decision.`

Show:

1. two conflicting specs or proposals
2. the relevant collaborator inputs

### Step 2 - Show divergence detection

Talk track:

`SpecTeam reviews the inputs and turns disagreement into an explicit divergence record. That matters because the team can now see what is open instead of debating from memory.`

Show:

1. run the review flow or present the resulting divergence state
2. highlight one concrete divergence

### Step 3 - Walk through alignment

Talk track:

`Now we pick one disagreement, review it, and align on a decision. The goal is not to keep comparing proposals forever. The goal is to close the decision clearly.`

Show:

1. one divergence entering review
2. the align step
3. the resulting resolved state

### Step 4 - Show the source of truth

Talk track:

`The important output is not just a discussion. It is a decision that can now be treated as the shared source of truth.`

Show:

1. the resolved divergence entry
2. the corresponding decision log or next-state artifact

### Step 5 - Close on value

Talk track:

`That is the wedge. SpecTeam helps teams detect spec divergence, resolve decisions faster, and keep humans and AI tools aligned. The point is not to generate more proposals. The point is to stop the team from working from different assumptions.`

## Operator Checklist

Before the demo:

1. pick one conflict scenario only
2. prepare the exact divergence you want to discuss
3. avoid showing too many commands or files at once
4. know your closing line before you start

During the demo:

1. lead with the contradiction, not the architecture
2. keep the workflow visible and concrete
3. narrate why each step matters
4. end on the shared source of truth, not the mechanics

## What Not To Say

1. do not lead with multi-agent infrastructure
2. do not start by explaining MCP internals
3. do not promise full spec-to-execution automation
4. do not make the demo about prompt tricks instead of decision alignment

## Demo Close And CTA

### Close line

`If this problem already exists in your team, the next step is not a broad rollout. The next step is to run one real decision through the workflow and see whether your team comes back to use it again.`

### CTA for design partners

`Bring one real spec conflict or AI proposal mismatch, and we can run it through SpecTeam together.`

## Related Documents

- [Messaging Kit](./messaging-kit.md)
- [Go-to-Market](./go-to-market.md)
- [Design Partner Playbook](./design-partner-playbook.md)