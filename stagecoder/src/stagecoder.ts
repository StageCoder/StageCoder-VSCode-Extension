import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let isTyping = false;
let currentSnippet = '';
let currentPosition = 0;
let snippets: Array<{ prefix: string, body: string[] }> = [];

let previousEditorSettings: any = undefined;

const allLanguages = [
	'javascript','typescript','python','markdown','json','html','css','cpp','c','csharp','java','go','php','ruby','rust','kotlin','swift','dart','scala','r','perl','lua','powershell','shellscript','yaml','xml','plaintext'
];

async function suppressEditorPopups(suppress: boolean) {
	const editorConfig = vscode.workspace.getConfiguration('editor');
	const cspellConfig = vscode.workspace.getConfiguration('cSpell');
	const copilotConfig = vscode.workspace.getConfiguration('github.copilot');
	const copilotEditorConfig = vscode.workspace.getConfiguration('github.copilot.editor');
	const configTargets = [vscode.ConfigurationTarget.Workspace, vscode.ConfigurationTarget.Global];
	if (suppress) {
		if (!previousEditorSettings) {
			previousEditorSettings = {
				quickSuggestions: editorConfig.get('quickSuggestions'),
				parameterHints: editorConfig.get('parameterHints.enabled'),
				hover: editorConfig.get('hover.enabled'),
				suggestOnTriggerCharacters: editorConfig.get('suggestOnTriggerCharacters'),
				inlineSuggest: editorConfig.get('inlineSuggest.enabled'),
				lightbulb: editorConfig.get('lightbulb.enabled'),
				cSpellEnabled: cspellConfig.inspect('enabled')?.defaultValue !== undefined ? cspellConfig.get('enabled') : undefined,
				copilotEnabled: copilotConfig.inspect('enable')?.defaultValue !== undefined ? copilotConfig.get('enable') : undefined,
				copilotInlineEnabled: copilotConfig.inspect('inlineSuggest.enable')?.defaultValue !== undefined ? copilotConfig.get('inlineSuggest.enable') : undefined,
				copilotAutoCompletions: copilotEditorConfig.inspect('enableAutoCompletions')?.defaultValue !== undefined ? copilotEditorConfig.get('enableAutoCompletions') : undefined,
				copilotInlineCompletions: copilotEditorConfig.inspect('enableInlineCompletions')?.defaultValue !== undefined ? copilotEditorConfig.get('enableInlineCompletions') : undefined,
			};
			const suggestKeys = [
				'showWords','showSnippets','showMethods','showFunctions','showVariables','showClasses','showModules','showProperty','showConstructor','showField','showKeyword','showText','showColor','showReference','showEnum','showFile','showFolder','showConstant','showStruct','showEvent','showOperator','showTypeParameter'
			];
			previousEditorSettings.suggest = {};
			for (const key of suggestKeys) {
				previousEditorSettings.suggest[key] = editorConfig.get(`suggest.${key}`);
			}
		}
		await editorConfig.update('quickSuggestions', false, vscode.ConfigurationTarget.Workspace);
		await editorConfig.update('parameterHints.enabled', false, vscode.ConfigurationTarget.Workspace);
		await editorConfig.update('hover.enabled', false, vscode.ConfigurationTarget.Workspace);
		await editorConfig.update('suggestOnTriggerCharacters', false, vscode.ConfigurationTarget.Workspace);
		await editorConfig.update('inlineSuggest.enabled', false, vscode.ConfigurationTarget.Workspace);
		await editorConfig.update('lightbulb.enabled', false, vscode.ConfigurationTarget.Workspace);
		if (typeof cspellConfig.inspect('enabled')?.defaultValue !== 'undefined') {
			await cspellConfig.update('enabled', false, vscode.ConfigurationTarget.Workspace);
		}
		for (const target of configTargets) {
			if (typeof copilotConfig.inspect('enable')?.defaultValue !== 'undefined') {
				await copilotConfig.update('enable', false, target);
			}
			if (typeof copilotConfig.inspect('inlineSuggest.enable')?.defaultValue !== 'undefined') {
				await copilotConfig.update('inlineSuggest.enable', false, target);
			}
			if (typeof copilotEditorConfig.inspect('enableAutoCompletions')?.defaultValue !== 'undefined') {
				await copilotEditorConfig.update('enableAutoCompletions', false, target);
			}
			if (typeof copilotEditorConfig.inspect('enableInlineCompletions')?.defaultValue !== 'undefined') {
				await copilotEditorConfig.update('enableInlineCompletions', false, target);
			}
		}
		const suggestKeys = [
			'showWords','showSnippets','showMethods','showFunctions','showVariables','showClasses','showModules','showProperty','showConstructor','showField','showKeyword','showText','showColor','showReference','showEnum','showFile','showFolder','showConstant','showStruct','showEvent','showOperator','showTypeParameter'
		];
		for (const key of suggestKeys) {
			if (typeof editorConfig.inspect(`suggest.${key}`)?.defaultValue !== 'undefined') {
				await editorConfig.update(`suggest.${key}`, false, vscode.ConfigurationTarget.Workspace);
			}
		}
		for (const lang of allLanguages) {
			await vscode.workspace.getConfiguration('', { languageId: lang }).update('editor.quickSuggestions', false, vscode.ConfigurationTarget.Workspace);
			await vscode.workspace.getConfiguration('', { languageId: lang }).update('editor.suggestOnTriggerCharacters', false, vscode.ConfigurationTarget.Workspace);
		}
	} else if (previousEditorSettings) {
		await editorConfig.update('quickSuggestions', previousEditorSettings.quickSuggestions, vscode.ConfigurationTarget.Workspace);
		await editorConfig.update('parameterHints.enabled', previousEditorSettings.parameterHints, vscode.ConfigurationTarget.Workspace);
		await editorConfig.update('hover.enabled', previousEditorSettings.hover, vscode.ConfigurationTarget.Workspace);
		await editorConfig.update('suggestOnTriggerCharacters', previousEditorSettings.suggestOnTriggerCharacters, vscode.ConfigurationTarget.Workspace);
		await editorConfig.update('inlineSuggest.enabled', previousEditorSettings.inlineSuggest, vscode.ConfigurationTarget.Workspace);
		await editorConfig.update('lightbulb.enabled', previousEditorSettings.lightbulb, vscode.ConfigurationTarget.Workspace);
		if (typeof cspellConfig.inspect('enabled')?.defaultValue !== 'undefined') {
			await cspellConfig.update('enabled', previousEditorSettings.cSpellEnabled, vscode.ConfigurationTarget.Workspace);
		}
		for (const target of configTargets) {
			if (typeof copilotConfig.inspect('enable')?.defaultValue !== 'undefined') {
				await copilotConfig.update('enable', previousEditorSettings.copilotEnabled, target);
			}
			if (typeof copilotConfig.inspect('inlineSuggest.enable')?.defaultValue !== 'undefined') {
				await copilotConfig.update('inlineSuggest.enable', previousEditorSettings.copilotInlineEnabled, target);
			}
			if (typeof copilotEditorConfig.inspect('enableAutoCompletions')?.defaultValue !== 'undefined') {
				await copilotEditorConfig.update('enableAutoCompletions', previousEditorSettings.copilotAutoCompletions, target);
			}
			if (typeof copilotEditorConfig.inspect('enableInlineCompletions')?.defaultValue !== 'undefined') {
				await copilotEditorConfig.update('enableInlineCompletions', previousEditorSettings.copilotInlineCompletions, target);
			}
		}
		const suggestKeys = Object.keys(previousEditorSettings.suggest || {});
		for (const key of suggestKeys) {
			if (typeof editorConfig.inspect(`suggest.${key}`)?.defaultValue !== 'undefined') {
				await editorConfig.update(`suggest.${key}`, previousEditorSettings.suggest[key], vscode.ConfigurationTarget.Workspace);
			}
		}
		for (const lang of allLanguages) {
			await vscode.workspace.getConfiguration('', { languageId: lang }).update('editor.quickSuggestions', undefined, vscode.ConfigurationTarget.Workspace);
			await vscode.workspace.getConfiguration('', { languageId: lang }).update('editor.suggestOnTriggerCharacters', undefined, vscode.ConfigurationTarget.Workspace);
		}
		previousEditorSettings = undefined;
	}
}

