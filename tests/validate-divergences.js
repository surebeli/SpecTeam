#!/usr/bin/env node

const fs = require('fs');

const transcriptRules = {
  '01-init-founder': [
    '[SpecTeam init — Step 1]',
    '[SpecTeam init — Step 2: Set project goal]',
    '[SpecTeam init — Step 3: Specify document directories]',
    'Initialization complete! You are the project founder.',
    '[Branch Protection]',
  ],
  '05-review-conflict': [
    'D-001',
    'Consensus areas',
    'Gap areas',
    'Recommended handling priority',
  ],
  '06-align-propose': [
    '[Propose Resolution — D-001:',
    'AI recommended resolution:',
    'Please choose your proposal:',
    '✅ Proposal submitted.',
  ],
  '07-align-approve': [
    '[Confirm Resolution — D-001:',
    'Please choose:',
    '✅ Approval recorded. The original proposer (Lead) will finalize the resolution once consensus is reached.',
  ],
  '11-align-finalize': [
    'You are the Proposer (Lead).',
    'Current Votes:',
    '## Source Document Action Items — D-001:',
    '## Alignment Summary',
  ],
};

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function assertMatch(section, regex, label) {
  if (!regex.test(section)) {
    fail(`Missing ${label}`);
  }
}

function assertIncludesInOrder(content, markers, label) {
  let cursor = 0;
  for (const marker of markers) {
    const index = content.indexOf(marker, cursor);
    if (index === -1) {
      fail(`${label}: missing marker: ${marker}`);
      return;
    }
    cursor = index + marker.length;
  }
}

