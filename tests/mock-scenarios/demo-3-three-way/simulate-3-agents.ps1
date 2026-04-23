param (
    [switch]$Clean = $false
)

$SCRIPT_DIR = $PSScriptRoot
$WORKSPACE = "$SCRIPT_DIR/workspace"

if ($Clean -and (Test-Path $WORKSPACE)) {
    Remove-Item -Recurse -Force $WORKSPACE
}

if (!(Test-Path $WORKSPACE)) {
    New-Item -ItemType Directory -Path $WORKSPACE | Out-Null
}

Set-Location $WORKSPACE

Write-Host "🤖 SpecTeam Demo: 3-Way Design Challenge" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# --- STEP 1: Git Init ---
Write-Host "`n[Step 1] Initializing Shared Git Transport..." -ForegroundColor Yellow
git init -b main | Out-Null
git commit --allow-empty -m "init" | Out-Null

# --- STEP 2: Team Init ---
Write-Host "`n[Step 2] 3 collaborators joining the SpecTeam workflow (/spec-init)..." -ForegroundColor Yellow

New-Item -ItemType Directory -Path ".spec/design" -Force | Out-Null
$collaborators = @'
# SpecTeam Collaborators

**Main Branch**: main

## Members
| Code | Source Directories | Spec Path | Joined |
|------|-------------------|--------------|--------|
| alice | ../alice | .spec/design/alice/ | 2026-04-20 |
| bob | ../bob | .spec/design/bob/ | 2026-04-20 |
| carol | ../carol | .spec/design/carol/ | 2026-04-20 |
'@
Set-Content -Path ".spec/COLLABORATORS.md" -Value $collaborators

$thesis = @'
# SpecTeam Project: Payment System

## North Star
Design the payment processing system for our e-commerce platform.

## Decision Log
*(No decisions yet)*
'@
Set-Content -Path ".spec/THESIS.md" -Value $thesis

foreach ($agent in @("alice", "bob", "carol")) {
    Write-Host "  -> Agent $agent is normalizing proposals..." -ForegroundColor Green
    $dest = ".spec/design/$agent"
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
    Copy-Item -Path "$SCRIPT_DIR/$agent/payment-architecture.md" -Destination "$dest/"
}

git add .
git commit -m "[SpecTeam] init — alice, bob, and carol joined workflow and normalized design documents" | Out-Null

# --- STEP 3: Divergence Review ---
Write-Host "`n[Step 3] Reviewing specs for divergences (/spec-review)..." -ForegroundColor Yellow

$divergences = @'
# SpecTeam Divergence Registry

_Last reviewed: 2026-04-20 @ HEAD by system_

## Open

### D-001: Architecture Style
**Status**: `open` 🔴
**Parties**: alice, bob, carol
**Nature**: architecture direction | **Priority**: blocking
- **alice**: microservices (dedicated services for each payment method)
- **bob**: monolithic approach (single payment service)
- **carol**: serverless / event-driven architecture (AWS Lambda + EventBridge)
- **THESIS**: unaligned - North Star does not specify architecture.

### D-002: Data Storage Strategy
**Status**: `open` 🔴
**Parties**: alice, bob, carol
**Nature**: technology choice | **Priority**: directional
- **alice**: PostgreSQL database-per-service + Redis
- **bob**: Single PostgreSQL database for all tables
- **carol**: DynamoDB + S3
- **THESIS**: unaligned.

### D-003: PCI Compliance Level
**Status**: `open` 🔴
**Parties**: alice, bob, carol
**Nature**: compliance | **Priority**: directional
- **alice**: PCI DSS Level 1 compliance required
- **bob**: PCI DSS Level 2 is sufficient for current volume
- **carol**: PCI DSS Level 1 via Stripe Elements + least-privilege IAM
- **THESIS**: unaligned.

### D-004: PayPal Support
**Status**: `open` 🔴
**Parties**: alice, bob, carol
**Nature**: scope | **Priority**: detail
- **alice**: Supports PayPal
- **bob**: Supports PayPal
- **carol**: No PayPal (avoids cold start latency)
- **THESIS**: unaligned.
'@
Set-Content -Path ".spec/DIVERGENCES.md" -Value $divergences

git add .
git commit -m "[SpecTeam] review — 4 new divergences found" | Out-Null
Write-Host "  -> Found 3-way conflicts in Architecture, DB, Compliance, and Scope!" -ForegroundColor Red