export async function setTyping(value: boolean) {
	isTyping = value;
	await suppressEditorPopups(value);
}

export function loadSnippets() {
	const folders = vscode.workspace.workspaceFolders;
	if (!folders) return;

	snippets = []; // Clear previous snippets

	function walkDir(dir: string) {
		fs.readdir(dir, { withFileTypes: true }, (err, files) => {
			if (err) return;

			files.forEach(file => {
				const fullPath = path.join(dir, file.name);
				if (file.isDirectory()) {
					walkDir(fullPath);
				} else if (file.name.endsWith('.code-snippets')) {
					fs.readFile(fullPath, (readErr, data) => {
						if (readErr) return;

						let snippetFile;
						try {
							snippetFile = JSON.parse(data.toString());
						} catch (e) {
							console.warn('Invalid JSON in', fullPath);
							return;
						}

						Object.keys(snippetFile).forEach(key => {
							const snip = snippetFile[key];
							if (snip && typeof snip.prefix === 'string' && snip.body) {
								let bodyArr = Array.isArray(snip.body) ? snip.body : [snip.body];
								snippets.push({ prefix: snip.prefix, body: bodyArr });
							}
						});
					});
				}
			});
		});
	}

	folders.forEach(folder => {
		walkDir(folder.uri.fsPath);
	});
}

