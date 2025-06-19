# StageCoder

StageCoder is a live code presentation and teaching toolkit for Visual Studio Code. Instantly type or replace code from snippets, highlight code, suppress distractions, and create new snippets from selections. Perfect for live demos, workshops, and teaching.

## Features

- **Type code from snippets**: Use the `StageCoder.Typecode` command to type out code from a snippet one character at a time, simulating live coding.
- **Replace code with snippets**: Use the `StageCoder.Replacecode` command to instantly replace a comment or selection with a snippet.
- **Clipboard as snippet**: Use `[clipboard]` as the snippet name to use the current clipboard contents as your snippet.
- **Reload snippets**: Use the `StageCoder.Reloadsnippets` command to reload all snippets from `.code-snippets` files in your workspace.
- **Create snippets from selection**: Right-click any selection and choose "Create snippet from selection" to save it as a new snippet in your workspace. It will be created in a folder called Snippets.
- **Highlight selected code**: Enable code highlight to dim all non-selected text, making your selection stand out. Toggle with `StageCoder.ToggleCodeHighlight` or enable/disable with `StageCoder.EnableSelectedCodeHighlight` and `StageCoder.DisableSelectedCodeHighlight`.
- **Suppress distractions**: When typing code from a snippet, all suggestions, Copilot, and popups are suppressed for a distraction-free presentation.
- **Settings persistence**: The code highlight feature is persisted as a workspace setting and restored between sessions.

## Commands & Shortcuts

| Command                                      | Description                                              | Shortcut Key         |
|----------------------------------------------|----------------------------------------------------------|----------------------|
| `StageCoder.Typecode`                        | Type code from a snippet (optionally provide a snippet name or `[clipboard]`). | *(No default)*       |
| `StageCoder.Replacecode`                     | Instantly replace selection with a snippet (optionally provide a snippet name or `[clipboard]`). | *(No default)*       |
| `StageCoder.Reloadsnippets`                  | Reload all snippets from `.code-snippets` files.          | *(No default)*       |
| `StageCoder.ToggleCodeHighlight`             | Toggle code highlight on/off.                            | *(No default)*       |
| `StageCoder.EnableSelectedCodeHighlight`     | Enable code highlight on selection.                      | *(No default)*       |
| `StageCoder.DisableSelectedCodeHighlight`    | Disable code highlight on selection.                     | *(No default)*       |
| `StageCoder.CreateSnippetFromSelection`      | Create a new snippet from the selected text.             | *(Context menu)*     |
| `stagecoder.escape`                          | Escape/exit typing mode.                                 | `Escape`, `Tab`      |
| `stagecoder.setsnippet`                      | Set snippet (legacy, use Typecode).                      | `Shift+Tab`          |
| `stagecoder.highlightSelection`              | Highlight selected code (legacy, use ToggleCodeHighlight).| `Ctrl+Alt+H`         |

> **Tip:** You can assign your own shortcuts to any command via VS Code's Keyboard Shortcuts UI.

## Stream Deck Integration

All StageCoder commands can be triggered using a Stream Deck with the [nicollasricas/decks-vscode](https://marketplace.visualstudio.com/items?itemName=nicollasricas.decks-vscode) extension. This allows you to control your live coding session hands-free!

## Extension Settings

- `stagecoder.selectedCodeHighlight`: Enable automatic code highlight on selection (default: false).

## Requirements

- No special requirements. For Stream Deck integration, install the [decks-vscode](https://marketplace.visualstudio.com/items?itemName=nicollasricas.decks-vscode) extension.

## Known Issues

- Some language servers or extensions may still show suggestions despite suppression settings.
- Copilot suggestions are suppressed as much as possible, but future Copilot updates may require further adjustments.

## Release Notes

### 1.0.0

Initial release of StageCoder: live code presentation, snippet management, distraction suppression, and Stream Deck integration.
