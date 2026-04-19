---
name: phoenix-sos
short-description: "Emergency Git conflict resolution for PhoenixTeam"
description: "Resolves underlying Git merge conflicts in the .phoenix/ directory automatically. Designed as a fallback when pull or push operations fail due to a Git tree conflict. The AI will read the conflicted files, parse the standard <<<<<<< HEAD markers, and intelligently merge PhoenixTeam metadata (like DIVERGENCES.md, JSON caches) without losing data, then commit the resolution."
user-invocable: true
argument-hint: ""
triggers: []
callable-by: []
estimated-tokens:
  context: 2000
  skill: 2500
  data-read: variable
  output: 1000
  total: ~5500+
---

# Skill: sos

Emergency fallback to resolve raw Git merge conflicts in the `.phoenix/` directory.

## Parameters

- `$ARGUMENTS`: none

## Execution Steps

### Step 1 — Check Git Status

1. Apply identity guard. Apply branch guard.
2. Run `git status` to identify files currently in a conflicted state (both modified).
3. If there are no conflicts, output `"✅ Git tree is clean. No emergency resolution required."` and stop.
4. If there are conflicts outside of the `.phoenix/` directory, output a warning that PhoenixTeam only auto-resolves its own metadata files, and the user must resolve external files manually.

### Step 2 — Intelligent Auto-Resolution

For each conflicted file inside `.phoenix/`:

1. **Read the raw conflicted file** including the `<<<<<<< HEAD`, `=======`, and `>>>>>>>` markers.
2. **Apply file-specific resolution rules**:
   - `DIVERGENCES.md`: Never discard entries. Merge both sides. For `Open` divergences, keep both. For status transitions (e.g. one side says `open`, the other says `proposed`), the more advanced state (`resolved` > `proposed` > `open`) wins. Ensure D-xxx IDs do not duplicate; if two sides created D-004 and D-005 concurrently, safely renumber them if necessary.
   - `INDEX.md`: Re-generate the index completely based on the current tree (discard the conflicted block and run a quick parse logic or just accept one side and advise running `phoenix-parse` later).
   - `last-*.json` (e.g., `last-review.json`, `last-sync.json`): Merge the JSON keys. Keep the latest timestamp. For nested hashes, combine them.
   - `THESIS.md`: If there is a conflict in the Decision Log, merge both entries sequentially by date. If there is a conflict in the core thesis, propose a merged text that preserves both intents, but warn the user.
3. **Write the resolved content** back to the file, cleanly removing all Git conflict markers.

### Step 3 — Commit the Resolution

1. Run `git add` on the resolved files.
2. Run `git commit -m "[PhoenixTeam] sos — emergency auto-resolution of Git merge conflicts"`
3. Run `git status` to verify.

### Step 4 — Output & Next Steps

1. Output a summary of the resolved files and what logic was applied (e.g., "Merged 2 concurrent proposals in DIVERGENCES.md").
2. Recommend the user to run `/phoenix-review` and `/phoenix-parse` to ensure the state is fully synchronized.
3. Recommend running `/phoenix-push` to share the resolved state with the team.
