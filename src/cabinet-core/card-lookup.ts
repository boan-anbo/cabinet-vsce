import { CabinetCardIdentifier, CabinetNode } from 'cabinet-node';

import * as vscode from 'vscode';

export const cardLookupProvider = (cabinetNode: CabinetNode): vscode.Disposable => {
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

			const cci = CabinetCardIdentifier.fromJsonString(captured[1]);

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
	return hover;

}