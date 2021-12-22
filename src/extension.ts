// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import { CabinetNode } from 'cabinet-node';
import * as vscode from 'vscode';
import { CabinetCardIdentifier } from './cci';
import StateCore = require('markdown-it/lib/rules_core/state_core');
import type MarkdownIt from "markdown-it/lib"
import { CabinetNotesProvider } from './cabinet-core/cabinetnotes-provider';
import { cardsCompletionProvider } from './cabinet-core/cards-completion-provider';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let cabinetNode: CabinetNode;

async function loadCabinetNode() {
	const folderUri = vscode.workspace.workspaceFolders[0].uri;
	cabinetNode = new CabinetNode(folderUri.fsPath, 'test.json');
}



export async function activate(context: vscode.ExtensionContext) {



	loadCabinetNode();

	console.log('Inited')

	const testPattern = /{(.+)}/;
	let hover = vscode.languages.registerHoverProvider({ scheme: '*', language: '*' }, {
		provideHover(document, position, token) {
			const hoveredWord = document.getText(document.getWordRangeAtPosition(position, /{{.+}}/));

			console.log(hoveredWord);

			const captured = hoveredWord.match(testPattern);
			console.log(captured)

			if (captured === null || captured.length < 2) {
				return;
			}

			const cci = new CabinetCardIdentifier().fromJsonString(captured[1]);

			if (cci && cabinetNode !== undefined) {
				const card = cabinetNode.getCardByCci(cci);
				if (card) {
					var markdownString = new vscode.MarkdownString();

					console.log(card.toMarkdown());
					// markdownString.appendCodeblock(card.toMarkdown(), 'markdown');
					markdownString.appendMarkdown(card.toMarkdown());

					return {
						contents: [markdownString]
					};

				}
			}
		}
	});

	context.subscriptions.push(hover);

	// vscode.window.registerTreeDataProvider(
	// 	'cabinetCards',
	// 	new CabinetNotesProvider()
	//   );

	context.subscriptions.push(cardsCompletionProvider(cabinetNode));

	return {
		extendMarkdownIt(md: any) {
			return md.use(example_plugin);
		}
	};

}


/**
 * An example plugin that adds a color to paragraphs
 */
export default function example_plugin(md: MarkdownIt): void {
	md.core.ruler.push("example", exampleRule)
}

function exampleRule(state: StateCore): boolean {
	for (const token of state.tokens) {
		if (token.type === "paragraph_open") {
			token.attrJoin("style", "color:red;")
		}
	}
	state.tokens[1].content = "fuck you";

	return true
}


// this method is called when your extension is deactivated
export function deactivate() { }
