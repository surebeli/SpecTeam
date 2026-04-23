param(
    [switch]$Setup,
    [switch]$AssertOnly,
    [ValidateSet('all', 'init-founder', 'init-join', 'update-new', 'review-conflict', 'align-propose', 'align-approve', 'align-finalize', 'status', 'push-drift', 'divergence-fixtures', 'transcript-fixtures')]
    [string]$Test = 'all',
    [string]$WorkspacePath,
    [ValidateSet('assert-only', 'demo-3-three-way', 'proposed-state')]
    [string]$SmokeWorkspace
)

if (-not $IsWindows) {
    Write-Error 'tests/run-e2e.ps1 is a Windows-only wrapper. Run tests/run-e2e.sh on non-Windows systems.'
    exit 1
}

$explicitTest = $PSBoundParameters.ContainsKey('Test')
if ($Setup -and ($AssertOnly -or $explicitTest)) {
    Write-Error 'Use only one mode at a time: -Setup, -AssertOnly, or -Test.'
    exit 1
}

if ($AssertOnly -and $explicitTest) {
    Write-Error 'Use -AssertOnly for the full stateful assertion suite, or -Test for a single test.'
    exit 1
}

if ($WorkspacePath -and $SmokeWorkspace) {
    Write-Error 'Use either -WorkspacePath or -SmokeWorkspace, not both.'
    exit 1
}

if ($Setup -and $SmokeWorkspace) {
    Write-Error '-Setup creates a fresh mock repository and does not accept -SmokeWorkspace.'
    exit 1
}

$ErrorActionPreference = 'Stop'

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $ScriptDir
$preparedSmokeWorkspace = $null

$pass = 0
$fail = 0
$skip = 0
$errors = @()

function Write-Section {
    param([string]$Title)
    Write-Host "`n=== $Title ===" -ForegroundColor Cyan
}

function Write-Pass {
    param([string]$Message)
    $script:pass++
    Write-Host "  PASS: $Message" -ForegroundColor Green
}

function Write-Fail {
    param([string]$Message)
    $script:fail++
    $script:errors += $Message
    Write-Host "  FAIL: $Message" -ForegroundColor Red
}

function Write-Skip {
    param([string]$Message)
    $script:skip++
    Write-Host "  SKIP: $Message" -ForegroundColor Yellow
}

function Get-RepoPath {
    param([string]$RelativePath)
    $segments = $RelativePath -split '/'
    $path = $RepoRoot
    foreach ($segment in $segments) {
        if ($segment) {
            $path = Join-Path $path $segment
        }
    }
    return $path
}

function Get-TargetWorkspace {
    if ($script:preparedSmokeWorkspace) {
        return $script:preparedSmokeWorkspace
    }

    if ($SmokeWorkspace) {
        $script:preparedSmokeWorkspace = Resolve-SmokeWorkspace $SmokeWorkspace
        return $script:preparedSmokeWorkspace
    }

    if ($WorkspacePath) {
        return (Resolve-Path $WorkspacePath).Path
    }

    return (Get-Location).Path
}

function Get-WorkspacePath {
    param(
        [string]$Workspace,
        [string]$RelativePath
    )

    $normalized = $RelativePath -replace '/', '\\'
    return Join-Path $Workspace $normalized
}

function Invoke-Tool {
    param(
        [string]$Label,
        [string]$Command,
        [string[]]$Arguments,
        [switch]$Quiet
    )

    if ($Quiet) {
        & $Command @Arguments *> $null
    } else {
        & $Command @Arguments
    }

    if ($LASTEXITCODE -eq 0) {
        Write-Pass $Label
        return
    }

    Write-Fail $Label
}

function Set-WorkspaceFile {
    param(
        [string]$Workspace,
        [string]$RelativePath,
        [string[]]$Content
    )

    $path = Get-WorkspacePath $Workspace $RelativePath
    $parent = Split-Path -Parent $path
    if (-not (Test-Path -LiteralPath $parent -PathType Container)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }

    Set-Content -LiteralPath $path -Value $Content
}

