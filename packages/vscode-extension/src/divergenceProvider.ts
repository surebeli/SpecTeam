import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class DivergenceProvider implements vscode.TreeDataProvider<DivergenceItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<DivergenceItem | undefined | void> = new vscode.EventEmitter<DivergenceItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<DivergenceItem | undefined | void> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string | undefined) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: DivergenceItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: DivergenceItem): Thenable<DivergenceItem[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No dependency in empty workspace');
      return Promise.resolve([]);
    }

    if (element) {
      return Promise.resolve([]); // Flat list for now
    } else {
      const divergencesPath = path.join(this.workspaceRoot, '.spec', 'DIVERGENCES.md');
      if (this.pathExists(divergencesPath)) {
        return Promise.resolve(this.getDivergencesInFile(divergencesPath));
      } else {
        vscode.window.showInformationMessage('Workspace has no .spec/DIVERGENCES.md');
        return Promise.resolve([new DivergenceItem('No DIVERGENCES.md found', '', 'none', vscode.TreeItemCollapsibleState.None)]);
      }
    }
  }

  private getDivergencesInFile(filePath: string): DivergenceItem[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    const items: DivergenceItem[] = [];

    const lines = content.split('\n');
    let currentId = '';
    let currentTitle = '';
    let currentStatus = '';

    for (const line of lines) {
      const match = line.match(/^### (D-\d+): (.*)/);
      if (match) {
        currentId = match[1];
        currentTitle = match[2].trim();
        // Determine status from the title line first if it contains emojis
        if (currentTitle.includes('✅')) {
          currentStatus = 'resolved';
          currentTitle = currentTitle.replace('✅', '').trim();
          items.push(new DivergenceItem(`${currentId}: ${currentTitle}`, 'resolved', 'resolved', vscode.TreeItemCollapsibleState.None));
          continue;
        }
      }

      if (currentId && line.startsWith('**Status**:')) {
        const statusMatch = line.match(/\`(.*?)\`/);
        if (statusMatch) {
          currentStatus = statusMatch[1];
          let icon = 'open';
          if (currentStatus === 'open') icon = 'open';
          if (currentStatus === 'proposed') icon = 'proposed';
          if (currentStatus === 'resolved') icon = 'resolved';

          items.push(new DivergenceItem(`${currentId}: ${currentTitle}`, currentStatus, icon, vscode.TreeItemCollapsibleState.None));
          currentId = ''; // Reset
        }
      }
    }

    if (items.length === 0) {
      return [new DivergenceItem('All clear! No divergences.', '', 'resolved', vscode.TreeItemCollapsibleState.None)];
    }

    return items;
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
  }
}

export class DivergenceItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private readonly status: string,
    private readonly iconType: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}-${this.status}`;
    this.description = this.status;

    // We can use ThemeIcons built into VS Code
    if (this.iconType === 'open') {
      this.iconPath = new vscode.ThemeIcon('circle-outline', new vscode.ThemeColor('charts.red'));
      this.contextValue = 'resolvable';
    } else if (this.iconType === 'proposed') {
      this.iconPath = new vscode.ThemeIcon('git-pull-request', new vscode.ThemeColor('charts.yellow'));
      this.contextValue = 'resolvable';
    } else if (this.iconType === 'resolved') {
      this.iconPath = new vscode.ThemeIcon('check', new vscode.ThemeColor('charts.green'));
      this.contextValue = 'resolved';
    } else {
      this.iconPath = new vscode.ThemeIcon('info');
      this.contextValue = 'info';
    }
  }
}
