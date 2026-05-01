import { CURRENT_SCHEMA_VERSION } from "../src/metadata";
import type {
  ActionItem,
  CollaboratorDocument,
  DecisionDocument,
  DivergenceDocument,
  ThesisDocument,
} from "../src/types";

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const schemaEnvelope = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
} as const;

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