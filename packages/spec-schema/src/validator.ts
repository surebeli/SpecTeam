import Ajv2020, { type ErrorObject, type ValidateFunction } from "ajv/dist/2020";
import addFormats from "ajv-formats";

import { CURRENT_SCHEMA_VERSION } from "./metadata";
import { schemaRegistry } from "./schemas";
import type {
  DivergenceDocument,
  EntityType,
  EntityTypeMap,
} from "./types";

export interface ValidationError {
  code: string;
  path: string;
  message: string;
}

export interface ValidationSuccess<T> {
  ok: true;
  value: T;
}

export interface ValidationFailure {
  ok: false;
  errors: ValidationError[];
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  strictRequired: false,
});

addFormats(ajv);

for (const schema of Object.values(schemaRegistry)) {
  ajv.addSchema(schema);
}

const validators = {
  "action-item": ajv.getSchema("https://specteam.dev/schema/action-item.schema.json") as ValidateFunction<EntityTypeMap["action-item"]>,
  collaborator: ajv.getSchema("https://specteam.dev/schema/collaborator.schema.json") as ValidateFunction<EntityTypeMap["collaborator"]>,
  decision: ajv.getSchema("https://specteam.dev/schema/decision.schema.json") as ValidateFunction<EntityTypeMap["decision"]>,
  divergence: ajv.getSchema("https://specteam.dev/schema/divergence.schema.json") as ValidateFunction<EntityTypeMap["divergence"]>,
  envelope: ajv.getSchema("https://specteam.dev/schema/envelope.schema.json") as ValidateFunction<EntityTypeMap["envelope"]>,
  thesis: ajv.getSchema("https://specteam.dev/schema/thesis.schema.json") as ValidateFunction<EntityTypeMap["thesis"]>,
} satisfies { [K in EntityType]: ValidateFunction<EntityTypeMap[K]> };

function pathWithProperty(basePath: string, property?: string): string {
  if (!property) {
    return basePath || "/";
  }

  if (!basePath || basePath === "/") {
    return `/${property}`;
  }

  return `${basePath}/${property}`;
}

function mapAjvError(error: ErrorObject): ValidationError {
  if (error.keyword === "required") {
    const requiredProperty = typeof error.params.missingProperty === "string"
      ? error.params.missingProperty
      : undefined;
    if (requiredProperty === "schemaVersion" && error.instancePath === "/envelope") {
      return {
        code: "PX-V007",
        path: "/envelope/schemaVersion",
        message: `Unsupported schema version. Expected ${CURRENT_SCHEMA_VERSION}.`,
      };
    }

    return {
      code: "PX-V001",
      path: pathWithProperty(error.instancePath, requiredProperty),
      message: error.message || "Missing required field",
    };
  }

  if (error.keyword === "type") {
    return {
      code: "PX-V002",
      path: error.instancePath || "/",
      message: error.message || "Wrong type",
    };
  }

  if (error.keyword === "additionalProperties") {
    const extraProperty = typeof error.params.additionalProperty === "string"
      ? error.params.additionalProperty
      : undefined;
    return {
      code: "PX-V003",
      path: pathWithProperty(error.instancePath, extraProperty),
      message: extraProperty
        ? `Unknown field: ${extraProperty}`
        : (error.message || "Unknown field"),
    };
  }

  if (error.keyword === "enum") {
    return {
      code: "PX-V004",
      path: error.instancePath || "/",
      message: error.message || "Invalid enum value",
    };
  }

  if (error.keyword === "format") {
    return {
      code: "PX-V005",
      path: error.instancePath || "/",
      message: error.message || "Invalid format",
    };
  }

  if (error.keyword === "const" && error.instancePath === "/envelope/schemaVersion") {
    return {
      code: "PX-V007",
      path: "/envelope/schemaVersion",
      message: `Unsupported schema version. Expected ${CURRENT_SCHEMA_VERSION}.`,
    };
  }

  return {
    code: "PX-V010",
    path: error.instancePath || "/",
    message: error.message || "Validation failed",
  };
}

