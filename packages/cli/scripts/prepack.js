#!/usr/bin/env node
// Sync plugin/skills into cli/skills and copy the root LICENSE so the published
// specteam-cli package is self-contained after `npm install -g specteam-cli`.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const cliRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(cliRoot, '../..');
const sourceSkills = path.join(repoRoot, 'plugin', 'skills');
const targetSkills = path.join(cliRoot, 'skills');
const sourceLicense = path.join(repoRoot, 'LICENSE');
const targetLicense = path.join(cliRoot, 'LICENSE');
const sourceSchemaDist = path.join(repoRoot, 'packages', 'spec-schema', 'dist');
const sourceSchemaSchemas = path.join(repoRoot, 'packages', 'spec-schema', 'src', 'schemas');
const targetSchemaRoot = path.join(cliRoot, 'vendor', 'schema');
const targetSchemaDist = path.join(targetSchemaRoot, 'dist');
const targetSchemaSchemas = path.join(targetSchemaRoot, 'src', 'schemas');

function rmrf(p) {
  if (!fs.existsSync(p)) return;
  fs.rmSync(p, { recursive: true, force: true });
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else if (entry.isFile()) fs.copyFileSync(s, d);
  }
}

function buildSchemaRuntime() {
  const npmExecPath = process.env.npm_execpath;
  if (!npmExecPath) {
    console.error('[specteam-cli prepack] npm_execpath is not available; cannot build bundled schema runtime.');
    process.exit(1);
  }

  execFileSync(process.execPath, [npmExecPath, 'run', 'build', '-w', '@specteam/schema'], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
}

if (!fs.existsSync(sourceSkills)) {
  console.error(`[specteam-cli prepack] Missing source skills directory: ${sourceSkills}`);
  process.exit(1);
}

buildSchemaRuntime();

if (!fs.existsSync(sourceSchemaDist) || !fs.existsSync(sourceSchemaSchemas)) {
  console.error('[specteam-cli prepack] Missing schema runtime artifacts after build.');
  process.exit(1);
}

rmrf(targetSkills);
copyDir(sourceSkills, targetSkills);

rmrf(targetSchemaRoot);
copyDir(sourceSchemaDist, targetSchemaDist);
copyDir(sourceSchemaSchemas, targetSchemaSchemas);

if (fs.existsSync(sourceLicense)) {
  fs.copyFileSync(sourceLicense, targetLicense);
}

const skillCount = fs.readdirSync(targetSkills).filter((name) =>
  fs.statSync(path.join(targetSkills, name)).isDirectory()
).length;
console.log(`[specteam-cli prepack] Synced ${skillCount} skills into cli/skills/`);
console.log('[specteam-cli prepack] Staged bundled schema runtime into cli/vendor/schema/');