function Assert-FileExists {
    param(
        [string]$Workspace,
        [string]$RelativePath
    )

    $path = Get-WorkspacePath $Workspace $RelativePath
    if (Test-Path -LiteralPath $path -PathType Leaf) {
        Write-Pass "Exists: $RelativePath"
        return
    }

    Write-Fail "Missing: $RelativePath"
}

function Assert-DirExists {
    param(
        [string]$Workspace,
        [string]$RelativePath
    )

    $path = Get-WorkspacePath $Workspace $RelativePath
    if (Test-Path -LiteralPath $path -PathType Container) {
        Write-Pass "Dir: $RelativePath"
        return
    }

    Write-Fail "No dir: $RelativePath"
}

function Assert-FileContains {
    param(
        [string]$Workspace,
        [string]$RelativePath,
        [string]$Needle
    )

    $path = Get-WorkspacePath $Workspace $RelativePath
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        Write-Fail "Missing (content): $RelativePath"
        return
    }

    if (Select-String -Path $path -SimpleMatch $Needle -Quiet) {
        Write-Pass "'$RelativePath' contains '$Needle'"
        return
    }

    Write-Fail "'$RelativePath' missing '$Needle'"
}

function Assert-GitConfigSet {
    param(
        [string]$Workspace,
        [string]$Key
    )

    $value = (& git -C $Workspace config $Key 2>$null).Trim()
    if ($value) {
        Write-Pass "git config $Key = $value"
        return
    }

    Write-Fail "git config $Key is empty"
}

function Assert-CommitPattern {
    param(
        [string]$Workspace,
        [string]$Pattern
    )

    $subjects = & git -C $Workspace log --oneline -5 --format=%s 2>$null
    if ($LASTEXITCODE -eq 0 -and ($subjects | Select-String -Pattern $Pattern -Quiet)) {
        Write-Pass "Commit: $Pattern"
        return
    }

    Write-Fail "No commit: $Pattern"
}

function Test-InitFounder {
    param([string]$Workspace)

    Write-Section 'Test 01: Init — Founder'
    Assert-DirExists $Workspace '.spec'
    Assert-DirExists $Workspace '.spec/design'
    Assert-FileExists $Workspace '.spec/COLLABORATORS.md'
    Assert-FileExists $Workspace '.spec/THESIS.md'
    Assert-FileExists $Workspace '.spec/RULES.md'
    Assert-FileExists $Workspace '.spec/SIGNALS.md'
    Assert-FileExists $Workspace '.spec/INDEX.md'
    Assert-GitConfigSet $Workspace 'spec.member-code'
    Assert-GitConfigSet $Workspace 'spec.main-branch'
    Assert-CommitPattern $Workspace '\[SpecTeam\]'
    Assert-FileContains $Workspace '.spec/COLLABORATORS.md' 'Main Branch'
}

function Test-InitJoin {
    param([string]$Workspace)

    Write-Section 'Test 02: Init — Join'
    $designDir = Get-WorkspacePath $Workspace '.spec/design'
    $count = 0
    if (Test-Path -LiteralPath $designDir -PathType Container) {
        $count = (Get-ChildItem -LiteralPath $designDir -Directory | Measure-Object).Count
    }

    if ($count -ge 2) {
        Write-Pass "Collaborators: $count"
        return
    }

    Write-Skip "Only $count collaborator(s)"
}

function Test-UpdateNew {
    param([string]$Workspace)

    Write-Section 'Test 03: Update — New File'
    $memberCode = (& git -C $Workspace config spec.member-code 2>$null).Trim()
    if (-not $memberCode) {
        Write-Skip 'No identity'
        return
    }

    $designDir = Get-WorkspacePath $Workspace ".spec/design/$memberCode"
    if (Test-Path -LiteralPath $designDir -PathType Container) {
        $count = (Get-ChildItem -LiteralPath $designDir -Recurse -File -Filter '*.md' | Measure-Object).Count
        if ($count -gt 0) {
            Write-Pass "$count file(s) in .spec/design/$memberCode"
        } else {
            Write-Fail "Empty: .spec/design/$memberCode"
        }
    } else {
        Write-Fail "Missing: .spec/design/$memberCode"
    }

    Assert-FileExists $Workspace '.spec/last-sync.json'
}

