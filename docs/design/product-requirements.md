# SpecTeam Product Requirements Document (PMF-Oriented PRD)

## Product Definition

- **Market-facing product name**: SpecTeam
- **Repository / protocol identity**: SpecTeam
- **Current stage**: narrowed from a broad AI collaboration platform vision into a PMF-oriented wedge around spec review and decision alignment

This PRD describes the product shape most likely to reach PMF now. It does not attempt to describe the full long-term platform.

## Product Positioning

SpecTeam helps product and engineering teams detect divergence across PRDs, architecture docs, technical proposals, and AI-generated specs, make decisions faster, and keep humans and AI tools aligned around one shared source of truth.

One-line version:

`SpecTeam keeps specs, decisions, and AI agents aligned.`

This stage should not lead with a broad "AI collaboration infrastructure" pitch. It should lead with a narrower, more understandable promise:

- detect spec divergence automatically
- resolve design and architecture decisions faster
- keep teams and AI tools aligned around the same decision state

## Problem Statement

AI-native teams now face three recurring problems when writing PRDs, architecture docs, and technical plans:

1. Different humans and different AI tools generate conflicting proposals
2. Decision-making gets scattered across chats, diffs, and ad hoc conversations
3. Even after a decision is made, downstream work often continues from stale or conflicting specs

The core problem is not a lack of AI. The core problem is the lack of a reliable mechanism to keep specs and decisions aligned over time.

## Target Users (Initial ICP)

This phase should optimize for the users most likely to adopt repeatedly and pay earliest.

### Core ICP

1. Technical founders and small product-engineering teams with 2 to 10 people
2. Teams using more than one AI tool such as Claude, Cursor, Copilot, or Codex
3. Teams already managing PRDs, architecture docs, or design specs in Git-based workflows
4. Teams already feeling pain from contradictory AI output, repetitive review cycles, and slow convergence

### Secondary Users

1. Solo technical builders coordinating multiple AI tools
2. Tech leads, architecture owners, and product leads inside small teams

### Users Not Prioritized Now

1. Large enterprises demanding strong real-time collaboration and complex permissions on day one
2. Teams whose main pain is code completion rather than spec convergence
3. Teams without an existing documentation or Git-based collaboration habit

## Core Use Cases

### Use Case 1: PRD and architecture conflict

A product spec and an architecture proposal diverge. SpecTeam detects the mismatch, frames the divergence, and helps the team land a decision.

### Use Case 2: Multiple AI tools recommend different technical paths

Claude proposes REST. Cursor proposes GraphQL. The team needs a structured way to compare, decide, and freeze the result.

### Use Case 3: Decisions must propagate into execution constraints

A design decision is resolved, but people and AI tools continue working from outdated assumptions. SpecTeam syncs the decision back into the shared state and surfaces follow-up actions.

## Jobs To Be Done

Users hire SpecTeam to do three jobs:

1. Detect divergence early when multiple specs or proposals conflict
2. Preserve decision context and rationale when the team must choose a direction
3. Ensure humans and AI agents stop executing against different versions of the truth

## Product Promise

SpecTeam does not promise to fully automate execution from spec to code yet.

It promises to:

1. surface divergence earlier
2. shorten the time to decision
3. make decisions easier to inherit across the workflow

## MVP Scope

The MVP should keep only three core capabilities.

### 1. Divergence Detection

- scan and compare specs, PRDs, architecture docs, and AI-generated proposals
- output structured divergence records
- classify parties and priority

### 2. Decision Alignment

- propose, confirm, modify, and finalize decisions around divergence items
- write outcomes into a shared source of truth
- generate explicit action items for follow-through

### 3. Shared State Visibility

- show current divergence state for the workspace
- show pending approvals, resolved decisions, and remaining updates
- expose consistency score and blocker signals

## MVP Delivery Surfaces

This phase should stay lightweight and workflow-oriented:

1. Prompt skill workflow
2. Lightweight CLI
3. Lightweight VS Code status surface

Together, these should support the loop: `review -> align -> update -> status`.

## Explicit Non-Goals For This Phase

The following belong to the longer-term platform direction and should not dominate current PMF effort:

1. A full human arbitration web dashboard
2. Full productization of a BYO Agent SDK
3. Heavy real-time and infra layers such as Yjs, Yunxin, or PostgreSQL
4. Broad connector expansion before the core wedge is proven
5. Enterprise RBAC, audit, and private deployment as a first priority
6. A full spec-to-code execution promise

## Product Principles

1. **Solve divergence before expanding the platform**: focus on the real pain already present.
2. **Align decisions before selling execution automation**: this stage wins on alignment, not full execution.
3. **Optimize for immediate comprehension**: the market should understand the product quickly.
4. **Optimize for repeated use**: every use should reduce convergence time rather than add process overhead.

## Differentiation

Compared with general AI coding tools, SpecTeam is not trying to be "one more AI teammate."

Its differentiation is:

1. it directly addresses spec, design, and architecture conflict
2. it records shared truth in a Git-native workflow
3. it connects multiple people, documents, and AI tools through one decision loop

## Success Metrics Before PMF

Metrics should focus on repeated use and convergence efficiency, not broad platform vanity goals.

### Core Metrics

| Metric | Target |
|--------|--------|
| Median time from first detected divergence to decision | trends down consistently |
| Number of teams using the workflow weekly | trends up consistently |
| Reviews per team per week | `>= 2` |
| Conversion from `open` to `resolved` divergences | trends up |
| Conversion from `resolved` to `fully-closed` | trends up |

### Experience Metrics

| Metric | Target |
|--------|--------|
| Time for a new team to complete the first demo | `<= 10 minutes` |
| First-contact comprehension | user understands the product in about 5 seconds on the landing page |
| Willingness to use in the next project | clearly improving |

## PMF Hypotheses

The current product rests on four main hypotheses:

1. Small AI-native teams already feel real pain from spec divergence across multiple AI tools
2. These teams will accept a lightweight Git-native, prompt-first workflow if it reduces decision friction
3. If SpecTeam materially shortens the path from divergence to decision, teams will reuse it repeatedly
4. If `review` and `align` become high-frequency behaviors, the product has a credible path to expand into a broader platform later

## Commercialization Direction

Before PMF, commercialization should focus on design partners and lightweight willingness-to-pay validation rather than a full enterprise stack.

### Early Commercial Path

1. Use open source distribution and demos to reduce trial friction
2. Focus on 10 to 15 design partner teams
3. Treat stronger team workflows, templates, and shared visibility as early premium candidates

### Future Paid Layers

1. Team dashboard and approval interface
2. Stronger decision history and audit trails
3. Extended connectors and org-level collaboration controls

## Expansion Path After The Wedge Works

Only after the wedge is proven should the product broaden into fuller spec-driven teamwork:

1. expand from spec review into richer decision operations
2. expand from lightweight visibility into a human arbitration center
3. expand from Git-native async workflow into a stronger runtime state service
4. only then expand into a broader spec-driven development platform story

## Brand Consistency

Use `SpecTeam` consistently across the product, repository, workflow, and command surfaces.

## Related Documents

- [Brand Strategy](./brand-strategy.md)
- [PMF Validation Loop](./pmf-loop.md)
- [Go-to-Market](./go-to-market.md)
- [Dependency-Ordered Roadmap](./roadmap.md)
