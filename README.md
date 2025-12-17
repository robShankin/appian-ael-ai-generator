# Appian Expression Language AI Code Generator

> AI-powered code generation for Appian developers using VS Code or Cursor IDE

[![Version](https://img.shields.io/badge/version-1.4.0-blue.svg)](https://github.com/robShankin/appian-ael-ai-generator)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## What Is This?

A VS Code/Cursor extension that helps you generate Appian Expression Language (AEL) code using AI. Instead of writing complex Appian expressions from scratch, just describe what you want in plain English and let AI generate the code for you.

**Example:**
- You type: *"Create a dropdown for status with options Active, Inactive, Pending"*
- AI generates: A complete `a!dropdownField()` with proper syntax, local variables, and save logic

## Key Features

✨ **Smart Prompt Generation** - Automatically builds AI-optimized prompts with relevant context
📚 **713 Appian Functions** - Comprehensive function library with examples and documentation
🎯 **Context-Aware Best Practices** - Dynamically includes relevant Appian guidelines based on your request
⌨️ **Keyboard Shortcuts** - Quick access via `Cmd+Shift+A` (Mac) or `Ctrl+Shift+A` (Windows)
🎨 **Syntax Highlighting** - Custom syntax highlighting for Appian Expression Language
🚀 **Zero Runtime Dependencies** - Pure JavaScript, works immediately after building

## How It Works

```
1. Press Cmd+Shift+A and describe what you want
2. Extension builds an optimized prompt with:
   ✓ Critical AEL syntax rules
   ✓ Relevant best practices (performance, null handling, etc.)
   ✓ Top 15 most relevant function references
3. Choose your preferred workflow:
   • Send to chat - Auto-opens chat (just press Cmd+V)
   • Generate inline - Auto-triggers Cmd+K (press Enter)
   • Copy to clipboard - Manual paste workflow
   • Open in new file - Review before generating
   • Insert at cursor - Add to current document
4. Get production-ready Appian code
```

### What Makes This Smart?

**Context-Aware Filtering:**
- Request mentions "loop" → Gets performance limits (500 items max, nesting rules)
- Request mentions "null" → Gets null handling functions (`a!isNullOrEmpty`, `a!defaultValue`)
- Request mentions "query" → Gets pagination and optimization tips
- Request mentions "variables" → Gets scoping and refresh behavior rules

## Quick Start

Ready to use it? Head over to **[QUICK_START.md](QUICK_START.md)** for step-by-step instructions on:
- Building the extension from source
- Installing it in Cursor or VS Code
- Using it to generate your first Appian code

**Time to get started:** ~5 minutes

## What's Included

### Best Practices Knowledge Base
Curated from 9 official Appian 25.4 documentation pages:
- **Core Rules** - Critical AEL syntax (no ternary operators, no JavaScript operators)
- **Performance** - Loop limits, pagination, query optimization
- **Null Handling** - Patterns for dealing with missing data
- **Local Variables** - Scoping, refresh behavior, best practices
- **Advanced** - Type casting, partial evaluation, complex patterns

### Function Reference
- 713 Appian functions with full signatures
- Real code examples for each function
- Use case explanations
- Smart keyword-based filtering

### Code Quality
The extension ensures generated code:
- ✅ Uses correct AEL syntax (no JavaScript/Java patterns)
- ✅ Follows Appian performance guidelines
- ✅ Includes proper null handling
- ✅ Uses appropriate local variable patterns
- ✅ Avoids common anti-patterns

## Project Structure

```
appian-ael-ai-generator/
├── README.md                          # You are here
├── QUICK_START.md                     # Build & installation guide
├── VERSION_1.4.0_SUMMARY.md          # Latest version details
│
├── unpacked-extension/
│   └── extension/
│       ├── src/                       # TypeScript source files
│       │   ├── extension.ts
│       │   ├── appianCodeGenerator.ts
│       │   ├── promptBuilder.ts
│       │   ├── functionFilter.ts
│       │   └── types.ts
│       │
│       ├── lib/                       # Compiled JavaScript (ready to use)
│       │   ├── extension.js
│       │   ├── appianCodeGenerator.js
│       │   ├── promptBuilder.js
│       │   └── functionFilter.js
│       │
│       ├── appian-best-practices.json     # Curated best practices
│       ├── appian-functions-docs.json     # Enriched function documentation
│       ├── appian-functions-reference.json # 713 function signatures
│       ├── snippets/                      # VS Code snippets
│       ├── syntaxes/                      # Syntax highlighting
│       └── package.json                   # Extension manifest
│
└── scripts/
    └── convert-functions.js           # Function data converter
```

## Version History

### v1.4.1 (Current)
- 🐛 Fixed autocomplete bug for 5 functions: now(), timezone(), timezoneid(), today(), infinity()
- 🔧 Corrected errant "1" prefix in function snippets (e.g., "1now()" → "now()")

### v1.4.0
- ✨ Added context-aware best practices from Appian documentation
- 🎯 Dynamic filtering based on request keywords
- 📝 Enhanced system instructions with explicit syntax rules
- 🔧 Improved prompt builder with 5 practice categories

### v1.3.2
- 📚 Enriched function documentation with examples and use cases
- 🎨 Enhanced prompt formatting for better AI comprehension

### v1.2.0
- 📦 Added comprehensive function reference (713 functions)
- 🔍 Implemented smart function filtering

## Requirements

- **To Build:** Node.js and `vsce` package tool
- **To Use:** VS Code or Cursor IDE
- **Appian Version:** Documentation based on Appian 25.4

## Contributing

Contributions are welcome! To contribute:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit (`git commit -m 'Add amazing feature'`)
5. Push (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Areas for Contribution
- Additional best practices from newer Appian versions
- Enhanced function filtering algorithms
- More usage examples and documentation
- Bug fixes and performance improvements

## Maintenance

### Updating Best Practices
To add or modify best practices:
1. Edit `unpacked-extension/extension/appian-best-practices.json`
2. Adjust categories, priorities, or keywords as needed
3. Rebuild with `vsce package --no-dependencies`

### Updating Function References
Function data is sourced from Appian documentation. To update:
1. Update source files in `referenceMaterial/`
2. Run conversion script: `node scripts/convert-functions.js`
3. Rebuild extension

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Built for Appian developers by Appian Customer Success

## Support

- 📖 **Documentation:** See [QUICK_START.md](QUICK_START.md) for detailed usage
- 🐛 **Issues:** Report bugs via [GitHub Issues](https://github.com/robShankin/appian-ael-ai-generator/issues)
- 💡 **Questions:** Open a discussion in [GitHub Discussions](https://github.com/robShankin/appian-ael-ai-generator/discussions)

---

**Ready to generate some Appian code?** → Head to [QUICK_START.md](QUICK_START.md)
