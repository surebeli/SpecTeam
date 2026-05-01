import type {
  CollaboratorDocument,
  CollaboratorMember,
  DivergenceDocument,
  Envelope,
  ThesisDocument,
} from "../types";

import { CURRENT_SCHEMA_VERSION } from "../metadata";
import { parseThesis } from "../parsers/thesis.parser";
import { validate } from "../validator";

export interface LegacyPre30MarkdownWorkspace {
  collaborator: string;
  divergence: string;
  thesis: string;
  signal: string;
  "index-doc": string;
}

export interface LegacyPre30Draft {
  collaborator: Omit<CollaboratorDocument, "envelope">;
  divergence: Omit<DivergenceDocument, "envelope">;
  thesis: Omit<ThesisDocument, "envelope">;
}

export interface MigratedWorkspace {
  collaborator: CollaboratorDocument;
  divergence: DivergenceDocument;
  thesis: ThesisDocument;
}

export interface MigrationError {
  code: string;
  message: string;
}

export type MigrationResult =
  | {
      ok: true;
      value: MigratedWorkspace;
      applied: string[];
    }
  | {
      ok: false;
      errors: MigrationError[];
    };

function currentEnvelope(overrides: Partial<Envelope> = {}): Envelope {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    ...overrides,
  };
}

function splitTableRow(line: string): string[] {
  return line
    .split("|")
    .map((cell) => cell.trim())
    .filter(Boolean);
}

function parseLegacyCollaboratorDraft(text: string): LegacyPre30Draft["collaborator"] {
  const lines = text.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => line.trim().startsWith("| Code"));
  const members: CollaboratorMember[] = [];

  for (let index = headerIndex + 2; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line.startsWith("|")) {
      break;
    }

    const cells = splitTableRow(line);
    members.push({
      code: cells[0],
      role: "contributor",
      sourceDirectories: [cells[1]],
      specPath: cells[2],
      joinedAt: cells[3],
    });
  }

  return {
    mainBranch: "main",
    members,
  };
}

function parseLegacyDivergenceDraft(text: string): LegacyPre30Draft["divergence"] {
  const headingMatch = text.match(/^###\s+(D-\d{3}):\s+(.+)$/m);
  const statusLine = text.match(/^Status:\s+(open|proposed|resolved|fully-closed)\s+[^|]*\|\s+Parties:\s+(.+)\s+\|\s+Priority:\s+(blocking|directional|detail)$/m);
  const foundAtMatch = text.match(/^Found at:\s+(.+)$/m);

  if (!headingMatch || !statusLine || !foundAtMatch) {
    throw new Error("Legacy divergence fixture is malformed.");
  }

  return {
    entries: [
      {
        id: headingMatch[1],
        title: headingMatch[2],
        status: statusLine[1] as DivergenceDocument["entries"][number]["status"],
        parties: statusLine[2].split(/\s+vs\s+/).map((part) => part.trim()),
        nature: "technology choice",
        priority: statusLine[3] as DivergenceDocument["entries"][number]["priority"],
        foundAt: foundAtMatch[1].replace(/`/g, ""),
      },
    ],
  };
}

function isMigratedWorkspace(input: unknown): input is MigratedWorkspace {
  if (!input || typeof input !== "object") {
    return false;
  }

  const candidate = input as Partial<MigratedWorkspace>;
  return candidate.collaborator?.envelope?.schemaVersion === CURRENT_SCHEMA_VERSION
    && candidate.divergence?.envelope?.schemaVersion === CURRENT_SCHEMA_VERSION
    && candidate.thesis?.envelope?.schemaVersion === CURRENT_SCHEMA_VERSION;
}

function toMigrationError(code: string, message: string): MigrationError {
  return { code, message };
}

export function buildLegacyPre30Draft(input: LegacyPre30MarkdownWorkspace):
  | { ok: true; value: LegacyPre30Draft }
  | { ok: false; errors: MigrationError[] } {
  const parsedThesis = parseThesis(input.thesis);
  if (!parsedThesis.ok) {
    return {
      ok: false,
      errors: parsedThesis.errors.map((error) => toMigrationError(error.code, error.message)),
    };
  }

  try {
    const collaborator = parseLegacyCollaboratorDraft(input.collaborator);
    const divergence = parseLegacyDivergenceDraft(input.divergence);
    const thesis = {
      northStar: parsedThesis.value.northStar,
      decisionLog: parsedThesis.value.decisionLog,
    };

    return {
      ok: true,
      value: {
        collaborator,
        divergence,
        thesis,
      },
    };
  } catch (error) {
    return {
      ok: false,
      errors: [toMigrationError("PX-P007", error instanceof Error ? error.message : "Legacy migration draft build failed.")],
    };
  }
}

export function migrateLegacyPre30(
  input: LegacyPre30MarkdownWorkspace | LegacyPre30Draft | MigratedWorkspace,
): MigrationResult {
  if (isMigratedWorkspace(input)) {
    return {
      ok: true,
      value: input,
      applied: [],
    };
  }

  const draftResult = typeof (input as LegacyPre30MarkdownWorkspace).collaborator === "string"
    ? buildLegacyPre30Draft(input as LegacyPre30MarkdownWorkspace)
    : { ok: true as const, value: input as LegacyPre30Draft };

  if (!draftResult.ok) {
    return draftResult;
  }

  const migrated: MigratedWorkspace = {
    collaborator: {
      envelope: currentEnvelope(),
      ...draftResult.value.collaborator,
    },
    divergence: {
      envelope: currentEnvelope(),
      ...draftResult.value.divergence,
    },
    thesis: {
      envelope: currentEnvelope(),
      ...draftResult.value.thesis,
    },
  };

  const validationChecks = [
    validate("collaborator", migrated.collaborator),
    validate("divergence", migrated.divergence),
    validate("thesis", migrated.thesis),
  ];
  const firstFailure = validationChecks.find((result) => !result.ok);
  if (firstFailure && !firstFailure.ok) {
    return {
      ok: false,
      errors: firstFailure.errors.map((error) => toMigrationError(error.code, error.message)),
    };
  }

  return {
    ok: true,
    value: migrated,
    applied: [
      "legacy-pre-3.0:add-envelope",
      "legacy-pre-3.0:normalize-collaborators",
      "legacy-pre-3.0:normalize-divergences",
    ],
  };
}