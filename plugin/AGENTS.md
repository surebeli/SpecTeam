# SpecTeam Workflow — Codex CLI Platform Context

> **Shared context**: See [SHARED-CONTEXT.md](./SHARED-CONTEXT.md) for core principles, directory layout, and output format.
> This file only contains Codex CLI specific overrides.

## Platform: Codex CLI

### Skill Invocation Format
All skills are invoked via **plugin:skill** syntax:
- `spec-team:spec-init`, `spec-team:spec-whoami`, `spec-team:spec-pull`, `spec-team:spec-push`
- `spec-team:spec-review`, `spec-team:spec-align`, `spec-team:spec-diff`
- `spec-team:spec-parse`, `spec-team:spec-update`, `spec-team:spec-status`
- `spec-team:spec-suggest`, `spec-team:spec-archive`, `spec-team:spec-import`

### Identity Guard Message
```
⚠️ Identity not bound on this machine. Please run `spec-team:spec-whoami` to bind identity before continuing.
```

### Branch Guard Recovery Message
```
⚠️ SpecTeam main branch not bound locally, and no record found in COLLABORATORS.md.
Please run `spec-team:spec-init` to re-initialize and recover branch binding.
```

### Next Step Format
Use Codex CLI format in recommendations:
- `"Recommended next step: spec-team:spec-status"`
- `"Run spec-team:spec-push to push changes"`
