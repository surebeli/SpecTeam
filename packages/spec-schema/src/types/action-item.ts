export type ActionItemCompletionState = "pending" | "complete" | "no-change-needed";

export interface ActionItem {
  owner: string;
  targetFile: string;
  completionState: ActionItemCompletionState;
  requiredChanges?: string[];
  acceptanceCriterion?: string;
  background?: string;
  decision?: string;
}