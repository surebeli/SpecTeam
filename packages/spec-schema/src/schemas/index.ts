import { loadSchema } from "../schema-loader";

export const schemaRegistry = {
  "action-item": loadSchema("action-item.schema.json"),
  collaborator: loadSchema("collaborator.schema.json"),
  decision: loadSchema("decision.schema.json"),
  divergence: loadSchema("divergence.schema.json"),
  envelope: loadSchema("envelope.schema.json"),
  "index-doc": loadSchema("index-doc.schema.json"),
  signal: loadSchema("signal.schema.json"),
  thesis: loadSchema("thesis.schema.json"),
} as const;