function Test-ReviewConflict {
    param([string]$Workspace)

    Write-Section 'Test 05: Review — Conflict'
    $divergences = Get-WorkspacePath $Workspace '.spec/DIVERGENCES.md'
    if (-not (Test-Path -LiteralPath $divergences -PathType Leaf)) {
        Write-Skip 'No DIVERGENCES.md'
        return
    }

    Assert-FileContains $Workspace '.spec/DIVERGENCES.md' 'D-001'
    Assert-FileExists $Workspace '.spec/last-review.json'
}

function Test-AlignPropose {
    param([string]$Workspace)

    Write-Section 'Test 06: Align — Propose'
    $divergences = Get-WorkspacePath $Workspace '.spec/DIVERGENCES.md'
    if (-not (Test-Path -LiteralPath $divergences -PathType Leaf)) {
        Write-Skip 'No DIVERGENCES.md'
        return
    }

    if (Select-String -Path $divergences -SimpleMatch 'proposed' -Quiet) {
        Write-Pass 'Proposed found'
        Assert-FileContains $Workspace '.spec/DIVERGENCES.md' 'Proposer'
        return
    }

    Write-Skip 'No proposed divergences'
}

function Test-AlignApprove {
    param([string]$Workspace)

    Write-Section 'Test 07: Align — Approve Proposal'
    $divergences = Get-WorkspacePath $Workspace '.spec/DIVERGENCES.md'
    if (-not (Test-Path -LiteralPath $divergences -PathType Leaf)) {
        Write-Skip 'No DIVERGENCES.md'
        return
    }

    if (Select-String -Path $divergences -SimpleMatch 'proposed' -Quiet) {
        Write-Pass 'Proposed divergence found'
        Assert-FileContains $Workspace '.spec/DIVERGENCES.md' 'Votes'
        Assert-FileContains $Workspace '.spec/DIVERGENCES.md' 'approve'
        $decisionsDir = Get-WorkspacePath $Workspace '.spec/decisions'
        if (-not (Test-Path -LiteralPath $decisionsDir -PathType Container)) {
            Write-Pass 'No decision files before Lead finalization'
        } else {
            Write-Fail 'Decision files exist before Lead finalization'
        }
        return
    }

    Write-Skip 'No proposed divergences'
}

function Test-AlignFinalize {
    param([string]$Workspace)

    Write-Section 'Test 11: Align — Lead Finalize'
    $divergences = Get-WorkspacePath $Workspace '.spec/DIVERGENCES.md'
    if (-not (Test-Path -LiteralPath $divergences -PathType Leaf)) {
        Write-Skip 'No DIVERGENCES.md'
        return
    }

    if (Select-String -Path $divergences -SimpleMatch 'resolved' -Quiet) {
        Write-Pass 'Resolved divergence found'
        Assert-DirExists $Workspace '.spec/decisions'
        $decisionDir = Get-WorkspacePath $Workspace '.spec/decisions'
        $count = (Get-ChildItem -LiteralPath $decisionDir -File -Filter 'D-*.md' -ErrorAction SilentlyContinue | Measure-Object).Count
        if ($count -gt 0) {
            Write-Pass "Decision files: $count"
        } else {
            Write-Fail 'No decision files'
        }
        Assert-FileContains $Workspace '.spec/THESIS.md' 'Decision Log'
        return
    }

    Write-Skip 'No resolved divergences'
}

function Test-Status {
    param([string]$Workspace)

    Write-Section 'Test 10: Status — Dashboard inputs'
    Assert-FileExists $Workspace '.spec/COLLABORATORS.md'
    Assert-FileExists $Workspace '.spec/INDEX.md'
}

