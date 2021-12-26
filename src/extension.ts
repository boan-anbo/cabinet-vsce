// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import { CabinetNode } from 'cabinet-node';
import * as vscode from 'vscode';
import { cardsCompletionProvider } from './cabinet-core/cards-completion-provider';

import { cardLookupProvider } from './cabinet-core/card-lookup';
import { searchCardsCommand } from './cabinet-core/commands/search-cards-command';
import { cabinetPreviewPanel, showPreview, showPreviewCommand } from './cabinet-core/webviews/preview-panel';
import { CabinetNodeApi } from './api/cabinet-node-api';
import { markdownChangePreviewListener } from './cabinet-core/liseners/mardown-change-preview-listener';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let cabinetNodeInstance: CabinetNode;

async function loadCabinetNode() {

	const workspaces = vscode.workspace.workspaceFolders;
	if (!workspaces) {
		vscode.window.showErrorMessage('No workspace folder is opened.');
		return;
	}
	const folderUri = workspaces[0].uri;

	cabinetNodeInstance = new CabinetNode(folderUri.fsPath, 'test.json');

	return cabinetNodeInstance;
}

let cabinetNodeApi: CabinetNodeApi;

async function initCabinetNodeApi(cabinetNode: CabinetNode) {

	cabinetNodeApi = new CabinetNodeApi(cabinetNode);
}


export async function activate(context: vscode.ExtensionContext) {

	loadCabinetNode();

	initCabinetNodeApi(cabinetNodeInstance);

	console.log('Inited')

	context.subscriptions.push(searchCardsCommand(cabinetNodeInstance));

	context.subscriptions.push(cardLookupProvider(cabinetNodeInstance));

	context.subscriptions.push(showPreviewCommand(cabinetNodeInstance));

	vscode.workspace.onDidChangeTextDocument(markdownChangePreviewListener);

	// vscode.window.registerTreeDataProvider(
	// 	'cabinetCards',
	// 	new CabinetNotesProvider()
	//   );

	context.subscriptions.push(cardsCompletionProvider(cabinetNodeInstance));


}

// this method is called when your extension is deactivated
export function deactivate() { }
