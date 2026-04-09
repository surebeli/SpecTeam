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
🟡 有 {N} 个分歧提议等待您确认:

  D-{N}: {title} — {proposer} 提议: {summary}
  D-{N}: {title} — {proposer} 提议: {summary}

运行 /phoenix-align D-{N} 查看详情并确认或拒绝。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

4. Also note any new `open` divergences and any divergences that moved to `resolved` (requiring source doc updates) since last pull.
5. For `resolved` divergences with pending Action Items for `{me}`, output a prompt:
   ```
   📋 有 {N} 个已决议分歧需要您更新源文档:
     D-{N}: {title} — 需更新 `{source file}`: {change description}
   运行 /phoenix-update 同步后将自动验证。
   ```

### Step 7 — Source drift hint

1. Read `.phoenix/last-sync.json` if it exists.
2. For each source file, check if its current hash differs from the stored hash.
3. If source files have changed locally since last sync, output a soft hint:

```
💡 检测到本地源文档有变更 ({N} 个文件)，尚未同步到 .phoenix/。
   运行 /phoenix-update 将源文档变更同步到工作区。
```

4. This is informational only — does not block.

8. Output: pull result + diff summary (by collaborator) + parse changes + approval alerts + source drift hint.
