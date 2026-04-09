---
name: phoenix-pull
description: "Pull remote changes and auto-analyze diffs by collaborator. Fetches latest from remote, shows what each team member changed, triggers a parse, and alerts if any proposed divergences are awaiting your approval."
user-invocable: true
---

# Skill: pull

Pull remote changes and provide collaborator-aware diff analysis.

## Parameters

None.

## Execution Steps

1. Read `git config phoenix.member-code` to determine current identity (`{me}`). Apply identity guard.
2. Run `git status` and display the result.
3. Run `git pull --rebase` (or `git submodule update --remote` if in submodule mode).
4. Run `git diff HEAD~1..HEAD -- .phoenix/` and generate a summary **grouped by member code**:
   - Which collaborator's files changed
   - Files added/modified/deleted
   - Key content changes (line additions/deletions)
5. **Automatically trigger `/phoenix-parse`** (execute the parse skill inline).

### Step 6 — Pending approval alert

1. Read `.phoenix/DIVERGENCES.md` if it exists.
2. Find all divergences with status `proposed` where the awaiting party is `{me}`.
3. If any found, output a prominent alert:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟡 {N} divergence proposal(s) awaiting your confirmation:

  D-{N}: {title} — {proposer} proposes: {summary}
  D-{N}: {title} — {proposer} proposes: {summary}

Run /phoenix-align D-{N} to review details and confirm or reject.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

4. Also note any new `open` divergences and any divergences that moved to `resolved` (requiring source doc updates) since last pull.
5. For `resolved` divergences with pending Action Items for `{me}`, output a prompt:
   ```
   📋 {N} resolved divergence(s) require source document updates from you:
     D-{N}: {title} — update `{source file}`: {change description}
   Run /phoenix-update to sync and auto-verify.
   ```

### Step 7 — Source drift hint

1. Read `.phoenix/last-sync.json` if it exists.
2. For each source file, check if its current hash differs from the stored hash.
3. If source files have changed locally since last sync, output a soft hint:

```
💡 Source drift detected: {N} local source file(s) changed since last sync.
   Run /phoenix-update to sync changes into the workspace.
```

4. This is informational only — does not block.

8. Output: pull result + diff summary (by collaborator) + parse changes + approval alerts + source drift hint.