# --- STEP 4: Proposals + Approvals ---
Write-Host "`n[Step 4] Agents proposing and reviewing resolutions (/spec-align all)..." -ForegroundColor Yellow

Write-Host "  -> Alice proposes serverless with async PayPal support and Bob/Carol record approvals." -ForegroundColor Magenta
Write-Host "  -> Carol proposes DynamoDB + S3 and Alice/Bob record approvals." -ForegroundColor Magenta
Write-Host "  -> Alice proposes a Level 1 baseline and Bob/Carol record approvals." -ForegroundColor Magenta

$divergencesProposed = @'
# SpecTeam Divergence Registry

## Proposed

### D-001: Architecture Style
**Status**: `proposed` 🟡
**Parties**: alice, bob, carol
**Nature**: architecture direction
**Priority**: blocking
**Found at**: review @ `HEAD` (2026-04-20)
**Proposer (Lead)**: alice
**Proposed at**: align @ `HEAD` (2026-04-20)
**Proposed decision**: Adopt Carol's serverless approach, but keep PayPal support through Step Functions orchestration.
**Reasoning**: Serverless preserves scaling advantages while keeping commercially important payment coverage.

**Votes**:
- alice: `propose`
- bob: `approve`
- carol: `approve`

_Awaiting reviews from others. The Proposer will finalize when consensus is reached._

### D-002: Data Storage Strategy
**Status**: `proposed` 🟡
**Parties**: alice, bob, carol
**Nature**: technology choice
**Priority**: directional
**Found at**: review @ `HEAD` (2026-04-20)
**Proposer (Lead)**: carol
**Proposed at**: align @ `HEAD` (2026-04-20)
**Proposed decision**: Use DynamoDB for payment state and S3 for audits, with reporting exports for finance workflows.
**Reasoning**: This keeps the event-driven architecture coherent without losing auditability.

**Votes**:
- carol: `propose`
- alice: `approve`
- bob: `approve`

_Awaiting reviews from others. The Proposer will finalize when consensus is reached._

### D-003: PCI Compliance Level
**Status**: `proposed` 🟡
**Parties**: alice, bob, carol
**Nature**: compliance
**Priority**: directional
**Found at**: review @ `HEAD` (2026-04-20)
**Proposer (Lead)**: alice
**Proposed at**: align @ `HEAD` (2026-04-20)
**Proposed decision**: Standardize on a PCI DSS Level 1 baseline using Stripe tokenization and least-privilege infrastructure controls.
**Reasoning**: It satisfies enterprise-grade payment requirements without constraining the chosen runtime model.

**Votes**:
- alice: `propose`
- bob: `approve`
- carol: `approve`

_Awaiting reviews from others. The Proposer will finalize when consensus is reached._

### D-004: PayPal Support
**Status**: `proposed` 🟡
**Parties**: alice, bob, carol
**Nature**: scope
**Priority**: detail
**Found at**: review @ `HEAD` (2026-04-20)
**Proposer (Lead)**: alice
**Proposed at**: align @ `HEAD` (2026-04-20)
**Proposed decision**: Keep PayPal in scope and process it asynchronously inside the serverless flow.
**Reasoning**: PayPal remains commercially important and can be supported without abandoning the chosen architecture.

**Votes**:
- alice: `propose`
- bob: `approve`
- carol: `approve`

_Awaiting reviews from others. The Proposer will finalize when consensus is reached._
'@
Set-Content -Path ".spec/DIVERGENCES.md" -Value $divergencesProposed

git add .
git commit -m "[SpecTeam] align — consensus recorded for 4 divergences, awaiting Lead finalization" | Out-Null

Write-Host "  -> Consensus recorded. Lead collaborators now finalize the approved resolutions." -ForegroundColor Green

# --- STEP 5: Lead Finalization ---
Write-Host "`n[Step 5] Lead collaborators finalizing approved resolutions (/spec-align D-001 ... D-004)..." -ForegroundColor Yellow

$divergencesResolved = @'
# SpecTeam Divergence Registry

## Resolved

### D-001: Architecture Style ✅
**Status**: `resolved`
**Parties**: alice, bob, carol
**Resolved at**: align @ `HEAD` (2026-04-20)
**Decision**: Adopt a serverless / event-driven payment architecture, with PayPal handled asynchronously through Step Functions orchestration.
**Rationale**: This keeps operational overhead low, preserves scaling benefits, and retains required payment method coverage.
**Final Votes**:
- alice: `propose`
- bob: `approve`
- carol: `approve`
**Change Instructions**: see `.spec/decisions/D-001.md`

