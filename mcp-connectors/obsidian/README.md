# SpecTeam Obsidian Connector

This Model Context Protocol (MCP) connector enables SpecTeam to import design documents directly from a local Obsidian vault.

## Status

🟢 Active / Reference Implementation available.

## Features

- Read Obsidian Markdown notes (`obsidian_read_note`)
- Search across the vault (`obsidian_search`)
- List folders and notes (`obsidian_list_folder`)
- Automatic conversion of Obsidian wikilinks `[[Link]]` to standard Markdown links.

## Prerequisites

- Node.js v18 or later

## Setup

1. Install dependencies:

   ```bash
   cd mcp-connectors/obsidian
   npm install
   ```

2. Set up the environment variable for your Obsidian vault path:

   ```bash
   export OBSIDIAN_VAULT_PATH="/path/to/your/obsidian/vault"
   ```

3. Run the MCP server:

   ```bash
   node index.js
   ```

## Usage in SpecTeam

You can configure `spec-import` to use this connector by mapping the MCP tools to your workspace environment variables.

When using the `spec-import` skill with the Obsidian connector, you can specify notes by their relative path within the vault.

```bash
# Example invocation (conceptual)
/spec-import --connector obsidian --note-path "Architecture/Database.md"
```
