# Appian Expression Language AI Code Generator

> AI-powered code generation for Appian developers using VS Code or Cursor IDE

**Version:** 1.4.0

## Features

- **🤖 AI-Powered Code Generation**: Describe your Appian functionality in plain English
- **📚 713 Appian Functions**: Comprehensive function library with examples and documentation
- **🎯 Context-Aware Best Practices**: Dynamically includes relevant Appian guidelines based on your request
- **🔍 Smart Function Filtering**: Intelligently selects only the 15 most relevant functions to optimize prompts
- **⌨️ Keyboard Shortcuts**: Quick access via `Cmd+Shift+A` (Mac) / `Ctrl+Shift+A` (Windows)
- **📖 Built-in Function Reference**: Browse all 713 functions organized by category

## What's New in v1.4.0

### Context-Aware Best Practices
The extension now includes curated best practices from 9 official Appian documentation pages:

- **Core Rules** - Critical AEL syntax (no ternary operators, no JavaScript operators)
- **Performance** - Loop limits (500 items max), pagination, query optimization
- **Null Handling** - Functions like `a!isNullOrEmpty()`, `a!defaultValue()`
- **Local Variables** - Scoping, refresh behavior, best practices
- **Advanced** - Type casting, partial evaluation, complex patterns

### Smart Contextual Filtering

The extension detects keywords in your request and includes relevant practices:

- Mention "loop" → Gets performance practices (500 item limits, nesting rules)
- Mention "null" → Gets null handling functions and patterns
- Mention "query" → Gets pagination and optimization tips
- Mention "variables" → Gets scoping and refresh behavior rules

## Requirements

- **VS Code** or **Cursor IDE** (recommended)
- **vsce** package tool (for building from source)

## Installation

This extension is distributed as source code. You need to build it before installing.

### Build from Source

**Prerequisites:**
- Node.js installed on your system
- `vsce` tool: `npm install -g @vscode/vsce`

**Build Steps:**

1. Navigate to this extension directory in Terminal
2. Run the build command:
   ```bash
   vsce package --no-dependencies
   ```
3. This creates `appian-ael-ai-1.4.0.vsix`

### Install the Extension

**Method 1: Drag and Drop (Easiest)**
1. Find the `appian-ael-ai-1.4.0.vsix` file
2. Drag it into your VS Code/Cursor window
3. Click "Install"

**Method 2: Command Palette**
1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
2. Type: `Extensions: Install from VSIX`
3. Select the `appian-ael-ai-1.4.0.vsix` file
4. Click "Install"

### Verify Installation

1. Press `Cmd+Shift+P` (Command Palette)
2. Type "Appian"
3. You should see:
   - ✓ Appian: Generate Code
   - ✓ Appian: Generate Code from Selection
   - ✓ Appian: Generate Code (Quick - Clipboard)
   - ✓ Appian: Show Appian Function Reference

## Usage

### Quick Start Workflow

1. **Press `Cmd+Shift+A`** (Mac) or `Ctrl+Shift+A` (Windows)
2. **Describe what you want**: "Create a dropdown field labeled Status with options Active, Inactive, Pending"
3. **Choose**: "Copy to clipboard"
4. **Press `Cmd+K`** (Cursor inline editor) and paste
5. **Get production-ready Appian code!**

### Detailed Usage

#### Method 1: Command Palette

1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
2. Type: `Appian: Generate Code`
3. Enter your description
4. Choose how to use the prompt:
   - **Copy to clipboard** → Paste into Cursor chat (`Cmd+L`) or inline editor (`Cmd+K`)
   - **Open in new file** → Review and edit before using
   - **Insert at cursor** → Add prompt directly to your document

#### Method 2: Keyboard Shortcut (Fastest)

1. Press `Cmd+Shift+A` (Mac) or `Ctrl+Shift+A` (Windows)
2. Follow the same steps as Method 1

#### Method 3: From Selected Text

1. Select text describing what you want
2. Run: `Appian: Generate Code from Selection`
3. Choose how to use the generated prompt

## Examples

### Example 1: Dropdown Field

**Your input:**
```
Create a dropdown field labeled "Department" with options IT, HR, Finance, Sales
```

**What the extension adds to the prompt:**
- ✓ Critical AEL syntax rules (no ternary, no &&, use if() function)
- ✓ Relevant functions: `a!dropdownField()`, `a!localVariables()`
- ✓ UI component best practices

**AI generates:**
```javascript
a!localVariables(
  local!department,
  a!dropdownField(
    label: "Department",
    choiceLabels: {"IT", "HR", "Finance", "Sales"},
    choiceValues: {"IT", "HR", "Finance", "Sales"},
    value: local!department,
    saveInto: local!department
  )
)
```

### Example 2: Query with Null Handling

**Your input:**
```
Create a query filter for employees where department might be null
```

**What the extension adds:**
- ✓ Null handling best practices (because you mentioned "null")
- ✓ Functions: `a!queryFilter()`, `a!isNullOrEmpty()`, `a!isNotNullOrEmpty()`

**AI generates:**
```javascript
a!queryFilter(
  field: "department",
  operator: "=",
  value: if(
    a!isNullOrEmpty(ri!department),
    null,
    ri!department
  ),
  applyWhen: a!isNotNullOrEmpty(ri!department)
)
```

