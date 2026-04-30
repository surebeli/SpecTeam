# SpecTeam Divergence Registry

## Proposed

### D-001: Payment Architecture Choice
**Status**: `proposed` 🟡
**Parties**: alice, bob, carol
**Nature**: architecture direction
**Priority**: blocking
**Found at**: review @ `abc7771` (2026-04-25)
**Proposer (Lead)**: alice
**Proposed at**: align @ `def8882` (2026-04-26)
**Proposed decision**: Keep a microservice payment gateway with dedicated provider adapters, retain PayPal support, and defer event-driven orchestration to internal async workers.
**Reasoning**: This preserves PayPal support and PCI Level 1 expectations while keeping responsibilities explicit for each payment flow.

**Votes**:
- alice: `propose`
- bob: `approve`

_Awaiting reviews from others. The Proposer will finalize when consensus is reached._
