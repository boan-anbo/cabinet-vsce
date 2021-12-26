import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { posix } from 'path';
import { CardConvert } from 'cabinet-node';

export class CabinetNotesProvider implements vscode.TreeDataProvider<CardItem> {
    constructor() { }

    getTreeItem(element: CardItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: CardItem): Thenable<CardItem[]> {

        return Promise.resolve(this.getDepsInPackageJson('test.json'));
    }

    /**
     * Given the path to package.json, read all its dependencies and devDependencies.
     */
    private async getDepsInPackageJson(cabinetFilePath: string): Promise<CardItem[]> {
        const workspaces = vscode.workspace.workspaceFolders;
        if (!workspaces) {
            vscode.window.showErrorMessage('No workspace folder is opened.');
            return [];
        }
        const folderUri = workspaces[0].uri;

        const fileUri = folderUri.with({ path: posix.join(folderUri.path, cabinetFilePath) });

        const readData = await (await vscode.workspace.fs.readFile(fileUri)).toString();

        const cards = CardConvert.toCards(readData);
        return cards.map(card => {
            return new CardItem(card.text, card.source?.title ?? '', vscode.TreeItemCollapsibleState.None);
        });
    }
}

class CardItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        private version: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label}-${this.version}`;
        this.description = this.version;
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
    };
}
