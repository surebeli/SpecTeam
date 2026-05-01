const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..', '..', '..');
const cliBin = path.join(repoRoot, 'packages', 'cli', 'bin', 'spec.js');
const fixturesDir = path.join(repoRoot, 'packages', 'spec-fixtures', 'states');

function runValidatePath(targetPath, extraArgs = []) {
  return spawnSync(
    process.execPath,
    [cliBin, 'validate', `--path=${targetPath}`, ...extraArgs],
    {
      cwd: repoRoot,
      encoding: 'utf8',
    },
  );
}

function runValidate(fixtureName, extraArgs = []) {
  return runValidatePath(path.join(fixturesDir, fixtureName), extraArgs);
}

test('modern fixtures exit 0 under spec validate', () => {
  const fixtures = [
    'clean-workspace',
    'conflicted',
    'proposed-multi-party',
    'resolved-pending-action-items',
    'fully-closed',
  ];

  for (const fixture of fixtures) {
    const result = runValidate(fixture);
    assert.equal(result.status, 0, `${fixture} should pass validation:\n${result.stdout}\n${result.stderr}`);
    assert.match(result.stdout, /Summary: \d+ passed, 0 failed/);
  }
});

test('legacy-pre-3.0 exits 1 with a legacy/schema failure code', () => {
  const result = runValidate('legacy-pre-3.0');
  assert.equal(result.status, 1, 'legacy-pre-3.0 should fail validation');
  assert.match(`${result.stdout}\n${result.stderr}`, /PX-(V007|P007)/);
});

test('--json output is parseable', () => {
  const result = runValidate('clean-workspace', ['--json']);
  assert.equal(result.status, 0, result.stderr);

  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.summary.failed, 0);
  assert.ok(Array.isArray(parsed.results));
  assert.ok(parsed.results.length >= 1);
});

test('existing directory with no recognized .spec files exits 1 with PX-E009', () => {
  const result = runValidatePath(path.join(repoRoot, 'packages', 'spec-schema'));
  assert.equal(result.status, 1, 'non-.spec directory should fail validation');
  assert.match(`${result.stdout}\n${result.stderr}`, /PX-E009/);
});