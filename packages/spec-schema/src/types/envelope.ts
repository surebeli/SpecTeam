export type SchemaVersion = "3.0";

export interface Envelope {
  schemaVersion: SchemaVersion;
  generator?: string;
  generatedAt?: string;
  updatedAt?: string;
}