function Test-PushDrift {
    param([string]$Workspace)

    Write-Section 'Test 09: Push — Drift'
    $lastSync = Get-WorkspacePath $Workspace '.spec/last-sync.json'
    if (-not (Test-Path -LiteralPath $lastSync -PathType Leaf)) {
        Write-Skip 'No last-sync.json'
        return
    }

    try {
        Get-Content -LiteralPath $lastSync -Raw | ConvertFrom-Json | Out-Null
        Write-Pass 'Valid JSON'
    } catch {
        Write-Fail 'Invalid JSON'
    }
}

function Test-DivergenceFixtures {
    Write-Section 'Test 12: Divergence Fixture Structure (Windows wrapper)'
    Invoke-Tool 'Proposed divergence fixture validated' 'node' @(
        (Get-RepoPath 'tests/validate-divergences.js'),
        (Get-RepoPath 'tests/fixtures/divergences-proposed.md'),
        'proposed'
    ) -Quiet
    Invoke-Tool 'Resolved divergence fixture validated' 'node' @(
        (Get-RepoPath 'tests/validate-divergences.js'),
        (Get-RepoPath 'tests/fixtures/divergences-resolved.md'),
        'resolved'
    ) -Quiet
}

function Test-TranscriptFixtures {
    Write-Section 'Test 13: Transcript Marker Fixtures (Windows wrapper)'
    Invoke-Tool 'Init founder transcript fixture validated' 'node' @(
        (Get-RepoPath 'tests/validate-divergences.js'),
        'transcript',
        '01-init-founder',
        (Get-RepoPath 'tests/transcripts/fixtures/01-init-founder.txt')
    ) -Quiet
    Invoke-Tool 'Review conflict transcript fixture validated' 'node' @(
        (Get-RepoPath 'tests/validate-divergences.js'),
        'transcript',
        '05-review-conflict',
        (Get-RepoPath 'tests/transcripts/fixtures/05-review-conflict.txt')
    ) -Quiet
    Invoke-Tool 'Align propose transcript fixture validated' 'node' @(
        (Get-RepoPath 'tests/validate-divergences.js'),
        'transcript',
        '06-align-propose',
        (Get-RepoPath 'tests/transcripts/fixtures/06-align-propose.txt')
    ) -Quiet
    Invoke-Tool 'Align approve transcript fixture validated' 'node' @(
        (Get-RepoPath 'tests/validate-divergences.js'),
        'transcript',
        '07-align-approve',
        (Get-RepoPath 'tests/transcripts/fixtures/07-align-approve.txt')
    ) -Quiet
    Invoke-Tool 'Align finalize transcript fixture validated' 'node' @(
        (Get-RepoPath 'tests/validate-divergences.js'),
        'transcript',
        '11-align-finalize',
        (Get-RepoPath 'tests/transcripts/fixtures/11-align-finalize.txt')
    ) -Quiet
}

function Initialize-SharedSmokeWorkspace {
    param([string]$Workspace)

    Set-WorkspaceFile $Workspace '.spec/RULES.md' @(
        '# SpecTeam Rules',
        '',
        '- Work through the shared SpecTeam workflow.',
        '- Do not push directly to `main`.',
        '- Resolve divergences through review and align before changing THESIS.'
    )

    Set-WorkspaceFile $Workspace '.spec/INDEX.md' @(
        '# SpecTeam Index',
        '',
        '- `.spec/COLLABORATORS.md`',
        '- `.spec/THESIS.md`',
        '- `.spec/DIVERGENCES.md`',
        '- `.spec/SIGNALS.md`',
        '- `.spec/decisions/`'
    )

    Set-WorkspaceFile $Workspace '.spec/last-sync.json' @(
        '{',
        '  "memberCode": "alice",',
        '  "syncedAt": "2026-04-20T09:30:00Z",',
        '  "source": ".spec/design/alice/payment-architecture.md"',
        '}'
    )

    Set-WorkspaceFile $Workspace '.spec/last-review.json' @(
        '{',
        '  "reviewedAt": "2026-04-20T10:00:00Z",',
        '  "divergenceCount": 4,',
        '  "head": "HEAD"',
        '}'
    )

    & git -C $Workspace config spec.member-code alice
    & git -C $Workspace config spec.main-branch main

    if ($LASTEXITCODE -ne 0) {
        Write-Error 'Failed to configure smoke workspace git keys.'
        exit 1
    }
}

