// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as CodePresenter from './stagecoder'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const typeCommand = vscode.commands.registerCommand("type", CodePresenter.onType);
	
	const activateCommand = vscode.commands.registerCommand('stagecoder.activate', function () {
		CodePresenter.loadSnippets();
		vscode.workspace.getConfiguration("editor").update("fontSize", "30", true);
	});
	
	const escapeCommand = vscode.commands.registerCommand('stagecoder.escape', function () {
		CodePresenter.setTyping(false);
	});

	const reloadSnippetsCommand = vscode.commands.registerCommand('StageCoder.Reloadsnippets', function () {
		CodePresenter.loadSnippets();
	});
	context.subscriptions.push(reloadSnippetsCommand);

	const replaceCodeCommand = vscode.commands.registerCommand('StageCoder.Replacecode', function (snippetName?: string) {
		CodePresenter.replaceCode(snippetName);
	});
	context.subscriptions.push(replaceCodeCommand);

	const typeCodeCommand = vscode.commands.registerCommand('StageCoder.Typecode', function (snippetName?: string) {
		CodePresenter.typeCode(snippetName);
	});
	context.subscriptions.push(typeCodeCommand);

	const toggleHighlightCommand = vscode.commands.registerCommand('StageCoder.ToggleCodeHighlight', function () {
		CodePresenter.highlightSelectedCode();
	});
	context.subscriptions.push(toggleHighlightCommand);

	const enableHighlightCommand = vscode.commands.registerCommand('StageCoder.EnableSelectedCodeHighlight', async function () {
		await CodePresenter.enableCodeHighlight();
		await CodePresenter.setSelectionBackgroundToEditorBackground(true);
		vscode.window.showInformationMessage('Selected code highlight enabled');
	});
	context.subscriptions.push(enableHighlightCommand);

	const disableHighlightCommand = vscode.commands.registerCommand('StageCoder.DisableSelectedCodeHighlight', async function () {
		await CodePresenter.disableCodeHighlight();
		await CodePresenter.setSelectionBackgroundToEditorBackground(false);
		vscode.window.showInformationMessage('Selected code highlight disabled');
	});
	context.subscriptions.push(disableHighlightCommand);

	// Listen for selection changes and dim non-selected text
	const selectionListener = vscode.window.onDidChangeTextEditorSelection((event) => {
		const isSelectedCodeHighlightEnabled = CodePresenter.isCodeHighlightEnabled()
		if (!isSelectedCodeHighlightEnabled) return;
		if (!event.selections || event.selections.length === 0) return;
		const selection = event.selections[0];
		if (!selection.isEmpty) {
			CodePresenter.highlightSelectedCode();
		} else {
			CodePresenter.clearHighlightDimming();
		}
	});
	context.subscriptions.push(selectionListener);

	// Load snippets on startup if a folder is open
	if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
		CodePresenter.loadSnippets();
	}

	// Reload snippets when folders change (e.g., opening a new folder)
	const folderChangeListener = vscode.workspace.onDidChangeWorkspaceFolders(() => {
		if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
			CodePresenter.loadSnippets();
		}
	});
	context.subscriptions.push(folderChangeListener);

	// In your activate function, read the setting and enable highlight if set
	const config = vscode.workspace.getConfiguration('stagecoder');

	context.subscriptions.push(typeCommand);
	context.subscriptions.push(activateCommand);
	context.subscriptions.push(escapeCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
