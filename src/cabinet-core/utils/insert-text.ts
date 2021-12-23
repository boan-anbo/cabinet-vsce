import { Position } from "vscode";
import * as vscode from "vscode";

export const insertText = (text: string) => {
    const editor = vscode.window.activeTextEditor;

    // Get the document last line.
    if (editor) {
        editor?.edit(TextEditorEdit => {
            TextEditorEdit.replace(editor.selection, text);
        });
    }
}