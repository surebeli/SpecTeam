import { CURRENT_SCHEMA_VERSION } from "../src/metadata";
import type {
  ActionItem,
  CollaboratorDocument,
  DecisionDocument,
  DivergenceDocument,
  IndexDocument,
  SignalDocument,
  ThesisDocument,
} from "../src/types";

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const schemaEnvelope = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
} as const;

function parseEnvelope(generatedAt: string) {
  return {
    ...schemaEnvelope,
    generator: "parse" as const,
    generatedAt,
  };
}

const apiCollaborators: CollaboratorDocument["members"] = [
  {
    code: "alice",
    role: "maintainer",
    sourceDirectories: ["./alice"],
    specPath: ".spec/design/alice/",
    joinedAt: "2026-04-24",
  },
  {
    code: "bob",
    role: "contributor",
    sourceDirectories: ["./bob"],
    specPath: ".spec/design/bob/",
    joinedAt: "2026-04-24",
  },
];

const paymentCollaborators: CollaboratorDocument["members"] = [
  {
    code: "alice",
    role: "maintainer",
    sourceDirectories: ["./alice"],
    specPath: ".spec/design/alice/",
    joinedAt: "2026-04-25",
  },
  {
    code: "bob",
    role: "contributor",
    sourceDirectories: ["./bob"],
    specPath: ".spec/design/bob/",
    joinedAt: "2026-04-25",
  },
  {
    code: "carol",
    role: "contributor",
    sourceDirectories: ["./carol"],
    specPath: ".spec/design/carol/",
    joinedAt: "2026-04-25",
  },
];

export const validActionItem: ActionItem = {
  owner: "bob",
  targetFile: "./design/graphql-proposal.md",
  completionState: "pending",
  requiredChanges: [
    "Replace GraphQL as the primary public contract with a compatibility-layer framing.",
  ],
  acceptanceCriterion:
    "The document states REST is the default public API and GraphQL is a compatibility layer.",
  background: "Bob proposed GraphQL as the main user-service interface.",
  decision:
    "REST remains the canonical public contract and GraphQL is only a compatibility layer.",
};

