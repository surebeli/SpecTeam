import type { ActionItem } from "./action-item";
import type { Envelope } from "./envelope";

export interface DecisionDocument {
  envelope: Envelope;
  decisionId: string;
  title: string;
  resolutionSummary: string;
  finalizedBy: string;
  resolvedAt: string;
  rationale?: string;
  actionItems: ActionItem[];
}