function parseEntries(content) {
  const matches = [...content.matchAll(/^###\s+(D-\d+):\s+(.+)$/gm)];
  return matches.map((match, index) => {
    const start = match.index;
    const end = index + 1 < matches.length ? matches[index + 1].index : content.length;
    return {
      id: match[1],
      title: match[2],
      body: content.slice(start, end),
    };
  });
}

function validateProposed(entry) {
  assertMatch(entry.body, /\*\*Status\*\*:\s*`proposed`/m, `${entry.id} proposed status`);
  assertMatch(entry.body, /\*\*Parties\*\*:\s*.+/m, `${entry.id} parties`);
  assertMatch(entry.body, /\*\*Nature\*\*:\s*.+/m, `${entry.id} nature`);
  assertMatch(entry.body, /\*\*Priority\*\*:\s*.+/m, `${entry.id} priority`);
  assertMatch(entry.body, /\*\*Found at\*\*:\s*.+/m, `${entry.id} found-at`);
  assertMatch(entry.body, /\*\*Proposer \(Lead\)\*\*:\s*.+/m, `${entry.id} proposer`);
  assertMatch(entry.body, /\*\*Proposed at\*\*:\s*.+/m, `${entry.id} proposed-at`);
  assertMatch(entry.body, /\*\*Proposed decision\*\*:\s*.+/m, `${entry.id} proposed decision`);
  assertMatch(entry.body, /\*\*Reasoning\*\*:\s*.+/m, `${entry.id} reasoning`);
  assertMatch(entry.body, /\*\*Votes\*\*:/m, `${entry.id} votes header`);
  assertMatch(entry.body, /^-\s+.+:\s*`(propose|approve)`/m, `${entry.id} vote row`);
  assertMatch(entry.body, /Awaiting reviews from others\. The Proposer will finalize when consensus is reached\./m, `${entry.id} awaiting note`);
}

function validateResolved(entry) {
  assertMatch(entry.body, /\*\*Status\*\*:\s*`resolved`/m, `${entry.id} resolved status`);
  assertMatch(entry.body, /\*\*Parties\*\*:\s*.+/m, `${entry.id} parties`);
  assertMatch(entry.body, /\*\*Resolved at\*\*:\s*.+/m, `${entry.id} resolved-at`);
  assertMatch(entry.body, /\*\*Decision\*\*:\s*.+/m, `${entry.id} decision`);
  assertMatch(entry.body, /\*\*Rationale\*\*:\s*.+/m, `${entry.id} rationale`);
  assertMatch(entry.body, /\*\*Final Votes\*\*:/m, `${entry.id} final votes header`);
  assertMatch(entry.body, /^-\s+.+:\s*`(propose|approve)`/m, `${entry.id} final vote row`);
  assertMatch(entry.body, /\*\*Change Instructions\*\*:\s*see\s+`?\.spec\/decisions\/D-\d+\.md`?/m, `${entry.id} change instructions ref`);
  assertMatch(entry.body, /#### Source Document Action Items/m, `${entry.id} action items header`);
  assertMatch(entry.body, /\| Collaborator \| Source file \| Status \|/m, `${entry.id} action items table header`);
  assertMatch(entry.body, /\| .+ \| `?\.\/.+`? \| .+ \|/m, `${entry.id} action items row`);
}

function validateOpen(entry) {
  assertMatch(entry.body, /\*\*Status\*\*:\s*`open`/m, `${entry.id} open status`);
  assertMatch(entry.body, /\*\*Parties\*\*:\s*.+/m, `${entry.id} parties`);
  assertMatch(entry.body, /\*\*Nature\*\*:\s*.+/m, `${entry.id} nature`);
  assertMatch(entry.body, /\*\*Priority\*\*:\s*.+/m, `${entry.id} priority`);
  assertMatch(entry.body, /\*\*Found at\*\*:\s*.+/m, `${entry.id} found-at`);
  if (/\*\*Proposer \(Lead\)\*\*/.test(entry.body) || /\*\*Votes\*\*:/.test(entry.body)) {
    fail(`${entry.id}: open divergence must not carry proposer/votes (use 'proposed' for that)`);
  }
}

function validateFullyClosed(entry) {
  assertMatch(entry.body, /\*\*Status\*\*:\s*`fully-closed`/m, `${entry.id} fully-closed status`);
  assertMatch(entry.body, /\*\*Parties\*\*:\s*.+/m, `${entry.id} parties`);
  assertMatch(entry.body, /\*\*Resolved at\*\*:\s*.+/m, `${entry.id} resolved-at`);
  assertMatch(entry.body, /\*\*Closed at\*\*:\s*.+/m, `${entry.id} closed-at`);
  assertMatch(entry.body, /\*\*Decision\*\*:\s*.+/m, `${entry.id} decision`);
  assertMatch(entry.body, /\*\*Rationale\*\*:\s*.+/m, `${entry.id} rationale`);
  assertMatch(entry.body, /\*\*Final Votes\*\*:/m, `${entry.id} final votes header`);
  assertMatch(entry.body, /^-\s+.+:\s*`(propose|approve)`/m, `${entry.id} final vote row`);
  assertMatch(entry.body, /\*\*Change Instructions\*\*:\s*see\s+`?\.spec\/decisions\/D-\d+\.md`?/m, `${entry.id} change instructions ref`);
  assertMatch(entry.body, /#### Source Document Action Items/m, `${entry.id} action items header`);
  assertMatch(entry.body, /\| Collaborator \| Source file \| Status \|/m, `${entry.id} action items table header`);

  const tableMatch = entry.body.match(/\| Collaborator \| Source file \| Status \|[\s\S]*?(?=\n\n|\n#|$)/);
  if (!tableMatch) {
    fail(`${entry.id}: action items table not found`);
    return;
  }
  const rows = tableMatch[0]
    .split('\n')
    .filter((line) => /^\|/.test(line))
    .slice(2);
  if (rows.length === 0) {
    fail(`${entry.id}: action items table has no rows`);
    return;
  }
  for (const row of rows) {
    if (!/✅/.test(row)) {
      fail(`${entry.id}: fully-closed requires every action item to be ✅, got: ${row.trim()}`);
    }
  }
}

function validateTranscript(scenario, filePath) {
  const markers = transcriptRules[scenario];
  if (!markers) {
    console.error(`Unknown transcript scenario: ${scenario}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  assertIncludesInOrder(content, markers, `Transcript ${scenario}`);
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: node tests/validate-divergences.js <file> <open|proposed|resolved|fully-closed>');
    console.error('   or: node tests/validate-divergences.js transcript <scenario> <file>');
    process.exit(1);
  }

  if (args[0] === 'transcript') {
    const [, scenario, filePath] = args;
    if (!scenario || !filePath) {
      console.error('Usage: node tests/validate-divergences.js transcript <scenario> <file>');
      process.exit(1);
    }
    validateTranscript(scenario, filePath);
    if (process.exitCode) {
      process.exit(process.exitCode);
    }
    return;
  }

  let filePath;
  let mode;
  if (args[0] === 'divergence') {
    [, mode, filePath] = args;
  } else {
    [filePath, mode] = args;
  }

  if (!filePath || !mode) {
    console.error('Usage: node tests/validate-divergences.js <file> <open|proposed|resolved|fully-closed>');
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const entries = parseEntries(content);
  if (entries.length === 0) {
    console.error('No divergence entries found');
    process.exit(1);
  }

  for (const entry of entries) {
    if (mode === 'open') {
      validateOpen(entry);
    } else if (mode === 'proposed') {
      validateProposed(entry);
    } else if (mode === 'resolved') {
      validateResolved(entry);
    } else if (mode === 'fully-closed') {
      validateFullyClosed(entry);
    } else {
      console.error(`Unknown mode: ${mode}`);
      process.exit(1);
    }
  }

  if (process.exitCode) {
    process.exit(process.exitCode);
  }
}

main();