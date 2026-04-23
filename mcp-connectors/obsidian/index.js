/**
 * SpecTeam Obsidian MCP Server — Reference Implementation
 *
 * A Model Context Protocol server that bridges local Obsidian vaults
 * with SpecTeam's spec-import skill.
 *
 * Prerequisites:
 *   npm install @modelcontextprotocol/sdk
 *
 * Usage:
 *   OBSIDIAN_VAULT_PATH=/path/to/vault node index.js
 */

import fs from 'fs/promises';
import path from 'path';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// --- Config ---
const OBSIDIAN_VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH;
if (!OBSIDIAN_VAULT_PATH) {
  console.error("Error: OBSIDIAN_VAULT_PATH environment variable is required.");
  process.exit(1);
}

// Ensure vault path is absolute
const vaultPath = path.resolve(OBSIDIAN_VAULT_PATH);

// --- Helpers ---
async function findNotes(dir, query = null) {
  const results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    // Skip hidden directories like .obsidian
    if (entry.name.startsWith('.')) continue;

    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(vaultPath, fullPath);

    if (entry.isDirectory()) {
      results.push(...(await findNotes(fullPath, query)));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const stats = await fs.stat(fullPath);
      let match = true;

      if (query) {
        match = false;
        if (entry.name.toLowerCase().includes(query.toLowerCase())) {
          match = true;
        } else {
          // simple content search
          const content = await fs.readFile(fullPath, 'utf-8');
          if (content.toLowerCase().includes(query.toLowerCase())) {
            match = true;
          }
        }
      }

      if (match) {
        results.push({
          title: entry.name.replace(/\.md$/, ''),
          path: relativePath,
          last_edited: stats.mtime.toISOString(),
        });
      }
    }
  }

  return results;
}

// --- MCP Server Setup ---

const server = new Server(
  { name: "spec-obsidian-connector", version: "0.1.0" },
  { capabilities: { resources: {}, tools: {} } }
);

// --- Tools ---

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "obsidian_read_note",
      description: "Fetch an Obsidian note by path.",
      inputSchema: {
        type: "object",
        properties: {
          note_path: { type: "string", description: "Relative path to note" },
        },
        required: ["note_path"],
      },
    },
    {
      name: "obsidian_list_folder",
      description: "List notes in an Obsidian folder.",
      inputSchema: {
        type: "object",
        properties: {
          folder_path: { type: "string", default: "" },
        },
      },
    },
    {
      name: "obsidian_search",
      description: "Search across the Obsidian vault.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string" },
        },
        required: ["query"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "obsidian_read_note": {
      const notePath = path.join(vaultPath, args.note_path);
      if (!notePath.startsWith(vaultPath)) throw new Error("Invalid path");
      
      const content = await fs.readFile(notePath, 'utf-8');
      
      // Basic normalization: Replace Obsidian WikiLinks [[Link]] with standard markdown
      const normalizedContent = content.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
        const parts = p1.split('|');
        const link = parts[0];
        const text = parts[1] || link;
        return `[${text}](${link}.md)`;
      });

      return { content: [{ type: "text", text: normalizedContent }] };
    }

    case "obsidian_list_folder": {
      const dirPath = path.join(vaultPath, args.folder_path || "");
      if (!dirPath.startsWith(vaultPath)) throw new Error("Invalid path");

      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const results = entries
        .filter(e => !e.name.startsWith('.') && (e.isDirectory() || e.name.endsWith('.md')))
        .map(e => ({
          name: e.name,
          type: e.isDirectory() ? 'folder' : 'note',
          path: path.relative(vaultPath, path.join(dirPath, e.name)),
        }));

      return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
    }

    case "obsidian_search": {
      const results = await findNotes(vaultPath, args.query);
      return { content: [{ type: "text", text: JSON.stringify(results.slice(0, 50), null, 2) }] };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// --- Resources ---

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "obsidian://vault/recent",
      name: "Recent Obsidian Notes",
      description: "List recently modified notes",
      mimeType: "application/json",
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === "obsidian://vault/recent") {
    const allNotes = await findNotes(vaultPath);
    // Sort by last edited, descending
    allNotes.sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited));
    const recent = allNotes.slice(0, 10);
    return { contents: [{ uri: request.params.uri, mimeType: "application/json", text: JSON.stringify(recent, null, 2) }] };
  }
  throw new Error(`Unknown resource: ${request.params.uri}`);
});

// --- Start ---

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`SpecTeam Obsidian MCP Server running on stdio for vault: ${vaultPath}`);
}

main().catch(console.error);
