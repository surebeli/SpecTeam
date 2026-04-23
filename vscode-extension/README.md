# SpecTeam VS Code Extension

> **Visual divergence dashboard for SpecTeam**

SpecTeam is a Git-native workflow for AI-native spec review and decision alignment.

SpecTeam is focused on AI-native spec review and decision alignment. This extension gives product and engineering teams a fast visual view of divergence state inside VS Code, so they can see what is still open, what is awaiting confirmation, and what has already been resolved without reading raw markdown first.

## Features

- **Sidebar Dashboard**: Registers a SpecTeam icon in the VS Code Activity Bar.
- **Divergence Visibility**: Reads your local `.spec/DIVERGENCES.md` and displays:
  - 🔴 **Open** divergences (needs resolution)
  - 🟡 **Proposed** divergences (awaiting confirmation)
  - ✅ **Resolved** decisions (archived audit trail)
- **Action Hand-off**: Lets you trigger the `spec-align` flow directly from resolvable items.
- **Zero Business Logic**: True to the SpecTeam approach, the extension only renders UI and hands actions back to the prompt-driven workflow.

## How it works

Whenever you run `/spec-review`, `/spec-pull`, or a related workflow via your AI assistant, `.spec/DIVERGENCES.md` is updated. This extension refreshes that shared state into a side-panel view so a human can inspect what still needs review and where a decision is waiting to be aligned.

## Getting Started

1. Ensure your project is initialized with SpecTeam (contains a `.spec/` folder).
2. Install this extension.
3. Click the SpecTeam (Branch) icon in the VS Code Activity Bar.
4. Review divergence status and hand off resolution into the existing `spec-*` workflow.