function Prepare-DemoThreeWayWorkspace {
    Write-Section 'Preparing smoke workspace: demo-3-three-way'

    $demoScript = Get-RepoPath 'tests/mock-scenarios/demo-3-three-way/simulate-3-agents.ps1'
    Invoke-Tool 'Rebuilt demo-3 three-way workspace' 'pwsh' @('-NoProfile', '-File', $demoScript, '-Clean') -Quiet

    return (Get-RepoPath 'tests/mock-scenarios/demo-3-three-way/workspace')
}

function Prepare-AssertOnlySmokeWorkspace {
    Write-Section 'Preparing smoke workspace: assert-only'

    $workspace = Prepare-DemoThreeWayWorkspace
    Initialize-SharedSmokeWorkspace $workspace

    Write-Host "  Smoke workspace ready: $workspace"
    return $workspace
}

function Prepare-ProposedStateSmokeWorkspace {
    Write-Section 'Preparing smoke workspace: proposed-state'

    $workspace = Prepare-DemoThreeWayWorkspace
    Initialize-SharedSmokeWorkspace $workspace

    $decisionsDir = Get-WorkspacePath $workspace '.spec/decisions'
    if (Test-Path -LiteralPath $decisionsDir -PathType Container) {
        Remove-Item -LiteralPath $decisionsDir -Recurse -Force
    }

    Set-WorkspaceFile $workspace '.spec/DIVERGENCES.md' @(
        '# SpecTeam Divergence Registry',
        '',
        '## Proposed',
        '',
        '### D-001: Architecture Style',
        '**Status**: `proposed` 🟡',
        '**Parties**: alice, bob, carol',
        '**Nature**: architecture direction',
        '**Priority**: blocking',
        '**Found at**: review @ `HEAD` (2026-04-20)',
        '**Proposer (Lead)**: alice',
        '**Proposed at**: align @ `HEAD` (2026-04-20)',
        '**Proposed decision**: Adopt Carol''s serverless approach, but keep PayPal support through Step Functions orchestration.',
        '**Reasoning**: Serverless preserves scaling advantages while keeping commercially important payment coverage.',
        '',
        '**Votes**:',
        '- alice: `propose`',
        '- bob: `approve`',
        '- carol: `approve`',
        '',
        '_Awaiting reviews from others. The Proposer will finalize when consensus is reached._'
    )

    Set-WorkspaceFile $workspace '.spec/THESIS.md' @(
        '# SpecTeam Project: Payment System',
        '',
        '## North Star',
        'Design the payment processing system for our e-commerce platform.',
        '',
        '## Decision Log',
        '*(No decisions yet)*'
    )

    Set-WorkspaceFile $workspace '.spec/SIGNALS.md' @(
        '# SpecTeam Signals',
        '',
        '- [2026-04-20] D-001 reached team consensus and is awaiting Lead finalization.'
    )

    Write-Host "  Smoke workspace ready: $workspace"
    return $workspace
}

function Resolve-SmokeWorkspace {
    param([string]$Name)

    switch ($Name) {
        'assert-only' {
            return Prepare-AssertOnlySmokeWorkspace
        }
        'demo-3-three-way' {
            return Prepare-DemoThreeWayWorkspace
        }
        'proposed-state' {
            return Prepare-ProposedStateSmokeWorkspace
        }
        default {
            Write-Error "Unknown smoke workspace: $Name"
            exit 1
        }
    }
}