export async function handleSnippet(snippetArg?: string, mode: 'type' | 'replace' = 'type') {
	const editor = vscode.window.activeTextEditor;
	if (!editor) return;

	let snippetName = snippetArg;
	let selection = editor.selection;

	if (!snippetName) {
		if (selection.isEmpty) {
			const start = new vscode.Position(selection.start.line, 0);
			const end = new vscode.Position(
				selection.active.line,
				editor.document.lineAt(selection.active.line).range.end.character
			);
			selection = new vscode.Selection(start, end);
		}
		snippetName = editor.document.getText(selection);
	}

	const originalText = snippetName;

	// Remove leading whitespace, tabs, etc.
	for (let i = 0; i < snippetName.length; i++) {
		if (' \t\n\r\v'.includes(snippetName[i])) {
			vscode.commands.executeCommand('default:type', { text: snippetName[i] });
		} else {
			snippetName = snippetName.substring(i);
			break;
		}
	}

	// Cleanup comment markers
	snippetName = snippetName
		.replace('//TODO:', '')
		.replace(/^\/\//, '')
		.replace(/^\/\*/, '')
		.replace(/\*\/$/, '')
		.replace(/^@\*/, '')
		.replace(/\*@/, '');

	if (snippets.length > 0 || snippetName.toLowerCase() === '[clipboard]') {
		if (snippetName.toLowerCase() === '[clipboard]') {
			const clipboardText = await vscode.env.clipboard.readText();
			if (mode === 'replace') {
				await editor.edit(editBuilder => {
					editBuilder.replace(selection, clipboardText);
				});
			} else {
				await editor.edit(editBuilder => {
					editBuilder.replace(selection, '');
				});
				currentSnippet = clipboardText;
				currentPosition = 0;
				isTyping = true;
			}
			return;
		}
		const filteredSnippets = snippets.filter(
			s => s.prefix.toLowerCase() === snippetName.toLowerCase()
		);

		if (filteredSnippets.length > 0) {
			if (mode === 'replace') {
				await editor.edit(editBuilder => {
					editBuilder.replace(selection, filteredSnippets[0].body.join('\n'));
				});
			} else {
				await editor.edit(editBuilder => {
					editBuilder.replace(selection, '');
				});
				currentSnippet = filteredSnippets[0].body.join('\n');
				currentPosition = 0;
				isTyping = true;
			}
		} else {
			vscode.commands.executeCommand('default:type', { text: originalText });
			vscode.window.showInformationMessage(`Snippet with the name "${snippetName}" not found`);
			isTyping = false;
		}
	}
}

export async function typeCode(snippetArg?: string) {
	await setTyping(true);
	handleSnippet(snippetArg, 'type');
}

export async function replaceCode(snippetArg?: string) {
	await setTyping(true);
	handleSnippet(snippetArg, 'replace');
}

export async function onType(text: { text: string }) {
    if (isTyping) {
		if (currentPosition < currentSnippet.length) {
			text.text = currentSnippet[currentPosition];
			currentPosition++;
			return vscode.commands.executeCommand('default:type', text);
		}
	} else {
		return vscode.commands.executeCommand('default:type', text);
	}
}

let highlightDecorationType: vscode.TextEditorDecorationType | undefined;
let selectionClearDecorationType: vscode.TextEditorDecorationType | undefined;
let previousSelectionBackground: string | undefined = undefined;

async function setSelectionBackgroundToEditorBackground(enable: boolean) {
	const config = vscode.workspace.getConfiguration('workbench');
	const colorCustomizations = config.get<any>('colorCustomizations') || {};
	if (enable) {
		if (previousSelectionBackground === undefined && colorCustomizations['editor.selectionBackground']) {
			previousSelectionBackground = colorCustomizations['editor.selectionBackground'];
		}
		// Try to get the editor background color, fallback to default dark
		const editorBg = colorCustomizations['editor.background'] || '#1e1e1e';
		colorCustomizations['editor.selectionBackground'] = editorBg;
		await config.update('colorCustomizations', colorCustomizations, vscode.ConfigurationTarget.Workspace);
	} else {
		clearHighlightDimming();
		// Create a new object without editor.selectionBackground to avoid mutating the proxy
		const newCustomizations: any = {};
		for (const key in colorCustomizations) {
			if (key !== 'editor.selectionBackground') {
				newCustomizations[key] = colorCustomizations[key];
			}
		}
		await config.update('colorCustomizations', newCustomizations, vscode.ConfigurationTarget.Workspace);
		previousSelectionBackground = undefined;
	}
	
}

export { setSelectionBackgroundToEditorBackground };

export function clearHighlightDimming() {
	const editor = vscode.window.activeTextEditor;
	if (editor && highlightDecorationType) {
		editor.setDecorations(highlightDecorationType, []);
	}
	if (editor && selectionClearDecorationType) {
		editor.setDecorations(selectionClearDecorationType, []);
	}
}

export async function highlightSelectedCode() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showInformationMessage('No active editor');
		return;
	}

	const selection = editor.selection;
	console.log('Highlighting selection:', selection);
	if (highlightDecorationType) {
		highlightDecorationType.dispose();
	}
	if (selectionClearDecorationType) {
		selectionClearDecorationType.dispose();
	}
	// Get user-configured opacity for dimming
	const config = vscode.workspace.getConfiguration('stagecoder');
	const dimOpacity = config.get<number>('dimOpacity', 0.2);
	// Use opacity property to dim the text but preserve syntax highlighting
	highlightDecorationType = vscode.window.createTextEditorDecorationType({
		opacity: dimOpacity.toString(),
		isWholeLine: false
	});
	selectionClearDecorationType = vscode.window.createTextEditorDecorationType({
		backgroundColor: new vscode.ThemeColor('editor.background'),
		border: 'none',
		color: undefined,
		textDecoration: 'none; background: unset;'
	});

	const rangesToDim: vscode.Range[] = [];
	if (selection.start.line > 0) {
		rangesToDim.push(new vscode.Range(0, 0, selection.start.line, 0));
	}
	if (selection.end.line < editor.document.lineCount - 1) {
		rangesToDim.push(new vscode.Range(selection.end.line + 1, 0, editor.document.lineCount - 1, editor.document.lineAt(editor.document.lineCount - 1).text.length));
	}
	if (selection.start.line === selection.end.line) {
		if (selection.start.character > 0) {
			rangesToDim.push(new vscode.Range(selection.start.line, 0, selection.start.line, selection.start.character));
		}
		const lineLen = editor.document.lineAt(selection.start.line).text.length;
		if (selection.end.character < lineLen) {
			rangesToDim.push(new vscode.Range(selection.end.line, selection.end.character, selection.end.line, lineLen));
		}
	} else {
		if (selection.start.character > 0) {
			rangesToDim.push(new vscode.Range(selection.start.line, 0, selection.start.line, selection.start.character));
		}
		const lastLineLen = editor.document.lineAt(selection.end.line).text.length;
		if (selection.end.character < lastLineLen) {
			rangesToDim.push(new vscode.Range(selection.end.line, selection.end.character, selection.end.line, lastLineLen));
		}
	}

	editor.setDecorations(highlightDecorationType, rangesToDim);

	// Remove the selection highlight by applying a transparent decoration
	if (!selection.isEmpty) {
		editor.setDecorations(selectionClearDecorationType, [selection]);
	}

	await setSelectionBackgroundToEditorBackground(true);
}