#### Source Document Action Items

| Collaborator | Source file | Status |
|--------------|-------------|--------|
| alice | `./alice/payment-architecture.md` | ⏳ Pending update |
| bob | `./bob/payment-architecture.md` | ⏳ Pending update |
| carol | `./carol/payment-architecture.md` | ⏳ Pending update |

### D-002: Data Storage Strategy ✅
**Status**: `resolved`
**Parties**: alice, bob, carol
**Resolved at**: align @ `HEAD` (2026-04-20)
**Decision**: Use DynamoDB for payment state and S3 for audit artifacts, with derived exports for reporting.
**Rationale**: The chosen storage model best fits the event-driven architecture while preserving traceability.
**Final Votes**:
- carol: `propose`
- alice: `approve`
- bob: `approve`
**Change Instructions**: see `.spec/decisions/D-002.md`

#### Source Document Action Items

| Collaborator | Source file | Status |
|--------------|-------------|--------|
| alice | `./alice/payment-architecture.md` | ⏳ Pending update |
| bob | `./bob/payment-architecture.md` | ⏳ Pending update |
| carol | `./carol/payment-architecture.md` | ✅ No changes needed |

### D-003: PCI Compliance Level ✅
**Status**: `resolved`
**Parties**: alice, bob, carol
**Resolved at**: align @ `HEAD` (2026-04-20)
**Decision**: Standardize on a PCI DSS Level 1 baseline with Stripe tokenization, API protection, and least-privilege controls.
**Rationale**: The stricter baseline avoids future compliance rework and fits both architecture and payment-method choices.
**Final Votes**:
- alice: `propose`
- bob: `approve`
- carol: `approve`
**Change Instructions**: see `.spec/decisions/D-003.md`

#### Source Document Action Items

| Collaborator | Source file | Status |
|--------------|-------------|--------|
| alice | `./alice/payment-architecture.md` | ✅ No changes needed |
| bob | `./bob/payment-architecture.md` | ⏳ Pending update |
| carol | `./carol/payment-architecture.md` | ⏳ Pending update |

### D-004: PayPal Support ✅
**Status**: `resolved`
**Parties**: alice, bob, carol
**Resolved at**: align @ `HEAD` (2026-04-20)
**Decision**: Keep PayPal in scope and implement it asynchronously inside the serverless payment flow.
**Rationale**: PayPal remains commercially important and no longer blocks the chosen architecture.
**Final Votes**:
- alice: `propose`
- bob: `approve`
- carol: `approve`
**Change Instructions**: see `.spec/decisions/D-004.md`

#### Source Document Action Items

| Collaborator | Source file | Status |
|--------------|-------------|--------|
| alice | `./alice/payment-architecture.md` | ✅ No changes needed |
| bob | `./bob/payment-architecture.md` | ✅ No changes needed |
| carol | `./carol/payment-architecture.md` | ⏳ Pending update |
'@
Set-Content -Path ".spec/DIVERGENCES.md" -Value $divergencesResolved

New-Item -ItemType Directory -Path "$WORKSPACE/.spec/decisions" -Force | Out-Null
$d001 = @'
# D-001: Architecture Style — Change Instructions

**Decision**: Adopt a serverless / event-driven payment architecture, with PayPal handled asynchronously through Step Functions orchestration.
**Proposer (Lead)**: alice | **Resolved at**: 2026-04-20

## [alice] Change Instructions
**File**: `./alice/payment-architecture.md`
**Required changes**:
- Replace the microservices architecture section with the agreed serverless / event-driven architecture.
- Keep PayPal support explicit, but move it to an asynchronous Step Functions path.

**Acceptance criterion**: The document describes a serverless architecture and still includes PayPal support.

## [bob] Change Instructions
**File**: `./bob/payment-architecture.md`
**Required changes**:
- Replace the monolith section with the agreed serverless / event-driven architecture.

**Acceptance criterion**: The document no longer describes a monolithic payment service.

## [carol] Change Instructions
**File**: `./carol/payment-architecture.md`
**Required changes**:
- Add explicit Step Functions handling for asynchronous PayPal processing.

**Acceptance criterion**: The document includes PayPal support in the serverless design.
'@
Set-Content -Path ".spec/decisions/D-001.md" -Value $d001

