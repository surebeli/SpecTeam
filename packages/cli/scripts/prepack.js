#!/usr/bin/env node
// Sync plugin/skills into cli/skills and copy the root LICENSE so the published
// specteam-cli package is self-contained after `npm install -g specteam-cli`.

const fs = require('fs');
const path = require('path');

const cliRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(cliRoot, '../..');
const sourceSkills = path.join(repoRoot, 'plugin', 'skills');
const targetSkills = path.join(cliRoot, 'skills');
const sourceLicense = path.join(repoRoot, 'LICENSE');
const targetLicense = path.join(cliRoot, 'LICENSE');

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

if (!fs.existsSync(sourceSkills)) {
  console.error(`[specteam-cli prepack] Missing source skills directory: ${sourceSkills}`);
  process.exit(1);
}

rmrf(targetSkills);
copyDir(sourceSkills, targetSkills);

if (fs.existsSync(sourceLicense)) {
  fs.copyFileSync(sourceLicense, targetLicense);
}

const skillCount = fs.readdirSync(targetSkills).filter((name) =>
  fs.statSync(path.join(targetSkills, name)).isDirectory()
).length;
console.log(`[specteam-cli prepack] Synced ${skillCount} skills into cli/skills/`);