export async function createSnippetFromSelection() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showInformationMessage('No active editor');
		return;
	}
	const selection = editor.selection;
	if (selection.isEmpty) {
		vscode.window.showInformationMessage('No text selected');
		return;
	}
	const selectedText = editor.document.getText(selection);
	const snippetName = await vscode.window.showInputBox({
		prompt: 'Enter a name for the new snippet',
		placeHolder: 'Snippet name'
	});
	if (!snippetName) {
		vscode.window.showInformationMessage('Snippet creation cancelled');
		return;
	}
	const snippetObj = {
		[snippetName]: {
			"prefix": snippetName,
			"body": selectedText.split('\n'),
			"description": snippetName
		}
	};
	const fsPath = vscode.Uri.file(
		`${vscode.workspace.workspaceFolders?.[0].uri.fsPath || ''}/Snippets/${snippetName}.code-snippets`
	);
	await vscode.workspace.fs.writeFile(fsPath, Buffer.from(JSON.stringify(snippetObj, null, 2), 'utf8'));
	vscode.window.showInformationMessage(`Snippet '${snippetName}' created in Snippets folder.`);
	loadSnippets(); // Reload snippets to include the new one
}

function getHighlightConfig() {
	return vscode.workspace.getConfiguration('stagecoder');
}

export function isCodeHighlightEnabled() {
	return getHighlightConfig().get('selectedCodeHighlight', false);
}

export function enableCodeHighlight() {
	getHighlightConfig().update('selectedCodeHighlight', true, vscode.ConfigurationTarget.Workspace);
	setSelectionBackgroundToEditorBackground(true);
}

export function disableCodeHighlight() {
	getHighlightConfig().update('selectedCodeHighlight', false, vscode.ConfigurationTarget.Workspace);
	setSelectionBackgroundToEditorBackground(false);
}
