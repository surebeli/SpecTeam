import type { Envelope } from "./envelope";

export interface ThesisDecisionLogItem {
  date: string;
  decisionId?: string;
  summary: string;
  finalizedBy?: string;
  rationale?: string;
}

export interface ThesisDocument {
  envelope: Envelope;
  northStar: string;
  decisionLog: ThesisDecisionLogItem[];
}