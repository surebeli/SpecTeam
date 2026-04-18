# Mock Scenarios for PhoenixTeam

This directory contains test data to help you quickly understand how PhoenixTeam works, especially how it handles conflicts and divergences between different AI agents or collaborators.

## Demo 1: API Design Conflict

In `demo-1-conflict/`, we have two collaborators (`alice` and `bob`) who have designed an API differently.
- `alice` proposes a traditional RESTful API.
- `bob` proposes a GraphQL API.

### How to run this demo:

1. Copy the `demo-1-conflict` folder to a new workspace.
2. Run `/phoenix-init`. When asked for document directories, provide the paths to both `alice` and `bob`'s folders.
3. Once initialized, run `/phoenix-review`.
4. Observe how the AI automatically detects the divergence (REST vs GraphQL) and generates a `DIVERGENCES.md` report.
5. Run `/phoenix-align D-001` to resolve the conflict!
