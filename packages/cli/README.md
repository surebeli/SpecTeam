# SpecTeam CLI

> **Companion CLI for SpecTeam**

SpecTeam is a Git-native workflow for AI-native spec review and decision alignment. This lightweight Node CLI provides a local UX layer for installing SpecTeam, checking divergence state, and running the `spec-*` command surface locally.

**Note:** This CLI contains no workflow business logic. Divergence resolution still runs in your AI assistant; the only deterministic local logic is the thin `spec validate` smoke command backed by the bundled `@specteam/schema` runtime.

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

### 5. Deterministic Schema Check

```bash
spec validate
spec validate --path=packages/spec-fixtures/states/clean-workspace
spec validate --json
```

Validates the recognized Phase 2 `.spec/` markdown files in the target directory using the bundled `@specteam/schema` parsers and AJV schemas. In-scope files are `COLLABORATORS.md`, `DIVERGENCES.md`, `THESIS.md`, and `decisions/*.md`. Per W1 decisions D4/D6, `SIGNALS.md` and `INDEX.md` remain out of strict schema scope and are not validated by default. Human output lists per-file pass/fail and PX-P/PX-V/PX-E codes, while `--json` emits a machine-readable report and preserves the same exit semantics: `0` when all recognized files pass, `1` when any file fails. Pointing `--path` at an existing directory with no recognized `.spec` files now fails with `PX-E009`.

## License
MIT