function versionPath(entityType: EntityType): string {
  return entityType === "envelope" ? "/schemaVersion" : "/envelope/schemaVersion";
}

function getSchemaVersion(entityType: EntityType, data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return undefined;
  }

  if (entityType === "envelope") {
    return (data as { schemaVersion?: unknown }).schemaVersion;
  }

  const envelope = (data as { envelope?: { schemaVersion?: unknown } }).envelope;
  return envelope?.schemaVersion;
}

function validateSchemaVersion(entityType: EntityType, data: unknown): ValidationError[] {
  if (entityType === "action-item") {
    return [];
  }

  const schemaVersion = getSchemaVersion(entityType, data);
  if (schemaVersion === CURRENT_SCHEMA_VERSION) {
    return [];
  }

  return [
    {
      code: "PX-V007",
      path: versionPath(entityType),
      message: `Unsupported schema version. Expected ${CURRENT_SCHEMA_VERSION}.`,
    },
  ];
}

function validateDivergenceReferences(document: DivergenceDocument): ValidationError[] {
  const errors: ValidationError[] = [];

  document.entries.forEach((entry, entryIndex) => {
    const parties = new Set(entry.parties);

    if (entry.proposal && !parties.has(entry.proposal.proposer)) {
      errors.push({
        code: "PX-V006",
        path: `/entries/${entryIndex}/proposal/proposer`,
        message: `Dangling reference: proposer ${entry.proposal.proposer} is not listed in parties.`,
      });
    }

    entry.proposal?.votes.forEach((vote, voteIndex) => {
      if (!parties.has(vote.collaborator)) {
        errors.push({
          code: "PX-V006",
          path: `/entries/${entryIndex}/proposal/votes/${voteIndex}/collaborator`,
          message: `Dangling reference: vote collaborator ${vote.collaborator} is not listed in parties.`,
        });
      }
    });

    entry.resolution?.finalVotes.forEach((vote, voteIndex) => {
      if (!parties.has(vote.collaborator)) {
        errors.push({
          code: "PX-V006",
          path: `/entries/${entryIndex}/resolution/finalVotes/${voteIndex}/collaborator`,
          message: `Dangling reference: vote collaborator ${vote.collaborator} is not listed in parties.`,
        });
      }
    });

    const expectedDecisionRef = `.spec/decisions/${entry.id}.md`;
    if (entry.resolution && entry.resolution.changeInstructionsRef !== expectedDecisionRef) {
      errors.push({
        code: "PX-V006",
        path: `/entries/${entryIndex}/resolution/changeInstructionsRef`,
        message: `Dangling reference: expected ${expectedDecisionRef}.`,
      });
    }
  });

  return errors;
}

const semanticValidators: Partial<{ [K in EntityType]: (value: EntityTypeMap[K]) => ValidationError[] }> = {
  divergence: (value) => validateDivergenceReferences(value as DivergenceDocument),
};

export function validate<K extends EntityType>(entityType: K, data: unknown): ValidationResult<EntityTypeMap[K]> {
  const schemaVersionErrors = validateSchemaVersion(entityType, data);
  if (schemaVersionErrors.length > 0) {
    return {
      ok: false,
      errors: schemaVersionErrors,
    };
  }

  const validator = validators[entityType];
  if (!validator(data)) {
    return {
      ok: false,
      errors: (validator.errors || []).map(mapAjvError),
    };
  }

  const semanticValidator = semanticValidators[entityType] as
    | ((value: EntityTypeMap[K]) => ValidationError[])
    | undefined;
  const semanticErrors = semanticValidator?.(data as EntityTypeMap[K]) || [];
  if (semanticErrors.length > 0) {
    return {
      ok: false,
      errors: semanticErrors,
    };
  }

  return {
    ok: true,
    value: data as EntityTypeMap[K],
  };
}