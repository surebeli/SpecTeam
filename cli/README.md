# PhoenixTeam CLI

> **Companion CLI for PhoenixTeam AI Document Collaboration Plugin**

PhoenixTeam is a pure-prompt, zero-code collaboration protocol for multi-agent AI teams. This lightweight Node CLI provides a local "UX layer" to make installing and checking the status of your AI-driven collaboration seamless.

**Note:** This CLI contains **no business logic**. All divergence resolution, document parsing, and git operations are handled securely by your AI assistant (e.g. Claude Code or Codex) using the PhoenixTeam Prompts.

## Installation

```bash
npm install -g phoenixteam-cli
```

## Usage

### 1. Initialize an AI Project

```bash
phoenix init
```
Detects your git repository, creates the `.phoenix/` foundation, and guides you to trigger `/phoenix-init` in your AI assistant.

### 2. Install AI Skills

```bash
phoenix install --global
```
Automatically copies all PhoenixTeam `.md` prompts to your `~/.claude/commands` directory, eliminating the need to copy folders manually. (Omit `--global` to install locally to your current project's `.claude/commands` folder).

### 3. Check Collaboration Status

```bash
phoenix status
```
A highly visual, zero-token way to view the state of your `.phoenix/DIVERGENCES.md`. See exactly how many conflicts are `Open 🔴`, `Proposed 🟡`, or `Resolved ✅` without burning AI tokens to summarize them.

### 4. Emergency Conflict Help

```bash
phoenix sos
```
If your `git pull` or `git push` fails due to a Git Tree Merge Conflict, run this command. It will scan your git tree, highlight the conflicted files, and instruct you on how to trigger the AI-powered `/phoenix-sos` auto-resolution tool.

## License
MIT
