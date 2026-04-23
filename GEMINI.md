# SpecTeam - Gemini CLI Context

This project, **SpecTeam**, is a Git-native workflow for AI-native spec review and decision alignment. It helps teams detect divergence across PRDs, architecture docs, and proposals, then turn one decision into a shared source of truth.

## Project Overview

- **Core Mission**: Help product and engineering teams detect spec divergence, resolve decisions faster, and keep humans and AI tools aligned.
- **Primary Mechanism**: Uses Git as the transport layer and a `.spec/` directory as the single source of truth for normalized design documents and collaboration metadata.
- **Key Concepts**:
  - **Member Code**: A unique identifier for each collaborator (e.g., `alice`, `bob`).
  - **THESIS.md**: The project's "North Star" goal and decision log.
  - **Divergences**: Detected inconsistencies between different collaborators' documents, managed via a Propose → Approve workflow.
  - **Normalized Documents**: Copies of local source documents stored in `.spec/design/{member-code}/` for cross-team sharing.

## Technical Architecture

The project is structured as a collection of "skills" (prompts) located in `plugin/skills/`.

- **`.spec/` Directory Structure**:
  - `COLLABORATORS.md`: Registry of members and their document directories.
  - `THESIS.md`: Project goal and authoritative decision log.
  - `DIVERGENCES.md`: Registry of all open, proposed, and resolved conflicts.
  - `INDEX.md`: Auto-generated index of all documents.
  - `design/`: Contains subdirectories for each collaborator's normalized docs.
  - `decisions/`: Detailed instruction files for resolved divergences.
  - `last-*.json`: Cache files for tracking hashes and review anchors.

## Operational Commands (Skills)

These commands are intended to be executed by the AI agent. Most require an identity (`spec-whoami`) and must be run on the designated "Main Branch" (Branch Guard).

### Initialization & Identity
- `/spec-init`: Initialize a new project or join an existing one.
- `/spec-whoami`: Check or bind the local machine's collaborator identity.

### Daily Workflow
- `/spec-pull`: Pull remote changes, parse them, and alert on pending approvals.
- `/spec-update`: Sync local source documents to the `.spec/` directory and verify action items.
- `/spec-push`: Push changes to the remote repository after a divergence check.

### Review & Alignment
- `/spec-review`: Analyze all collaborators' documents for divergences against the THESIS.
- `/spec-align`: Resolve divergences using a two-phase Propose → Approve process.
- `/spec-diff`: Inspect detailed changes grouped by collaborator.

### Utility & Status
- `/spec-status`: Comprehensive dashboard of the project's collaboration state.
- `/spec-suggest`: AI-driven suggestions based on recent diffs and divergence states.
- `/spec-parse`: Scan `.spec/` documents and update the `INDEX.md`.
- `/spec-archive`: Freeze and archive superseded proposals.

## Development & Collaboration Rules

1. **Source documents outside `.spec/` are READ-ONLY** for the SpecTeam workflow.
2. **Identity Guard**: Always verify `git config spec.member-code` before any operation.
3. **Branch Guard**: Operations (except `init`) must only run on the branch recorded in `git config spec.main-branch`.
4. **No Direct Edits**: Do not manually edit files like `DIVERGENCES.md` or `INDEX.md`; use the skills to update them.
5. **Conflict Resolution**: Divergences must go through the `review` -> `align` (propose) -> `align` (approve) cycle.

## Project Structure

- `plugin/skills/`: The prompt definitions for each SpecTeam command.
- `docs/design/`: Example documents and requirements for SpecTeam itself.
- `tests/mock-scenarios/`: Mock data for testing conflict resolution workflows.
- `SPECTEAM.md`: A standalone, all-in-one prompt version of the plugin.
