const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..', '..', '..');
const cliDir = path.join(repoRoot, 'packages', 'cli');
const fixtureSource = path.join(repoRoot, 'packages', 'spec-fixtures', 'states', 'clean-workspace');
const npmExecPath = process.env.npm_execpath;

function runNpm(args, cwd) {
  assert.ok(npmExecPath, 'npm_execpath is required for the pack/install smoke');

  const result = spawnSync(process.execPath, [npmExecPath, ...args], {
    cwd,
    encoding: 'utf8',
    env: process.env,
  });

  assert.equal(result.status, 0, `npm ${args.join(' ')} failed:\n${result.stdout}\n${result.stderr}`);
  return result;
}

function tarballNameFrom(stdout) {
  const lines = stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const tarball = [...lines].reverse().find((line) => line.endsWith('.tgz'));
  assert.ok(tarball, `Could not find tarball name in output:\n${stdout}`);
  return tarball;
}

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'specteam-cli-pack-'));
const installDir = path.join(tempRoot, 'install');
const fixtureDir = path.join(tempRoot, 'clean-workspace');

fs.mkdirSync(installDir, { recursive: true });
fs.cpSync(fixtureSource, fixtureDir, { recursive: true });

let tarballPath;

try {
  const packResult = runNpm(['pack'], cliDir);
  tarballPath = path.join(cliDir, tarballNameFrom(packResult.stdout));

  runNpm(['init', '-y'], installDir);
  runNpm(['install', tarballPath], installDir);

  const cliBin = path.join(installDir, 'node_modules', 'specteam-cli', 'bin', 'spec.js');
  const validateResult = spawnSync(process.execPath, [cliBin, 'validate', `--path=${fixtureDir}`, '--json'], {
    cwd: installDir,
    encoding: 'utf8',
    env: process.env,
  });

  assert.equal(validateResult.status, 0, `Installed CLI validate failed:\n${validateResult.stdout}\n${validateResult.stderr}`);
  const parsed = JSON.parse(validateResult.stdout);
  assert.equal(parsed.summary.failed, 0);
  assert.equal(parsed.summary.passed, 3);
} finally {
  if (tarballPath && fs.existsSync(tarballPath)) {
    fs.rmSync(tarballPath, { force: true });
  }
  fs.rmSync(tempRoot, { recursive: true, force: true });
}