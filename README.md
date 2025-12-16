# Appian Expression Language AI Code Generator

An AI-powered VS Code/Cursor extension for generating Appian Expression Language (AEL) code with context-aware best practices.

## Features

- **Smart Prompt Generation**: Automatically builds optimized prompts for AI code generation
- **Context-Aware Best Practices**: Dynamically includes relevant Appian guidelines based on your request
- **713 Function References**: Comprehensive function library with examples and documentation
- **Keyboard Shortcuts**: Quick access via Cmd+Shift+A (Mac) or Ctrl+Shift+A (Windows)
- **Syntax Highlighting**: Custom syntax highlighting for Appian Expression Language

## Installation

1. Download the latest `.vsix` file from the releases
2. In VS Code/Cursor:
   - Open Command Palette (Cmd+Shift+P / Ctrl+Shift+P)
   - Select "Extensions: Install from VSIX"
   - Choose the downloaded `.vsix` file
3. Reload the editor

## Usage

### Generate Appian Code

1. Press **Cmd+Shift+A** (Mac) or **Ctrl+Shift+A** (Windows)
2. Describe the code you want to generate
3. Choose to copy prompt to clipboard or insert directly
4. Use with Cursor's AI features (Cmd+K)

### Quick Inline Generation

1. Press **Cmd+Alt+A** (Mac) or **Ctrl+Alt+A** (Windows)
2. Automatically copies prompt and inserts comment placeholder

## What's Included

### Best Practices Categories

The extension includes curated knowledge from official Appian documentation:

- **Core Rules**: Critical AEL syntax rules (no ternary operators, no JavaScript syntax)
- **Performance**: Optimization guidelines (loop limits, pagination)
- **Null Handling**: Functions and patterns for dealing with nulls
- **Local Variables**: Best practices for variable scoping and refresh behavior
- **Advanced**: Type casting, partial evaluation, complex patterns

### Function Reference

- 713 Appian functions with signatures, examples, and use cases
- Smart filtering to show the 15 most relevant functions
- Enriched documentation from Appian 25.4 official docs

## Version History

### 1.4.0 (Latest)
- Added context-aware best practices from 9 Appian documentation pages
- Enhanced prompt builder with dynamic filtering
- Improved system instructions with explicit syntax rules

### 1.3.2
- Enriched function documentation with examples and use cases
- Enhanced prompt formatting for better AI comprehension

### 1.2.0
- Added comprehensive function reference (713 functions)
- Implemented smart function filtering

## Development

### Project Structure

```
CodeCompletion/
├── unpacked-extension/
│   └── extension/
│       ├── src/              # TypeScript source files
│       ├── lib/              # Compiled JavaScript
│       ├── snippets/         # VS Code snippets
│       ├── appian-functions-reference.json
│       ├── appian-functions-docs.json
│       ├── appian-best-practices.json
│       └── package.json
└── scripts/                  # Build and conversion scripts
```

### Building

```bash
cd unpacked-extension/extension
vsce package --no-dependencies
```

## Requirements

- VS Code or Cursor IDE
- Appian development environment (for deploying generated code)

## Credits

Built for Appian developers by Appian Customer Success

## License

See LICENSE file for details
