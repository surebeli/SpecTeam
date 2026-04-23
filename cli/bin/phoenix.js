#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');

const PHOENIX_DIR = path.join(process.cwd(), '.phoenix');
const DIVERGENCES_FILE = path.join(PHOENIX_DIR, 'DIVERGENCES.md');

program
  .name('phoenix')
  .description('CLI for the PhoenixTeam workflow behind SpecTeam spec review and decision alignment')
  .version('1.0.0');

// Helper to run commands
function runCmd(cmd) {
  try {
    return execSync(cmd, { stdio: 'pipe' }).toString().trim();
  } catch (e) {
    return null;
  }
}

// 1. Install Command
program
  .command('install')
  .description('Installs PhoenixTeam workflow skills for local SpecTeam-style review and alignment flows')
  .option('-g, --global', 'Install globally to ~/.claude/commands')
  .action((options) => {
    console.log(chalk.cyan('🚀 Installing PhoenixTeam workflow skills...'));
    const sourceDir = path.resolve(__dirname, '../../plugin/skills');
    
    if (!fs.existsSync(sourceDir)) {
      console.log(chalk.red('❌ Could not find plugin/skills directory. Are you running this from the repository root?'));
      process.exit(1);
    }

    const targetBaseDir = options.global 
      ? path.join(require('os').homedir(), '.claude/commands')
      : path.join(process.cwd(), '.claude/commands');

    if (!fs.existsSync(targetBaseDir)) {
      fs.mkdirSync(targetBaseDir, { recursive: true });
    }

    const skills = fs.readdirSync(sourceDir).filter(f => fs.statSync(path.join(sourceDir, f)).isDirectory());
    let count = 0;

    for (const skill of skills) {
      const skillFile = path.join(sourceDir, skill, 'SKILL.md');
      if (fs.existsSync(skillFile)) {
        const destFile = path.join(targetBaseDir, `${skill}.md`);
        fs.copyFileSync(skillFile, destFile);
        count++;
      }
    }

    console.log(chalk.green(`✅ Successfully installed ${count} skills to ${targetBaseDir}`));
    console.log(chalk.yellow(`\nYou can now run e.g. '/phoenix-status' directly in Claude Code!`));
  });

// 2. Local Status UI Command
program
  .command('status')
  .description('View a quick local summary of DIVERGENCES and repo state')
  .action(() => {
    console.log(chalk.cyan('\n=== PhoenixTeam Workflow Status ===\n'));

    // Check Git
    const gitStatus = runCmd('git status --short');
    if (gitStatus === null) {
      console.log(chalk.red('❌ Not a git repository. PhoenixTeam requires Git.'));
      process.exit(1);
    }
    
    const branch = runCmd('git branch --show-current');
    const memberCode = runCmd('git config phoenix.member-code') || chalk.gray('(Not bound - run /phoenix-whoami)');
    
    console.log(`${chalk.bold('Identity:')} ${memberCode}`);
    console.log(`${chalk.bold('Branch:')}   ${chalk.green(branch)}`);
    console.log('');

    // Check .phoenix dir
    if (!fs.existsSync(PHOENIX_DIR)) {
      console.log(chalk.yellow('⚠️ .phoenix/ directory not found. Please run /phoenix-init in your AI assistant.'));
      return;
    }

    // Parse Divergences
    if (!fs.existsSync(DIVERGENCES_FILE)) {
      console.log(chalk.green('✅ No DIVERGENCES.md found. No tracked divergences yet.'));
      return;
    }

    const divergencesContent = fs.readFileSync(DIVERGENCES_FILE, 'utf-8');
    const openMatches = divergencesContent.match(/### (D-\d+):.*?🔴/g) || [];
    const proposedMatches = divergencesContent.match(/### (D-\d+):.*?🟡/g) || [];
    const resolvedMatches = divergencesContent.match(/### (D-\d+):.*?✅/g) || [];

    console.log(chalk.bold('📊 Divergence Summary:'));
    console.log(`  🔴 Open:     ${chalk.red(openMatches.length)}`);
    console.log(`  🟡 Proposed: ${chalk.yellow(proposedMatches.length)}`);
    console.log(`  ✅ Resolved: ${chalk.green(resolvedMatches.length)}`);
    console.log('');

    if (openMatches.length > 0 || proposedMatches.length > 0) {
      console.log(chalk.yellow('💡 Tip: Ask your AI assistant to run /phoenix-align to resolve open items!'));
    }
  });

// 3. SOS Command (Conflict Detection)
program
  .command('sos')
  .description('Detect Git merge conflicts and provide emergency guidance')
  .action(() => {
    const gitStatus = runCmd('git status --porcelain');
    if (gitStatus === null) {
      console.log(chalk.red('❌ Not a git repository.'));
      process.exit(1);
    }

    const lines = gitStatus.split('\n');
    const conflictedFiles = lines.filter(line => line.startsWith('UU') || line.startsWith('AA') || line.startsWith('DD'));

    if (conflictedFiles.length === 0) {
      console.log(chalk.green('✅ Git tree is clean. No merge conflicts detected.'));
      return;
    }

    console.log(chalk.red.bold('🚨 GIT MERGE CONFLICT DETECTED 🚨\n'));
    console.log(chalk.white('The following files are in a conflicted state:'));
    conflictedFiles.forEach(file => console.log(chalk.red(`  ${file}`)));
    
    console.log(chalk.yellow('\n⚠️  DO NOT RESOLVE .phoenix/ METADATA MANUALLY!'));
    console.log(chalk.cyan('Please open your AI assistant (e.g., Claude Code) and run:'));
    console.log(chalk.white.bold('\n    /phoenix-sos\n'));
    console.log(chalk.cyan('The AI will intelligently parse the markers and merge the state safely.'));
  });

// 4. Init Command (Scaffold)
program
  .command('init')
  .description('Setup basic Git repository and guide AI initialization')
  .action(() => {
    console.log(chalk.cyan('🚀 Preparing PhoenixTeam Workflow Environment...'));
    
    const isGit = runCmd('git rev-parse --is-inside-work-tree');
    if (!isGit) {
      console.log(chalk.yellow('Git repository not found. Initializing...'));
      runCmd('git init');
      console.log(chalk.green('✅ Initialized empty Git repository.'));
    } else {
      console.log(chalk.green('✅ Git repository detected.'));
    }

    if (!fs.existsSync(PHOENIX_DIR)) {
      fs.mkdirSync(PHOENIX_DIR, { recursive: true });
      console.log(chalk.green('✅ Created .phoenix/ directory structure.'));
    }

    console.log(chalk.magenta('\n✨ Environment ready! To complete initialization, open your AI assistant and run:'));
    console.log(chalk.white.bold('\n    /phoenix-init\n'));
  });

program.parse(process.argv);