### Example 3: Loop Through Array

**Your input:**
```
Loop through an array of customer records and extract email addresses
```

**What the extension adds:**
- ✓ Performance best practices (because you mentioned "loop")
- ✓ Warning about 500 item limit
- ✓ Functions: `a!forEach()`, array functions

**AI generates:**
```javascript
a!forEach(
  items: ri!customers,
  expression: fv!item.email
)
```

## How It Works

```
1. YOU describe what you want
   ↓
2. EXTENSION analyzes keywords
   ↓
3. EXTENSION builds smart prompt with:
   • Critical AEL syntax rules
   • Relevant best practices (contextual)
   • Top 15 relevant functions
   • Your original request
   ↓
4. YOU paste into Cursor AI (Cmd+K or Cmd+L)
   ↓
5. AI generates production-ready Appian code
   ↓
6. YOU insert into your Appian interface
```

## Function Reference

Access the complete function reference:

**Command:** `Appian: Show Appian Function Reference`

**Categories:**
- Arrays
- Text
- Dates/Time
- Logic
- UI Components
- Data/Queries
- Math
- And more...

## Keyboard Shortcuts

| Command | Mac | Windows/Linux |
|---------|-----|---------------|
| Generate Code | `Cmd+Shift+A` | `Ctrl+Shift+A` |
| Quick Generate (Clipboard) | `Cmd+Alt+A` | `Ctrl+Alt+A` |
| Command Palette | `Cmd+Shift+P` | `Ctrl+Shift+P` |
| Cursor Inline Editor | `Cmd+K` | `Ctrl+K` |
| Cursor Chat | `Cmd+L` | `Ctrl+L` |

## Tips for Best Results

### ✅ DO:

- **Be specific**: "Create a text field for email address with validation"
- **Use Appian terminology**: "local variables", "rule inputs", "a!queryEntity"
- **Mention data types**: "array of integers", "text value"
- **Include edge cases**: "with null handling", "disabled when read-only"

### ❌ DON'T:

- **Be vague**: "Make a thing" or "Add some logic"
- **Assume AI knows Appian**: Be explicit about what you need
- **Skip context**: Mention validation, styling, specific behavior

## Language Support

The extension automatically activates for:
- `.ael` files
- `.expression` files
- `.sail` files

## Troubleshooting

### Extension doesn't activate
**Solution:**
1. Make sure you're using VS Code 1.80+ or Cursor
2. Reload window: Press `Cmd+Shift+P` → "Developer: Reload Window"

### Commands don't appear
**Solution:**
1. Check Extensions panel (`Cmd+Shift+X`)
2. Search for "Appian" and make sure it's enabled
3. Reinstall the `.vsix` if needed

### Generated code has errors
**Solution:**
1. Refine your description to be more specific
2. Try regenerating with Cmd+Shift+A
3. Use Cmd+K to iterate with AI ("Fix the null handling in this code")
4. Manual adjustments are normal - AI is a helpful assistant, not perfect

### No functions in reference
**Solution:**
1. Check that `appian-functions-reference.json` exists in extension directory
2. Reinstall the extension

## Version History

### 1.4.0 (Current)
- ✨ Added context-aware best practices from 9 Appian documentation pages
- 🎯 Dynamic filtering based on request keywords
- 📝 Enhanced system instructions with explicit syntax rules
- 🔧 Improved prompt builder with 5 practice categories
- 📚 40+ curated best practices in JSON knowledge base

### 1.3.2
- 📚 Enriched function documentation with examples and use cases
- 🎨 Enhanced prompt formatting for better AI comprehension

### 1.2.0
- 📦 Added comprehensive function reference (713 functions)
- 🔍 Implemented smart function filtering

### 1.0.0
- 🎉 Initial release
- AI-powered code generation
- Basic function reference
- Multiple input methods

## Project Structure

```
extension/
├── src/                           # TypeScript source files
│   ├── extension.ts
│   ├── appianCodeGenerator.ts
│   ├── promptBuilder.ts
│   ├── functionFilter.ts
│   └── types.ts
│
├── lib/                           # Compiled JavaScript (what runs)
│   ├── extension.js
│   ├── appianCodeGenerator.js
│   ├── promptBuilder.js
│   └── functionFilter.js
│
├── appian-best-practices.json     # Curated best practices (v1.4.0)
├── appian-functions-docs.json     # Enriched function documentation
├── appian-functions-reference.json # 713 function signatures
│
├── snippets/                      # VS Code snippets
├── syntaxes/                      # Syntax highlighting
├── themes/                        # Color themes
│
├── package.json                   # Extension manifest
└── README.md                      # This file
```

## Contributing

This project is part of Appian Customer Success. For the full project:
- **GitHub:** https://github.com/robShankin/appian-ael-ai-generator
- **Issues:** https://github.com/robShankin/appian-ael-ai-generator/issues

## Support

For help:
1. Check the Troubleshooting section above
2. Review the Examples
3. See the main project README and QUICK_START guide
4. Open an issue on GitHub

## License

Internal use - Appian Customer Success

---

**Built for Appian developers, by Appian Customer Success**

*Generate better Appian code, faster* 🚀
