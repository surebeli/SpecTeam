# PhoenixTeam Enhanced Product Requirements Document (PRD)

## Product Positioning

PhoenixTeam is a distributed AI team context consistency infrastructure that solves the current issues of fragmentation, design divergence, and progress black boxes across multiple AI tools (Claude, Cursor, Copilot, etc.).

## Core Value

- **Design Phase**: Multi-Agent parallel brainstorming → automatic arbitration and convergence → decision freezing and broadcasting (takes effect across all tools in ≤ 5 minutes)
- **Development Phase**: Real-time progress visibility, technology stack synchronization, blocker broadcasting (minute-level)
- **Cross-Tool / BYO Agent**: Uses MCP as the single source of truth, forcing all tools (Claude has highest priority) to inherit THESIS.md / RULES.md / SIGNALS.md

## Functional Modules

### 1. Human Arbitration Center UI (Web Dashboard)

- Visual proposal comparison
- AI suggestion merging + one-click approval
- Time travel query
- Audit log

### 2. Agent SDK

- Bring-Your-Own Agent access standards (MCP + Yunxin signaling)
- Personal preference isolation
- Agent state management

### 3. Consistency Scoring

- Real-time calculation of team context consistency (0-100 points)
- Compare outputs of various Agents based on THESIS.md
- Deviation alerts

### 4. Context Grading

- none / summary / recent / full (Token optimization)
- Automatic switching by role and scenario

### 5. Extension Interfaces

- Remote Control HTTP interface (mobile query)
- Webhook notifications
- Custom arbitration rules

## Single Source of Truth

Phoenix MCP Server + Yunxin signaling + Git repository

## Performance Metrics

| Metric | Target |
|--------|--------|
| Sync Latency | ≤ 5 min (guaranteed by Yunxin) |
| New Member Onboarding | ≤ 2 min (MCP + Git clone) |
| Consistency Variance | < 5% |
| Convergence Speed | ≤ 20 minutes |
| Offline Recovery | ≤ 3 minutes |
| Conflict Reduction after Team Adoption | ≥ 70% |
