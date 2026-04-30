import type { Envelope } from "./envelope";

export interface SignalEntry {
  status?: string;
  blocker?: string;
  source?: string;
  updatedAt?: string;
  scope?: string;
  message: string;
}

export interface SignalDocument {
  envelope: Envelope;
  entries: SignalEntry[];
}