function Setup-MockWorkspace {
    Write-Section 'Setup mock workspace'

    $workspace = Join-Path ([System.IO.Path]::GetTempPath()) ([System.IO.Path]::GetRandomFileName())
    New-Item -ItemType Directory -Path $workspace | Out-Null

    Invoke-Tool 'Initialized mock git repository' 'git' @('-C', $workspace, 'init', '-b', 'main') -Quiet
    Invoke-Tool 'Created initial empty commit' 'git' @('-C', $workspace, 'commit', '--allow-empty', '-m', 'init') -Quiet

    $aliceDir = Join-Path $workspace 'design-alice'
    $bobDir = Join-Path $workspace 'design-bob'
    New-Item -ItemType Directory -Path $aliceDir | Out-Null
    New-Item -ItemType Directory -Path $bobDir | Out-Null

    Copy-Item -Path (Join-Path (Get-RepoPath 'tests/mock-scenarios/demo-1-conflict/alice') '*.md') -Destination $aliceDir
    Copy-Item -Path (Join-Path (Get-RepoPath 'tests/mock-scenarios/demo-1-conflict/bob') '*.md') -Destination $bobDir

    Invoke-Tool 'Committed mock design documents' 'git' @('-C', $workspace, 'add', '.') -Quiet
    Invoke-Tool 'Recorded mock design document snapshot' 'git' @('-C', $workspace, 'commit', '-m', 'add mock docs') -Quiet

    Write-Host "  Workspace: $workspace"
    Write-Host "  Next: Set-Location '$workspace'; run /spec-init"
}

function Write-Summary {
    Write-Section 'Summary'
    Write-Host "  PASS: $pass  FAIL: $fail  SKIP: $skip"
    if ($fail -gt 0) {
        Write-Host '  Failures:' -ForegroundColor Red
        foreach ($message in $errors) {
            Write-Host "    - $message"
        }
        exit 1
    }
}

function Invoke-StatefulTest {
    param(
        [string]$Name,
        [string]$Workspace
    )

    switch ($Name) {
        'init-founder' { Test-InitFounder $Workspace }
        'init-join' { Test-InitJoin $Workspace }
        'update-new' { Test-UpdateNew $Workspace }
        'review-conflict' { Test-ReviewConflict $Workspace }
        'align-propose' { Test-AlignPropose $Workspace }
        'align-approve' { Test-AlignApprove $Workspace }
        'align-finalize' { Test-AlignFinalize $Workspace }
        'status' { Test-Status $Workspace }
        'push-drift' { Test-PushDrift $Workspace }
        default { Write-Error "Unknown stateful test: $Name"; exit 1 }
    }
}

if ($Setup) {
    Setup-MockWorkspace
    Write-Summary
    exit 0
}

if ($AssertOnly) {
    $workspace = Get-TargetWorkspace
    $specDir = Get-WorkspacePath $workspace '.spec'
    if (-not (Test-Path -LiteralPath $specDir -PathType Container)) {
        Write-Error 'No .spec/ — use -Setup first, point -WorkspacePath to a prepared SpecTeam workspace, or use -SmokeWorkspace assert-only.'
        exit 1
    }

    Test-InitFounder $workspace
    Test-InitJoin $workspace
    Test-UpdateNew $workspace
    Test-ReviewConflict $workspace
    Test-AlignPropose $workspace
    Test-AlignApprove $workspace
    Test-AlignFinalize $workspace
    Test-Status $workspace
    Test-PushDrift $workspace
    Write-Summary
    exit 0
}

switch ($Test) {
    'all' {
        Test-DivergenceFixtures
        Test-TranscriptFixtures
    }
    'divergence-fixtures' { Test-DivergenceFixtures }
    'transcript-fixtures' { Test-TranscriptFixtures }
    default {
        Invoke-StatefulTest $Test (Get-TargetWorkspace)
    }
}

Write-Summary