#!/usr/bin/env node
// Clean up the artifacts prepack staged so the repo stays tidy.
// The pack already contains them — this only affects the working tree.

const fs = require('fs');
const path = require('path');

const cliRoot = path.resolve(__dirname, '..');
const stagedSkills = path.join(cliRoot, 'skills');
const stagedLicense = path.join(cliRoot, 'LICENSE');

if (fs.existsSync(stagedSkills)) {
  fs.rmSync(stagedSkills, { recursive: true, force: true });
}
if (fs.existsSync(stagedLicense)) {
  fs.rmSync(stagedLicense, { force: true });
}
