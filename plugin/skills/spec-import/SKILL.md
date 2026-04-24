---
name: spec-import
short-description: "Import external docs via the host AI tool's fetch capability"
description: "Import design documents from an external URL or MCP resource into the local .spec/design/ directory. Relies on whatever fetching ability the host AI tool already has (e.g. Claude Code web fetch, an MCP resource the user has configured) — SpecTeam does not ship connectors. Use this to sync external context into the Git-native workflow."
user-invocable: true
argument-hint: "[source_url or mcp_resource_id]"
triggers: [spec-parse]
callable-by: []
estimated-tokens:
  context: 2500
  skill: 500
  data-read: variable
  output: 400
  total: ~3400+ (plus ~4700 for auto-triggered parse)
---

# Skill: import

Fetch external documents (via MCP or HTTP) and normalize them into the local SpecTeam workflow state.

## Parameters

- `$ARGUMENTS`: The source URL (e.g., Notion page link) or MCP resource URI.

## Execution Steps

### Step 1 — Identity & pre-flight
1. Read `git config spec.member-code` to determine current identity `{code}`. Apply identity guard.
2. Run `git status` and display the result.

### Step 2 — Fetch Content
1. If `$ARGUMENTS` is empty, output:
   ```
   ⚠️ Please provide an external document URL or MCP resource ID. Example: /spec-import https://notion.so/my-design-doc
   ```
   Stop execution.
2. Use available tools (e.g., MCP readResource, web fetch, or API calls) to retrieve the content of the specified `$ARGUMENTS`.
3. Convert the fetched content into Markdown format.

### Step 3 — Normalize and Save
1. Generate a descriptive filename based on the content title (e.g., `notion-auth-design.md`).
2. Prepend the `<!-- Spec Normalized Document -->` header and metadata (Source URL, Import Date).
3. Save the file to `.spec/design/{code}/{filename}`.

### Step 4 — Commit and Next Steps
1. Run `git add .spec/design/{code}/{filename}`.
2. Commit with message: `"[SpecTeam] import — {code} imported external doc {filename}"`
3. Automatically trigger `/spec-parse` to update the `INDEX.md`.
4. Output:
   ```
   ✅ External document successfully imported to .spec/design/{code}/{filename}
   Recommended next step: run /spec-review to check for divergences with other proposals.
   ```
