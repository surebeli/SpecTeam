export type { ActionItem, ActionItemCompletionState } from "./action-item";
export type { CollaboratorDocument, CollaboratorMember, CollaboratorRole } from "./collaborator";
export type { DecisionDocument } from "./decision";
export type {
  DivergenceDocument,
  DivergenceEntry,
  DivergencePriority,
  DivergenceProposal,
  DivergenceResolution,
  DivergenceStatus,
  DivergenceVote,
  DivergenceVoteChoice,
} from "./divergence";
export type { Envelope, SchemaVersion } from "./envelope";
export type { ThesisDecisionLogItem, ThesisDocument } from "./thesis";

import type { ActionItem } from "./action-item";
import type { CollaboratorDocument } from "./collaborator";
import type { DecisionDocument } from "./decision";
import type { DivergenceDocument } from "./divergence";
import type { Envelope } from "./envelope";
import type { ThesisDocument } from "./thesis";

export interface EntityTypeMap {
  "action-item": ActionItem;
  collaborator: CollaboratorDocument;
  decision: DecisionDocument;
  divergence: DivergenceDocument;
  envelope: Envelope;
  thesis: ThesisDocument;
}

export type EntityType = keyof EntityTypeMap;