export const modernFixtures = {
  cleanWorkspace: {
    collaborator: {
      envelope: schemaEnvelope,
      mainBranch: "main",
      members: apiCollaborators,
    } satisfies CollaboratorDocument,
    thesis: {
      envelope: schemaEnvelope,
      northStar:
        "Ship a stable REST-first user API that keeps product and engineering documents aligned.",
      decisionLog: [],
    } satisfies ThesisDocument,
    signal: {
      envelope: schemaEnvelope,
      entries: [],
    } satisfies SignalDocument,
    "index-doc": {
      envelope: parseEnvelope("2026-04-24T09:00:00Z"),
      northStar:
        "Ship a stable REST-first user API that keeps product and engineering documents aligned.",
      northStarSource: "THESIS.md (last updated: init123 2026-04-24)",
      decisionLog: [],
      divergences: {
        open: 0,
        proposed: 0,
        resolved: 0,
        notes: ["✅ No pending divergences"],
      },
      signals: [],
      documentTree: [
        {
          collaborator: "alice",
          documents: [
            {
              path: "design/alice/api-design.md",
              summary: "REST-first user API baseline",
            },
          ],
        },
        {
          collaborator: "bob",
          documents: [
            {
              path: "design/bob/api-design.md",
              summary: "matching REST-first implementation notes",
            },
          ],
        },
      ],
    } satisfies IndexDocument,
  },
  conflicted: {
    divergence: {
      envelope: schemaEnvelope,
      reviewedAt: "2026-04-24T11:20:00Z",
      reviewedCommit: "abc1234",
      reviewedBy: "alice",
      entries: [
        {
          id: "D-001",
          title: "API Protocol Choice",
          status: "open",
          parties: ["alice", "bob"],
          nature: "technology choice",
          priority: "blocking",
          foundAt: "review @ abc1234 (2026-04-24)",
        },
      ],
    } satisfies DivergenceDocument,
    signal: {
      envelope: schemaEnvelope,
      entries: [
        {
          status: "open",
          source: "D-001",
          updatedAt: "2026-04-24",
          blocker: "API Protocol Choice is blocking source alignment between alice and bob.",
          message: "API Protocol Choice is blocking source alignment between alice and bob.",
        },
      ],
    } satisfies SignalDocument,
  },
  proposedMultiParty: {
    collaborator: {
      envelope: schemaEnvelope,
      mainBranch: "main",
      members: paymentCollaborators,
    } satisfies CollaboratorDocument,
    divergence: {
      envelope: schemaEnvelope,
      entries: [
        {
          id: "D-001",
          title: "Payment Architecture Choice",
          status: "proposed",
          parties: ["alice", "bob", "carol"],
          nature: "architecture direction",
          priority: "blocking",
          foundAt: "review @ abc7771 (2026-04-25)",
          proposal: {
            proposer: "alice",
            proposedAt: "align @ def8882 (2026-04-26)",
            decision:
              "Keep a microservice payment gateway with dedicated provider adapters, retain PayPal support, and defer event-driven orchestration to internal async workers.",
            reasoning:
              "This preserves PayPal support and PCI Level 1 expectations while keeping responsibilities explicit for each payment flow.",
            votes: [
              { collaborator: "alice", vote: "propose" },
              { collaborator: "bob", vote: "approve" },
            ],
          },
        },
      ],
    } satisfies DivergenceDocument,
    "index-doc": {
      envelope: parseEnvelope("2026-04-26T08:10:00Z"),
      northStar:
        "Design a payment platform that keeps PayPal support, meets PCI expectations, and stays understandable for a small product team.",
      northStarSource: "THESIS.md (last updated: pay001 2026-04-25)",
      decisionLog: [],
      divergences: {
        open: 0,
        proposed: 1,
        resolved: 0,
        notes: [
          "D-001: Payment Architecture Choice (proposed, blocking) — alice, bob, carol",
        ],
      },
      signals: [
        "[2026-04-26] 🟡 D-001: Proposed architecture is awaiting Carol's confirmation.",
      ],
      documentTree: [
        {
          collaborator: "alice",
          documents: [
            {
              path: "design/alice/payment-architecture.md",
              summary: "microservices proposal with PCI Level 1",
            },
          ],
        },
        {
          collaborator: "bob",
          documents: [
            {
              path: "design/bob/payment-architecture.md",
              summary: "monolithic proposal with PostgreSQL",
            },
          ],
        },
        {
          collaborator: "carol",
          documents: [
            {
              path: "design/carol/payment-architecture.md",
              summary: "serverless proposal without PayPal",
            },
          ],
        },
      ],
    } satisfies IndexDocument,
  },
  resolvedPendingActionItems: {
    collaborator: {
      envelope: schemaEnvelope,
      mainBranch: "main",
      members: apiCollaborators,
    } satisfies CollaboratorDocument,
    divergence: {
      envelope: schemaEnvelope,
      entries: [
        {
          id: "D-001",
          title: "API Protocol Choice",
          status: "resolved",
          parties: ["alice", "bob"],
          resolution: {
            resolvedAt: "align @ fedcba9 (2026-04-26)",
            decision:
              "Keep a REST-first API with a thin GraphQL compatibility layer for external consumers.",
            rationale: "This balances implementation simplicity with query flexibility.",
            finalVotes: [
              { collaborator: "alice", vote: "propose" },
              { collaborator: "bob", vote: "approve" },
            ],
            changeInstructionsRef: ".spec/decisions/D-001.md",
          },
        },
      ],
    } satisfies DivergenceDocument,
    decision: {
      envelope: schemaEnvelope,
      decisionId: "D-001",
      title: "API Protocol Choice",
      resolutionSummary:
        "Keep a REST-first API with a thin GraphQL compatibility layer for external consumers.",
      finalizedBy: "alice",
      resolvedAt: "2026-04-26",
      actionItems: [validActionItem],
    } satisfies DecisionDocument,
    signal: {
      envelope: schemaEnvelope,
      entries: [
        {
          updatedAt: "2026-04-26",
          source: "D-001",
          status: "resolved",
          message:
            "API Protocol Choice resolved; bob still has a pending source document update.",
        },
      ],
    } satisfies SignalDocument,
  },
  fullyClosed: {
    divergence: {
      envelope: schemaEnvelope,
      entries: [
        {
          id: "D-001",
          title: "API Protocol Choice",
          status: "fully-closed",
          parties: ["alice", "bob"],
          resolution: {
            resolvedAt: "align @ fedcba9 (2026-04-26)",
            closedAt: "update @ ff00aa1 (2026-04-27)",
            decision:
              "Keep a REST-first API with a thin GraphQL compatibility layer for external consumers.",
            rationale: "This balances implementation simplicity with query flexibility.",
            finalVotes: [
              { collaborator: "alice", vote: "propose" },
              { collaborator: "bob", vote: "approve" },
            ],
            changeInstructionsRef: ".spec/decisions/D-001.md",
          },
        },
      ],
    } satisfies DivergenceDocument,
    thesis: {
      envelope: schemaEnvelope,
      northStar:
        "Ship a REST-first public API that stays easy to document and review across collaborators.",
      decisionLog: [
        {
          date: "2026-04-26",
          decisionId: "D-001",
          summary:
            "Keep a REST-first API with a thin GraphQL compatibility layer for external consumers.",
          finalizedBy: "alice",
          rationale:
            "This preserves implementation simplicity while supporting flexible client queries.",
        },
      ],
    } satisfies ThesisDocument,
    signal: {
      envelope: schemaEnvelope,
      entries: [
        {
          updatedAt: "2026-04-27",
          source: "D-001",
          status: "fully-closed",
          message:
            "API Protocol Choice — all source documents updated, divergence fully closed.",
        },
      ],
    } satisfies SignalDocument,
    "index-doc": {
      envelope: parseEnvelope("2026-04-27T10:45:00Z"),
      northStar:
        "Ship a REST-first public API that stays easy to document and review across collaborators.",
      northStarSource: "THESIS.md (last updated: update902 2026-04-27)",
      decisionLog: [
        "[2026-04-26] **D-001: API Protocol Choice**: Keep a REST-first API with a thin GraphQL compatibility layer for external consumers.",
      ],
      divergences: {
        open: 0,
        proposed: 0,
        resolved: 0,
        fullyClosed: 1,
        notes: ["✅ No pending divergences"],
      },
      signals: [
        "[2026-04-27] 🔒 D-001: API Protocol Choice — all source documents updated, divergence fully closed.",
      ],
      documentTree: [
        {
          collaborator: "alice",
          documents: [
            {
              path: "design/alice/api-design.md",
              summary: "REST-first user API baseline",
            },
          ],
        },
        {
          collaborator: "bob",
          documents: [
            {
              path: "design/bob/graphql-proposal.md",
              summary: "updated to REST-first with GraphQL compatibility notes",
            },
          ],
        },
      ],
    } satisfies IndexDocument,
  },
} as const;

export const legacyPre30 = {
  collaborator: {
    mainBranch: "main",
    members: [
      {
        code: "alice",
        sourceDirectories: ["./alice"],
        specPath: ".spec/design/alice/",
        joinedAt: "2025-12-14",
      },
      {
        code: "bob",
        sourceDirectories: ["./bob"],
        specPath: ".spec/design/bob/",
        joinedAt: "2025-12-14",
      },
    ],
  },
} as const;