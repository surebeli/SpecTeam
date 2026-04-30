import type { Envelope } from "./envelope";

export type DivergenceStatus = "open" | "proposed" | "resolved" | "fully-closed";
export type DivergencePriority = "blocking" | "directional" | "detail";
export type DivergenceVoteChoice = "propose" | "approve";

export interface DivergenceVote {
  collaborator: string;
  vote: DivergenceVoteChoice;
}

export interface DivergenceProposal {
  proposer: string;
  proposedAt: string;
  decision: string;
  reasoning: string;
  votes: DivergenceVote[];
}

export interface DivergenceResolution {
  resolvedAt: string;
  decision: string;
  rationale: string;
  finalVotes: DivergenceVote[];
  changeInstructionsRef: string;
  closedAt?: string;
}

export interface DivergenceEntry {
  id: string;
  title: string;
  status: DivergenceStatus;
  parties: string[];
  nature?: string;
  priority?: DivergencePriority;
  foundAt?: string;
  proposal?: DivergenceProposal;
  resolution?: DivergenceResolution;
}

export interface DivergenceDocument {
  envelope: Envelope;
  reviewedAt?: string;
  reviewedCommit?: string;
  reviewedBy?: string;
  entries: DivergenceEntry[];
}