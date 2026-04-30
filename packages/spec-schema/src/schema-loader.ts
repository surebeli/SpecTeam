import { existsSync, readFileSync } from "node:fs";
import * as path from "node:path";

export function loadSchema(fileName: string): Record<string, unknown> {
  const candidates = [
    path.resolve(__dirname, "..", "src", "schemas", fileName),
    path.resolve(__dirname, "..", "..", "src", "schemas", fileName),
  ];

  const schemaPath = candidates.find((candidate) => existsSync(candidate));
  if (!schemaPath) {
    throw new Error(`Unable to locate schema file: ${fileName}`);
  }

  return JSON.parse(readFileSync(schemaPath, "utf8")) as Record<string, unknown>;
}