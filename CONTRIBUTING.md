# Contributing to Appian AEL AI Code Generator

Thank you for your interest in contributing to this project! This guide will help you understand how to contribute effectively.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Updating Function Data](#updating-function-data)
- [Updating Best Practices](#updating-best-practices)
- [Submitting Changes](#submitting-changes)

## Code of Conduct

This project is part of Appian Customer Success. Please be respectful and professional in all interactions.

## How Can I Contribute?

### Reporting Bugs
- Check if the bug has already been reported in [Issues](https://github.com/robShankin/appian-ael-ai-generator/issues)
- If not, create a new issue with:
  - Clear description of the problem
  - Steps to reproduce
  - Expected vs actual behavior
  - Extension version and IDE (VS Code/Cursor)

### Suggesting Enhancements
- Open a discussion in [GitHub Discussions](https://github.com/robShankin/appian-ael-ai-generator/discussions)
- Describe the enhancement and its use case
- Explain why it would be valuable for Appian developers

### Contributing Code
- Bug fixes
- Enhanced function filtering algorithms
- Improved best practices
- Documentation improvements
- Performance optimizations

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- `vsce` package tool: `npm install -g @vscode/vsce`
- VS Code or Cursor IDE
- Git

### Building the Extension

1. Clone the repository:
   ```bash
   git clone https://github.com/robShankin/appian-ael-ai-generator.git
   cd appian-ael-ai-generator
   ```

2. Navigate to the extension directory:
   ```bash
   cd unpacked-extension/extension
   ```

3. Build the extension:
   ```bash
   vsce package --no-dependencies
   ```

4. Install the generated `.vsix` file in your IDE

### Project Structure

```
appian-ael-ai-generator/
├── unpacked-extension/extension/
│   ├── src/                    # TypeScript source (if modifying logic)
│   ├── lib/                    # Compiled JavaScript (what actually runs)
│   ├── appian-*.json          # Data files (functions, best practices)
│   ├── snippets/              # VS Code snippets
│   └── package.json           # Extension manifest
└── scripts/
    └── convert-functions.js   # Data conversion utilities
```

## Updating Function Data

Function data comes from the [Appian Documentation Scraper](https://github.com/robShankin/appian-docs-scraper) project.

**For detailed instructions, see [DATA_UPDATE_PROCESS.md](docs/DATA_UPDATE_PROCESS.md)**

### Quick Overview

1. Run the scraper for the new Appian version
2. Copy generated files to this project:
   - `appian-functions-complete.json`
   - `appian-functions-docs.json`
   - `appian-functions-reference.json`
3. Test the extension with updated data
4. Update version numbers
5. Rebuild and test

## Updating Best Practices

Best practices are manually curated in `appian-best-practices.json`.

### To Add/Modify Best Practices:

1. Edit `unpacked-extension/extension/appian-best-practices.json`
2. Each practice should have:
   ```json
   {
     "rule": "Clear statement of the practice",
     "example": "Code example demonstrating the practice",
     "priority": "critical|high|medium",
     "keywords": ["relevant", "keywords", "for", "filtering"]
   }
   ```

3. Categories:
   - `coreRules` - Critical AEL syntax (always included)
   - `performance` - Optimization guidelines
   - `nullHandling` - Null/empty value patterns
   - `localVariables` - Variable scoping and refresh
   - `advanced` - Type casting, complex patterns

4. Test the filtering:
   - Try requests with keywords from your practice
   - Verify the practice appears in generated prompts

5. Rebuild the extension

## Submitting Changes

### Pull Request Process

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes:
   - Update code/data files
   - Update documentation if needed
   - Test thoroughly

4. Commit your changes:
   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a Pull Request:
   - Clear description of what changed and why
   - Reference any related issues
   - Include testing notes

### Commit Message Guidelines

- Use clear, descriptive messages
- Start with a verb (Add, Fix, Update, Remove, etc.)
- Reference issue numbers when applicable

Examples:
- `Fix autocomplete bug for timezone functions`
- `Add performance best practices for query optimization`
- `Update function data for Appian 25.4`

### Code Review

All submissions require review. We'll:
- Review for code quality and correctness
- Test the changes
- Provide feedback if needed
- Merge once approved

## Testing Your Changes

Before submitting:

1. **Build the extension**:
   ```bash
   cd unpacked-extension/extension
   vsce package --no-dependencies
   ```

2. **Install and test**:
   - Install the `.vsix` in VS Code/Cursor
   - Test the specific functionality you changed
   - Try a few different code generation requests
   - Verify no regressions

3. **Check for errors**:
   - Open Developer Tools in the IDE
   - Look for console errors
   - Test edge cases

## Questions?

- **Documentation**: See [README.md](README.md) and [QUICK_START.md](QUICK_START.md)
- **Data Updates**: See [DATA_UPDATE_PROCESS.md](docs/DATA_UPDATE_PROCESS.md)
- **Discussions**: [GitHub Discussions](https://github.com/robShankin/appian-ael-ai-generator/discussions)
- **Issues**: [GitHub Issues](https://github.com/robShankin/appian-ael-ai-generator/issues)

---

Thank you for contributing to the Appian developer community! 🚀
