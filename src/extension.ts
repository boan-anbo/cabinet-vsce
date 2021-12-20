// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { posix } from 'path';
import { CardConvert } from './types';
import { CabinetCardIdentifier } from './cci';
import { CabinetNotesProvider } from './cabinetnotes-provider';
import StateCore = require('markdown-it/lib/rules_core/state_core');
import type MarkdownIt from "markdown-it/lib"
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	const folderUri = vscode.workspace.workspaceFolders[0].uri;

	const fileUri = folderUri.with({ path: posix.join(folderUri.path, 'test.json') });

	const readData = await (await vscode.workspace.fs.readFile(fileUri)).toString();

	const cards = CardConvert.toCards(readData);

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

			if (cci) {
				const card = cci.getCard(cards);
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
