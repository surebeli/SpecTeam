---
name: phoenix-whoami
short-description: "Show or set collaborator identity"
description: "Show or set your PhoenixTeam identity on this machine. Use this when switching machines, cloning on a new device, or logging in from multiple machines. Reads existing collaborators from COLLABORATORS.md and lets you bind to your existing member code."
user-invocable: true
triggers: []
callable-by: []
estimated-tokens:
  context: 2500
  skill: 800
  data-read: 200
  output: 300
  total: ~3800
---

# Skill: whoami

Show or bind the current machine's PhoenixTeam identity.

## Execution Steps

### Step 1 — Check current identity

Run `git config phoenix.member-code` and capture output as `{current_code}`.

**If `{current_code}` is set**, output:

---

**[PhoenixTeam Current Identity]**

Identity bound on this machine: `{current_code}`

To switch, reply with a new code or select from the list below; press Enter to keep unchanged.

{List all members from COLLABORATORS.md, format shown below}

---

**Stop and wait for the user to reply.**
- If the user presses Enter (empty reply) → keep `{current_code}`, output `Identity unchanged: {current_code}` and exit.
- If the user replies with a code → proceed to Step 2.

---

**If `{current_code}` is NOT set (new machine / first clone)**, read `.phoenix/COLLABORATORS.md` and list all known members:

---

**[PhoenixTeam Identity Binding]**

No collaborator identity bound on this machine. Please select your code:

{Members loaded from COLLABORATORS.md, format:}
1. `alice` — .phoenix/design/alice/ (joined 2026-04-08)
2. `bob`   — .phoenix/design/bob/  (joined 2026-04-08)
3. I am a new collaborator — use a new code

Enter a number or type your code directly:

---

**Stop and wait for the user to reply.**

### Step 2 — Bind identity

After the user replies:

- If reply is a number matching a listed member → use that member's code.
- If reply is "3" or indicates a new collaborator → ask for a new code (same flow as `phoenix-init` Step 1).
- If reply is a raw string → sanitize: lowercase, spaces→`-`, keep only `[a-z0-9_-]`.

Run:
```
git config --local phoenix.member-code {code}
```

### Step 3 — Also bind main branch if missing

After binding member-code, check `git config phoenix.main-branch`:

- **Already set** → skip, nothing to do.
- **Empty** → attempt auto-recovery:
  1. Read `Main Branch` field from `.phoenix/COLLABORATORS.md`.
  2. If found → run `git config --local phoenix.main-branch {main_branch}` and note it in the confirmation output.
  3. If not found → note that main branch is unbound; suggest running `/phoenix-init`.

### Step 4 — Confirm

Output:

---

**[Identity Binding Complete]**

This machine is now bound as: `{code}`

- Source: `.git/config` (local only — not committed to the repository)
- Main branch: `{main_branch}` (bound) / ⚠️ Not bound — please run `/phoenix-init`
- All subsequent skills (pull / push / review / align, etc.) will run under this identity

Recommended next step: run `/phoenix-status` to view workspace state.

---
