// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import { CabinetNode } from 'cabinet-node';
import * as vscode from 'vscode';
import { CabinetCardIdentifier } from './cci';
import StateCore = require('markdown-it/lib/rules_core/state_core');
import type MarkdownIt from "markdown-it/lib"
import { cardsCompletionProvider } from './cabinet-core/cards-completion-provider';

import { cardLookupProvider } from './cabinet-core/card-lookup';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let cabinetNodeInstance: CabinetNode;

async function loadCabinetNode() {

	const folderUri = vscode.workspace.workspaceFolders[0].uri;

	cabinetNodeInstance = new CabinetNode(folderUri.fsPath, 'test.json');
}



export async function activate(context: vscode.ExtensionContext) {



	loadCabinetNode();

	console.log('Inited')

	context.subscriptions.push(cardLookupProvider(cabinetNodeInstance));

	// vscode.window.registerTreeDataProvider(
	// 	'cabinetCards',
	// 	new CabinetNotesProvider()
	//   );

	context.subscriptions.push(cardsCompletionProvider(cabinetNodeInstance));

	// return {
	// 	extendMarkdownIt(md: any) {
	// 		return md.use(example_plugin);
	// 	}
	// };

}


// /**
//  * An example plugin that adds a color to paragraphs
//  */
// export default function example_plugin(md: MarkdownIt): void {
// 	md.core.ruler.push("example", exampleRule)
// }

// function exampleRule(state: StateCore): boolean {
// 	for (const token of state.tokens) {
// 		if (token.type === "paragraph_open") {
// 			token.attrJoin("style", "color:red;")
// 		}
// 	}
// 	state.tokens[1].content = "fuck you";

// 	return true
// }


// this method is called when your extension is deactivated
export function deactivate() { }
