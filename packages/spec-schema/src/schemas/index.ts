import { loadSchema } from "../schema-loader";

export const schemaRegistry = {
  "action-item": loadSchema("action-item.schema.json"),
  collaborator: loadSchema("collaborator.schema.json"),
  decision: loadSchema("decision.schema.json"),
  divergence: loadSchema("divergence.schema.json"),
  envelope: loadSchema("envelope.schema.json"),
  thesis: loadSchema("thesis.schema.json"),
} as const;