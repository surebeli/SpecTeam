import type { Envelope } from "./envelope";

export interface IndexDivergenceSummary {
  open: number;
  proposed: number;
  resolved: number;
  fullyClosed?: number;
  notes: string[];
}

export interface IndexDocumentTreeItem {
  path: string;
  summary: string;
}

export interface IndexDocumentTreeGroup {
  collaborator: string;
  documents: IndexDocumentTreeItem[];
}

export interface IndexDocument {
  envelope: Envelope;
  northStar: string;
  northStarSource?: string;
  decisionLog: string[];
  divergences: IndexDivergenceSummary;
  signals: string[];
  documentTree: IndexDocumentTreeGroup[];
}