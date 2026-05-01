import assert = require("node:assert/strict");
import test = require("node:test");

import { CURRENT_SCHEMA_VERSION } from "../src/metadata";
import type { EntityType } from "../src/types";
import type { ValidationResult } from "../src/validator";
import { validate } from "../src/validator";

import { clone, legacyPre30, modernFixtures, validActionItem } from "./fixture-models";

function assertValid<T>(result: ValidationResult<T>, label: string): asserts result is { ok: true; value: T } {
  if (!result.ok) {
    assert.fail(`${label} should validate but failed with ${JSON.stringify(result.errors)}`);
  }
}

function assertErrorCode<T>(result: ValidationResult<T>, code: string): void {
  assert.equal(result.ok, false, `Expected validation failure with ${code}`);
  if (result.ok) {
    return;
  }
  assert.match(
    result.errors.map((error) => error.code).join(","),
    new RegExp(`(^|,)${code}(,|$)`),
  );
}

test("modern fixture typed models validate for their related entities", () => {
  for (const [fixtureName, entities] of Object.entries(modernFixtures)) {
    for (const [entityType, value] of Object.entries(entities)) {
      const result = validate(entityType as EntityType, value);
      assertValid(result, `${fixtureName}/${entityType}`);
    }
  }
});

test("legacy-pre-3.0 collaborator shape is rejected with schema-version unsupported", () => {
  const result = validate("collaborator", legacyPre30.collaborator);
  assertErrorCode(result, "PX-V007");
});

test("negative: envelope rejects unsupported schemaVersion with PX-V007", () => {
  const envelope = {
    schemaVersion: "2.9",
  };

  const result = validate("envelope", envelope);
  assertErrorCode(result, "PX-V007");
});

test("negative: collaborator rejects missing mainBranch with PX-V001", () => {
  const collaborator = clone(modernFixtures.cleanWorkspace.collaborator) as { mainBranch?: string };
  delete collaborator.mainBranch;

  const result = validate("collaborator", collaborator);
  assertErrorCode(result, "PX-V001");
});

test("negative: action-item rejects unknown field with PX-V003", () => {
  const actionItem = clone(validActionItem) as typeof validActionItem & { unexpected?: boolean };
  actionItem.unexpected = true;

  const result = validate("action-item", actionItem);
  assertErrorCode(result, "PX-V003");
});

test("negative: decision rejects wrong actionItems type with PX-V002", () => {
  const decision = clone(modernFixtures.resolvedPendingActionItems.decision) as {
    actionItems: unknown;
  };
  decision.actionItems = { owner: "bob" };

  const result = validate("decision", decision);
  assertErrorCode(result, "PX-V002");
});

test("negative: divergence rejects invalid enum values with PX-V004", () => {
  const divergence = clone(modernFixtures.conflicted.divergence);
  divergence.entries[0].priority = "urgent" as never;

  const result = validate("divergence", divergence);
  assertErrorCode(result, "PX-V004");
});

test("negative: divergence rejects dangling collaborator references with PX-V006", () => {
  const divergence = clone(modernFixtures.proposedMultiParty.divergence);
  divergence.entries[0].proposal!.votes.push({
    collaborator: "dave",
    vote: "approve",
  });

  const result = validate("divergence", divergence);
  assertErrorCode(result, "PX-V006");
});

test("negative: thesis rejects missing northStar with PX-V001", () => {
  const thesis = clone(modernFixtures.fullyClosed.thesis) as { northStar?: string };
  delete thesis.northStar;

  const result = validate("thesis", thesis);
  assertErrorCode(result, "PX-V001");
});

test("validator exports current schema version through envelope success path", () => {
  const result = validate("envelope", { schemaVersion: CURRENT_SCHEMA_VERSION });
  assertValid(result, "envelope");
  assert.equal(result.value.schemaVersion, CURRENT_SCHEMA_VERSION);
});