# SpecTeam PMF Validation Loop

This document turns the PMF assumptions in the product requirements into a weekly operating loop.

It is designed for the current wedge only:

- AI-native spec review
- divergence detection
- decision alignment
- shared source of truth for product and engineering teams

It is not a growth plan for the full long-term platform.

## Objective

The fastest path to PMF is to prove that a small set of AI-native teams will repeatedly use SpecTeam to shorten the path from divergence to decision.

The loop should optimize for four kinds of evidence:

1. The team understands the product in one short explanation.
2. The team completes the first review and alignment flow quickly.
3. The team repeats the workflow in a real project, not just in a demo.
4. The team shows willingness to pay for stronger team workflows and shared visibility.

## Primary Segment To Validate First

Focus only on the narrowest initial segment:

1. technical founders and product-engineering teams with 2 to 10 people
2. teams already using more than one AI tool in planning or design work
3. teams writing PRDs, architecture docs, or proposals in Git-managed workflows
4. teams already feeling pain from contradictory AI outputs or slow design convergence

Do not broaden beyond this segment until repeated pull is visible.

## Core PMF Questions

Each cycle should answer these questions with evidence:

1. Do teams immediately understand that SpecTeam solves spec drift and decision alignment?
2. Do teams reach value in the first 10 minutes?
3. Do teams bring the workflow into a second and third real decision?
4. Do teams ask for stronger visibility, templates, approvals, or team controls?
5. Do any of those asks create credible willingness to pay?

## The Fastest Validation Loop

### Step 1 - Recruit the right teams

Target 10 to 15 design partner teams, not a broad audience.

Preferred sources:

1. founder communities already using Claude Code, Codex CLI, Cursor, or similar tools
2. small product-engineering teams shipping with spec-heavy workflows
3. open source maintainers coordinating design proposals with AI assistance

The recruitment message should be simple:

`SpecTeam helps your team detect spec divergence, resolve decisions faster, and keep humans and AI tools aligned.`

### Step 2 - Run a guided first-use session

The first session should aim to observe one complete loop:

1. import or prepare two conflicting specs or proposals
2. detect divergence
3. review one divergence
4. record a resolution
5. verify that the team understands what changed and where the new source of truth lives

Capture only the highest-signal friction:

1. first-contact comprehension problems
2. setup friction
3. confusion around who proposes, approves, or finalizes
4. difficulty understanding the outcome or next action

### Step 3 - Push for repeated real use

Do not count a demo as strong validation.

Within one week of onboarding, ask each design partner to use SpecTeam on one real decision involving:

1. a PRD versus architecture mismatch
2. conflicting AI-generated proposals
3. multi-person disagreement on scope or technical direction

The real question is whether the team comes back without being forced.

### Step 4 - Convert repeated use into product learning

After every live use, log the following:

| Signal | What to capture |
|--------|-----------------|
| Trigger | What caused the divergence review |
| Time to decision | Minutes or hours from detected divergence to decision |
| Participants | Human and AI actors involved |
| Friction | Where the team hesitated or needed help |
| Reuse intent | Whether they want to use it on the next decision |
| Upgrade pull | Which stronger workflow or visibility capability they ask for |

Patterns matter more than isolated opinions.

### Step 5 - Test lightweight willingness to pay

Before building a larger product surface, test payment pull around a small premium layer.

Best candidates for early paid value:

1. stronger team dashboard and decision visibility
2. approval workflows and clearer reviewer roles
3. reusable templates and higher-confidence workflow setup
4. shared history, audit trails, and decision traceability

The goal is not revenue scale yet. The goal is to identify which pain is valuable enough to monetize.

## Weekly Operating Cadence

Run the loop weekly with one operating review.

### Monday to Thursday

1. onboard or support design partners
2. observe live or asynchronous usage
3. collect notes on friction, repetition, and requests

### Friday

Review evidence in one PMF checkpoint:

1. Which teams reused the workflow this week?
2. What reduced or increased time to decision?
3. Which friction blocked repeated use?
4. Which request appeared across multiple teams?
5. Is the next product change improving activation, repetition, or payment pull?

## Metrics To Watch

These should stay tightly aligned with the PRD.

| Metric | Why it matters |
|--------|----------------|
| Time for a new team to complete first demo | Measures activation friction |
| First-contact comprehension within about 5 seconds | Measures narrative clarity |
| Reviews per team per week | Measures recurring use |
| Open to resolved conversion | Measures decision effectiveness |
| Resolved to fully-closed conversion | Measures whether decisions actually land |
| Number of design partners reusing the workflow | Measures true pull |
| Number of teams asking for premium capabilities | Measures monetization signal |

## Decision Rules For The Next Iteration

Use simple rules after each weekly checkpoint.

### Double down when

1. teams complete first value quickly
2. the same team uses the workflow again without heavy prompting
3. requests for stronger visibility or approvals repeat across teams

### Refine when

1. teams understand the problem but not the workflow
2. activation works in demo but not in real work
3. decisions resolve but follow-through is weak

### Stop or narrow further when

1. teams do not perceive spec divergence as a painful enough problem
2. the workflow is repeatedly seen as too heavy for the value delivered
3. repeated use does not appear even after activation friction drops

## What Not To Do Before PMF

1. do not broaden the ICP too early
2. do not lead with platform infrastructure language
3. do not over-invest in enterprise controls before repeated team pull exists
4. do not treat one successful demo as proof of product pull
5. do not build the full dashboard surface before knowing which visibility problem users will pay for

## Immediate Next Actions

1. rewrite front-door messaging to lead with the spec review and alignment wedge
2. recruit the first 10 to 15 design partner teams
3. run guided sessions and force at least one real follow-up use per team
4. instrument the weekly PMF checkpoint and log repeated requests
5. prioritize the next feature only if it improves activation, repetition, or willingness to pay

## Related Documents

- [Product Requirements](./product-requirements.md)
- [Design Partner Playbook](./design-partner-playbook.md)
- [Brand Strategy](./brand-strategy.md)
- [Go-to-Market](./go-to-market.md)