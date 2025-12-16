# Appian Expression Language AI Code Generator

An intelligent VS Code / Cursor extension that generates Appian Expression Language (AEL) code using AI. Simply describe what you want in natural language, and let the AI generate production-ready Appian code.

## Features

- **🤖 AI-Powered Code Generation**: Describe your Appian functionality in plain English
- **📚 Smart Function Reference**: Automatically includes relevant Appian function signatures in prompts
- **🎯 Semantic Filtering**: Intelligently selects only the most relevant functions (15 max) to optimize token usage
- **⌨️ Multiple Input Methods**:
  - Command Palette: `Appian: Generate Code`
  - Keyboard Shortcut: `Cmd+Shift+A` (Mac) / `Ctrl+Shift+A` (Windows/Linux)
  - Generate from selected text
- **📖 Built-in Function Reference**: Quick access to 713+ Appian functions organized by category

## Requirements

- **Cursor IDE** (recommended) or VS Code
- Claude AI access through Cursor

## Installation

### From .vsix File

1. Download the `.vsix` file
2. Open Cursor/VS Code
3. Go to Extensions view (`Cmd+Shift+X` / `Ctrl+Shift+X`)
4. Click the `...` menu at the top → `Install from VSIX...`
5. Select the downloaded `.vsix` file

### From Source

1. Clone or download this repository
2. Open terminal in the extension directory
3. Run: `code --install-extension .` or drag the folder into Cursor

## Usage

### Method 1: Command Palette

1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type: `Appian: Generate Code`
3. Enter your description (e.g., "Create a dropdown field with state names")
4. Choose how to use the prompt:
   - **Copy to clipboard** → Paste into Cursor chat
   - **Open in new file** → Use Cursor inline chat (`Cmd+K`)
   - **Insert at cursor** → Add prompt directly to your code

### Method 2: Keyboard Shortcut

1. Press `Cmd+Shift+A` (Mac) or `Ctrl+Shift+A` (Windows/Linux)
2. Follow the same steps as Method 1

### Method 3: From Selected Text

1. Select text describing what you want to generate
2. Run: `Appian: Generate Code from Selection`
3. Choose how to use the generated prompt

## Examples

### Example 1: Create a Dropdown

**Input:**
```
Create a dropdown field labeled "Department" with options IT, HR, Finance, Sales
```

**Output:** The extension will generate a context-rich prompt that Cursor AI uses to create:
```
a!dropdownField(
  label: "Department",
  choiceLabels: {"IT", "HR", "Finance", "Sales"},
  choiceValues: {"IT", "HR", "Finance", "Sales"},
  value: local!department,
  saveInto: local!department
)
```

### Example 2: Format a Date

**Input:**
```
Format today's date as MM/DD/YYYY
```

**Output:**
```
text(today(), "MM/DD/YYYY")
```

### Example 3: Filter an Array

**Input:**
```
Filter an array of employee records to only show active employees
```

**Output:**
```
a!queryFilter(
  field: "status",
  operator: "=",
  value: "Active"
)
```

## How It Works

1. **You describe** what you want in natural language
2. **Extension filters** relevant Appian functions from 713+ function database
3. **Prompt is built** with system instructions + relevant functions + your request
4. **Cursor AI generates** clean, production-ready AEL code
5. **You insert** the code into your Appian interface

## Function Reference

Access the complete Appian function reference:
- Run: `Appian: Show Appian Function Reference`
- Browse 713+ functions organized by category:
  - Arrays
  - Text
  - Dates/Time
  - Logic
  - UI Components
  - Data/Queries
  - Math
  - And more...

## Tips for Best Results

1. **Be specific**: Instead of "create a field", say "create a text input field for email address with validation"
2. **Include context**: Mention if you need validation, styling, or specific behavior
3. **Reference variables**: Use consistent variable names (e.g., `local!employees`, `ri!selectedId`)
4. **Iterate**: Start simple, then refine the generated code

## Keyboard Shortcuts

| Command | Mac | Windows/Linux |
|---------|-----|---------------|
| Generate Code | `Cmd+Shift+A` | `Ctrl+Shift+A` |
| Command Palette | `Cmd+Shift+P` | `Ctrl+Shift+P` |

## Language Support

The extension automatically activates for:
- `.ael` files
- `.expression` files
- `.sail` files

## Troubleshooting

### Extension doesn't activate
- Make sure you're using Cursor or VS Code 1.80+
- Reload the window: `Developer: Reload Window`

### No functions found
- Check that `appian-functions-reference.json` exists in the extension directory
- Reinstall the extension

### Generated code has errors
- Refine your natural language description
- Check the generated prompt for accuracy
- Manually adjust the generated code if needed

## Contributing

This is a proof-of-concept extension. Feedback and contributions welcome!

## Roadmap

Future enhancements (planned):
- Direct API integration for non-Cursor users
- More intelligent function filtering
- Code explanation mode
- Integration with Appian documentation
- Custom function library support

## Version History

### 1.0.0 (Current)
- Initial release
- AI-powered code generation
- 713+ Appian function reference
- Smart semantic filtering
- Multiple input methods
- Built for Cursor IDE

### 0.0.6 (Previous)
- Basic language support and snippets

## License

Internal use - Appian Customer Success

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the Examples
3. Contact your Appian Customer Success team

---

**Made with ❤️ for Appian developers by Appian Customer Success**
