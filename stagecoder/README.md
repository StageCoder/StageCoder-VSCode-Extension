# StageCoder for Visual Studio Code

StageCoder is an extension for live code presentations, workshops, and teaching in VS Code. It helps you present code smoothly, highlight selections, and manage code snippets—all while suppressing distractions like suggestions and Copilot.

## Code Highlighting

Easily highlight code to focus your audience:

![Highlight feature demo](stagecoder/media/highlight.gif)

## Type Code from Snippet

Simulate live typing for presentations:

![TypeCode feature demo](stagecoder/media/typecode.gif)

## Features at a Glance

- **Type code from snippets**: Simulate live typing of code from a snippet or your clipboard.
- **Replace code with snippets**: Instantly replace a selection or comment with a snippet or clipboard content.
- **Create snippets from selection**: Right-click any selection and choose "Create snippet from selection" to save it for later use.
- **Highlight code**: Dim all non-selected text to focus your audience's attention. Toggle with a shortcut.
- **Distraction suppression**: While typing or replacing code, all suggestions, Copilot, and popups are suppressed. Suggestions can be optionally allowed.
- **Stream Deck support**: Use the command names `StageCoder.Typecode` and `StageCoder.Replacecode` for Stream Deck integration.

## How to Use (Command Palette)

Open the Command Palette with <kbd>Ctrl+Shift+P</kbd> (or <kbd>Cmd+Shift+P</kbd> on Mac) and search for:

- **Type code from snippet**: Simulate typing code from a named snippet or `[clipboard]`.
- **Replace code with snippet**: Instantly replace selection with a named snippet or `[clipboard]`.
- **Reload snippets**: Reload all `.code-snippets` files in your workspace.
- **Create snippet from selection**: Save the current selection as a new snippet (also available in the right-click context menu).
- **Toggle code highlight**: Turn code highlighting on or off (dims non-selected text).
- **Enable/Disable code highlight**: Explicitly enable or disable code highlighting.

## Keyboard Shortcuts

| Action                        | Shortcut         |
|-------------------------------|------------------|
| Toggle code highlight         | Ctrl+Shift+H     |
| Type code from snippet        | Shift+Tab        |
| Escape typing mode            | Escape, Tab      |

> You can customize shortcuts in VS Code’s Keyboard Shortcuts settings.

## Stream Deck Integration

For hands-free control, use the [decks-vscode](https://marketplace.visualstudio.com/items?itemName=nicollasricas.decks-vscode) extension. Assign the following command IDs to your Stream Deck:

- `StageCoder.Typecode`
- `StageCoder.Replacecode`

## Settings

- `stagecoder.selectedCodeHighlight` (boolean): Enable automatic code highlight on selection (default: false).
- `stagecoder.dimOpacity` (number): Opacity level for dimmed code when highlighting (default: 0.2).
- `stagecoder.allowSuggestions` (boolean): Allow intellisense suggestions during snippet typing (default: false).

## Requirements

- No special requirements. For Stream Deck, install the [decks-vscode](https://marketplace.visualstudio.com/items?itemName=nicollasricas.decks-vscode) extension.

## Known Issues

- Some language servers or extensions may still show suggestions despite suppression settings.
- Copilot suppression is best-effort and may require updates if Copilot changes.

## License

MIT License © 2025 Jimmy Engstrom
