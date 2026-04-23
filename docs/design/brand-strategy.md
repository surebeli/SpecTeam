# SpecTeam Brand Strategy

This document defines the final brand decision for the current product.

The key constraint is simple:

the product is unreleased, so the brand should be made consistent now instead of carrying a legacy compatibility layer.

## Final Decision

Use `SpecTeam` everywhere that matters:

1. product name
2. repository-facing name
3. protocol and workflow name
4. command family
5. plugin and extension metadata

There is no separate transition brand in the current plan.

There is also no retained legacy command family.

## Why This Is The Right Move

The product wins on a narrow, understandable problem:

1. teams create conflicting specs and proposals
2. AI tools amplify divergence instead of resolving it
3. decisions do not reliably flow back into the shared source of truth

`SpecTeam` points directly at that problem space.

It is clearer than an abstract umbrella name and safer than a name that over-promises execution.

## Naming Rule Set

Use these rules consistently.

| Surface | Required naming |
|--------|------------------|
| Product | `SpecTeam` |
| Prompt entry file | `SPECTEAM.md` |
| Workspace state directory | `.spec/` |
| Git config keys | `spec.member-code`, `spec.main-branch` |
| Command family | `spec-*` |
| CLI binary | `spec` |
| Package and extension ids | `specteam-*` when machine-readable ids are needed |

## Market Positioning

### Category expression

Lead with one of these narrow category expressions:

1. AI-native spec review and alignment
2. decision alignment for AI product and engineering teams
3. the alignment layer for spec-driven teamwork

### One-line explanation

`SpecTeam keeps specs, decisions, and AI agents aligned.`

### Expanded explanation

`SpecTeam helps product and engineering teams detect divergence across PRDs, architecture docs, and AI-generated proposals, then turn decisions into a shared source of truth.`

## Why Not SpecEx Now

`SpecEx` still sounds more execution-heavy than the product reality.

The current product is strongest at:

1. divergence detection
2. decision alignment
3. shared state visibility
4. keeping humans and AI tools synchronized

It is not yet strongest at end-to-end spec-to-execution automation.

Using `SpecEx` too early would pull market expectations ahead of the actual product.

## Messaging Rules

### Lead with

1. detect spec divergence
2. resolve product and architecture decisions faster
3. keep humans and AI tools aligned

### Do not lead with

1. multi-agent infrastructure language
2. MCP implementation details
3. enterprise packaging before PMF
4. full spec-to-code promises the product does not yet support

## Consistency Requirements

All user-facing surfaces should tell the same story.

That includes:

1. README and onboarding docs
2. prompt skill names and examples
3. CLI help text and package metadata
4. VS Code extension names and commands
5. demo scripts, screenshots, and test prompts
6. marketplace and plugin manifests

## Immediate Application Checklist

1. use `SpecTeam` in all outward and inward naming surfaces
2. use `.spec/` as the only documented workspace state directory
3. use `spec-*` as the only documented command family
4. remove all “transition”, “legacy”, and “compatibility” language from docs
5. keep `SpecEx` only as a future naming option, not an active brand

## Related Documents

- [Product Requirements](./product-requirements.md)
- [Chinese Brand Strategy](./brand-strategy.zh-CN.md)
- [Messaging Kit](./messaging-kit.md)
- [Go-to-Market](./go-to-market.md)