$d002 = @'
# D-002: Data Storage Strategy — Change Instructions

**Decision**: Use DynamoDB for payment state and S3 for audit artifacts, with reporting exports where needed.
**Proposer (Lead)**: carol | **Resolved at**: 2026-04-20

## [alice] Change Instructions
**File**: `./alice/payment-architecture.md`
**Required changes**:
- Replace database-per-service storage with DynamoDB for payment state and S3 for audit outputs.

**Acceptance criterion**: The document references DynamoDB and S3 instead of PostgreSQL-per-service.

## [bob] Change Instructions
**File**: `./bob/payment-architecture.md`
**Required changes**:
- Replace the single PostgreSQL design with DynamoDB payment state and export-based reporting.

**Acceptance criterion**: The document no longer describes a single PostgreSQL database as the primary store.
'@
Set-Content -Path ".spec/decisions/D-002.md" -Value $d002

$d003 = @'
# D-003: PCI Compliance Level — Change Instructions

**Decision**: Standardize on a PCI DSS Level 1 baseline with Stripe tokenization and least-privilege controls.
**Proposer (Lead)**: alice | **Resolved at**: 2026-04-20

## [bob] Change Instructions
**File**: `./bob/payment-architecture.md`
**Required changes**:
- Replace the PCI DSS Level 2 statement with a Level 1 baseline.

**Acceptance criterion**: The document explicitly requires PCI DSS Level 1 compliance.

## [carol] Change Instructions
**File**: `./carol/payment-architecture.md`
**Required changes**:
- Keep the existing compliance baseline, but note that it is the team-wide requirement.

**Acceptance criterion**: The document describes the Level 1 baseline as the shared team standard.
'@
Set-Content -Path ".spec/decisions/D-003.md" -Value $d003

$d004 = @'
# D-004: PayPal Support — Change Instructions

**Decision**: Keep PayPal in scope and implement it asynchronously inside the serverless payment flow.
**Proposer (Lead)**: alice | **Resolved at**: 2026-04-20

## [carol] Change Instructions
**File**: `./carol/payment-architecture.md`
**Required changes**:
- Replace the no-PayPal scope with async PayPal handling in the serverless flow.

**Acceptance criterion**: The document includes PayPal as a supported payment method.
'@
Set-Content -Path ".spec/decisions/D-004.md" -Value $d004

$thesisUpdated = @'
# SpecTeam Project: Payment System

## North Star
Design the payment processing system for our e-commerce platform.

## Decision Log
- [2026-04-20] **D-001: Architecture Style**: Adopt a serverless / event-driven architecture with async PayPal handling.
    - Proposed and finalized by: alice
    - Rationale: The team chose the lowest-ops architecture without dropping critical payment coverage.
- [2026-04-20] **D-002: Data Storage Strategy**: Use DynamoDB for payment state and S3 for audit artifacts.
    - Proposed and finalized by: carol
    - Rationale: This storage model best supports the chosen event-driven runtime.
- [2026-04-20] **D-003: PCI Compliance Level**: Standardize on a PCI DSS Level 1 baseline.
    - Proposed and finalized by: alice
    - Rationale: The stricter compliance baseline avoids future rework and aligns with enterprise expectations.
- [2026-04-20] **D-004: PayPal Support**: Keep PayPal in scope and process it asynchronously.
    - Proposed and finalized by: alice
    - Rationale: PayPal remains commercially important and no longer blocks the chosen architecture.
'@
Set-Content -Path ".spec/THESIS.md" -Value $thesisUpdated

$signals = @'
# SpecTeam Signals

## Resolved
- [2026-04-20] D-001 resolved — Architecture style aligned on serverless + async PayPal.
- [2026-04-20] D-002 resolved — Data storage aligned on DynamoDB + S3.
- [2026-04-20] D-003 resolved — Compliance aligned on PCI DSS Level 1.
- [2026-04-20] D-004 resolved — PayPal kept in scope with async execution.
'@
Set-Content -Path ".spec/SIGNALS.md" -Value $signals

git add .
git commit -m "[SpecTeam] align — 4 divergences finalized and resolved" | Out-Null

Write-Host "`n🎉 Simulation Complete! The 3 collaborators successfully resolved their complex design conflicts using the SpecTeam workflow and protocol." -ForegroundColor Cyan
Write-Host "Check the generated files in $WORKSPACE/.spec/" -ForegroundColor White
