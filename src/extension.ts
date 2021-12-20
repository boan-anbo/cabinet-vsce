// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { posix } from 'path';
import { CardConvert } from './types';
import { CabinetCardIdentifier } from './cci';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	const folderUri = vscode.workspace.workspaceFolders[0].uri;

	const fileUri = folderUri.with({ path: posix.join(folderUri.path, 'test.json') });

	const readData = await (await vscode.workspace.fs.readFile(fileUri)).toString();

	const cards = CardConvert.toCards(readData);

	// const ccis = cards.map(c => CabinetCardIdentifier.fromCard(c).toJsonString());

	// console.log(ccis);

	// var regexHex = /^0x[0-9a-fA-F]+$/g;
	// var regexHexc = /^[0-9a-fA-F]+[h]$/g;
	// var regexDec = /^-?[0-9]+$/g;
	// var regexBin = /^0b[01]+$/g;
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

					markdownString.appendCodeblock(JSON.stringify(card), 'javascript');


					return {
						contents: [markdownString]
					};

				}
			}
			// if (testPattern.test(hoveredWord.toString())) {

			// 	console.log(hoveredWord);
			// 	// var input: Number = Number(parseInt(hoveredWord.substring(2), 2).toString());
			// 	markdownString.appendCodeblock(hoveredWord, 'javascript');

			// 	return {
			// 		contents: [markdownString]
			// 	};
			// }



			// else if (regexHex.test(hoveredWord.toString()) || regexHexc.test(hoveredWord.toString())) {

			// 	markdownString.appendCodeblock(`Dec:\n${parseInt(hoveredWord, 16)}\nBinary:\n${parseInt(hoveredWord, 16).toString(2)}`, 'javascript');

			// 	return {
			// 		contents: [markdownString]
			// 	};
			// }
			// else if (regexDec.test(hoveredWord.toString())) {

			// 	var input: Number = Number(hoveredWord.toString());
			// 	markdownString.appendCodeblock(`Hex:\n0x${input.toString(16).toUpperCase()}\nBinary:\n${input.toString(2).replace(/(^\s+|\s+$)/, '')} `, 'javascript');

			// 	return {
			// 		contents: [markdownString]
			// 	};

			// }
		}
	});

	context.subscriptions.push(hover);

	// // The command has been defined in the package.json file
	// // Now provide the implementation of the command with registerCommand
	// // The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('cabinet-vsce.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from cabinet-vsce!');
	// });

	// context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
