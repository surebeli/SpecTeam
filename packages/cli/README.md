# SpecTeam CLI

> **Companion CLI for SpecTeam**

SpecTeam is a Git-native workflow for AI-native spec review and decision alignment. This lightweight Node CLI provides a local UX layer for installing SpecTeam, checking divergence state, and running the `spec-*` command surface locally.

**Note:** This CLI contains **no business logic**. All divergence resolution, document parsing, and git operations are handled securely by your AI assistant (e.g. Claude Code or Codex) using the SpecTeam Prompts.

## Installation

```bash
npm install -g specteam-cli
```

## Usage

### 1. Initialize an AI Project

```bash
spec init
```
Detects your git repository, creates the `.spec/` foundation, and guides you to trigger `/spec-init` in your AI assistant.

### 2. Install AI Skills

```bash
spec install --global
```
Automatically copies all SpecTeam `.md` prompts to your `~/.claude/commands` directory, eliminating the need to copy folders manually. (Omit `--global` to install locally to your current project's `.claude/commands` folder).

### 3. Check Workflow Status

```bash
spec status
```
A highly visual, zero-token way to view the state of your `.spec/DIVERGENCES.md`. See exactly how many conflicts are `Open 🔴`, `Proposed 🟡`, or `Resolved ✅` without burning AI tokens to summarize them.

### 4. Emergency Conflict Help

```bash
spec sos
```
If your `git pull` or `git push` fails due to a Git Tree Merge Conflict, run this command. It will scan your git tree, highlight the conflicted files, and instruct you on how to trigger the AI-powered `/spec-sos` auto-resolution tool.

## License
MIT
