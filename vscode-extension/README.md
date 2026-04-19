# PhoenixTeam VS Code Extension

> **Zero-logic visual dashboard for the PhoenixTeam AI Collaboration Protocol**

PhoenixTeam is a pure-prompt, zero-code collaboration framework for AI teams. This extension provides a stunning visual dashboard inside your IDE side-panel to instantly grasp the team's divergence state without needing to read markdown or ask an LLM.

## Features

- **Sidebar Dashboard**: Registers a new icon in the VS Code Activity Bar.
- **Real-time Status Tracking**: Instantly parses your local `.phoenix/DIVERGENCES.md` and displays:
  - 🔴 **Open** divergences (needs resolution)
  - 🟡 **Proposed** divergences (awaiting confirmation)
  - ✅ **Resolved** decisions (archived audit trail)
- **Zero Business Logic**: True to the PhoenixTeam philosophy, this IDE extension *only renders UI*. All the heavy lifting of conflict detection, decision logging, and document parsing remains entirely prompt-driven in your AI assistant (e.g. Claude Code).

## How it works

Whenever you run `/phoenix-pull` or `/phoenix-review` via your AI assistant, the `DIVERGENCES.md` file is automatically updated. Simply click the "Refresh" button in this extension to see the newest state of your team's collaboration.

## Getting Started

1. Ensure your project is initialized with PhoenixTeam (contains a `.phoenix/` folder).
2. Install this extension.
3. Click the PhoenixTeam (Branch) icon in the VS Code Activity Bar.
4. Enjoy a clear visual representation of your team's alignment!
