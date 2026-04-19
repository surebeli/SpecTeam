import * as vscode from 'vscode';
import { DivergenceProvider } from './divergenceProvider';

export function activate(context: vscode.ExtensionContext) {
  console.log('PhoenixTeam extension is now active!');

  const divergenceProvider = new DivergenceProvider(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath);
  vscode.window.registerTreeDataProvider('phoenixteam.divergences', divergenceProvider);

  let refreshDisposable = vscode.commands.registerCommand('phoenixteam.refresh', () => {
    divergenceProvider.refresh();
  });

  let alignDisposable = vscode.commands.registerCommand('phoenixteam.align', (node) => {
    if (!node || !node.label) return;
    
    // Extract D-xxx from label
    const match = node.label.match(/^(D-\d+)/);
    if (!match) return;
    
    const divergenceId = match[1];
    
    // Find or create terminal
    let terminal = vscode.window.terminals.find(t => t.name === 'Claude Code (Phoenix)');
    if (!terminal) {
      terminal = vscode.window.createTerminal('Claude Code (Phoenix)');
    }
    
    terminal.show();
    // Send the command into the terminal. We assume the user is inside an AI CLI loop or shell.
    terminal.sendText(`/phoenix-align ${divergenceId}`);
  });

  context.subscriptions.push(refreshDisposable, alignDisposable);
}

export function deactivate() {}
