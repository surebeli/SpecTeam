import type { Envelope } from "./envelope";

export type CollaboratorRole = "maintainer" | "contributor" | "observer";

export interface CollaboratorMember {
  code: string;
  role: CollaboratorRole;
  sourceDirectories: string[];
  specPath: string;
  joinedAt: string;
}

export interface CollaboratorDocument {
  envelope: Envelope;
  mainBranch: string;
  members: CollaboratorMember[];
}