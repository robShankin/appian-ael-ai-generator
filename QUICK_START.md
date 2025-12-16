# Appian AEL AI Code Generator - Quick Start

## What We Built

A Cursor extension that uses AI to generate Appian Expression Language (AEL) code from natural language descriptions.

### Key Features

✅ **713 Appian functions** converted to optimized AI-friendly format
✅ **Smart semantic filtering** - automatically selects only relevant functions
✅ **Three usage modes**: Copy to clipboard, open in new file, or insert at cursor
✅ **Keyboard shortcut**: `Cmd+Shift+A` (Mac) / `Ctrl+Shift+A` (Windows)
✅ **Built-in function reference** for quick lookup
✅ **Zero dependencies** - pure JavaScript, no compilation needed

## Installation

### Step 1: Install the Extension

**Option A: Drag and Drop (Easiest)**
1. Open Cursor
2. Drag `appian-ael-ai-1.0.0.vsix` into the Cursor window
3. Click "Install"

**Option B: Via Extensions Panel**
1. Open Cursor
2. Press `Cmd+Shift+X` to open Extensions
3. Click the `...` menu → "Install from VSIX..."
4. Select `appian-ael-ai-1.0.0.vsix`

### Step 2: Verify Installation

1. Press `Cmd+Shift+P` (Command Palette)
2. Type "Appian"
3. You should see:
   - Appian: Generate Code
   - Appian: Generate Code from Selection
   - Appian: Show Appian Function Reference

## Usage Examples

### Example 1: Generate a Dropdown Field

1. Press `Cmd+Shift+A`
2. Type: `Create a dropdown labeled "Status" with options Active, Inactive, Pending`
3. Choose "Copy prompt to clipboard"
4. Open Cursor chat (click chat icon or `Cmd+L`)
5. Paste and hit Enter
6. Cursor generates:
```
a!dropdownField(
  label: "Status",
  choiceLabels: {"Active", "Inactive", "Pending"},
  choiceValues: {"Active", "Inactive", "Pending"},
  value: local!status,
  saveInto: local!status
)
```

### Example 2: Format Date

1. Select this text: `format today's date as YYYY-MM-DD`
2. Press `Cmd+Shift+P` → "Appian: Generate Code from Selection"
3. Choose "Open in new file"
4. The prompt opens in a new document
5. Press `Cmd+K` (Cursor inline chat)
6. Cursor generates: `text(today(), "YYYY-MM-DD")`

### Example 3: Query Filter

1. Press `Cmd+Shift+A`
2. Type: `Create a query filter for employees where department equals Sales`
3. Choose your preferred method
4. Cursor generates:
```
a!queryFilter(
  field: "department",
  operator: "=",
  value: "Sales"
)
```

## How It Works

```
Your Description
       ↓
Extension analyzes keywords
       ↓
Filters 15 most relevant functions from 713
       ↓
Builds optimized prompt with:
  - System instructions
  - Relevant function signatures
  - Your request
       ↓
You paste into Cursor
       ↓
Cursor AI generates AEL code
       ↓
Copy/paste into your Appian interface
```

## Tips for Best Results

### ✅ DO:
- Be specific: "text input for email with validation"
- Use Appian terminology: "local variables", "rule inputs"
- Mention data types: "array of integers", "text value"
- Include context: "with error handling", "disabled when..."

### ❌ DON'T:
- Be too vague: "create a thing"
- Use non-Appian terms without context
- Forget to mention required vs optional fields

## Commands Reference

| Command | Shortcut | Description |
|---------|----------|-------------|
| Appian: Generate Code | `Cmd+Shift+A` | Generate from prompt |
| Appian: Generate Code from Selection | - | Generate from selected text |
| Appian: Show Appian Function Reference | - | View all 713 functions |

## File Locations

```
/Users/robert.shankin/codingRepo/CodeCompletion/
├── appian-ael-ai-1.0.0.vsix           ← Install this
├── plan.md                             ← Architecture plan
├── QUICK_START.md                      ← This file
├── unpacked-extension/
│   └── extension/
│       ├── lib/                        ← JavaScript code
│       │   ├── extension.js
│       │   ├── appianCodeGenerator.js
│       │   ├── functionFilter.js
│       │   └── promptBuilder.js
│       ├── appian-functions-reference.json    ← 713 functions
│       ├── appian-functions-reference.md      ← Human-readable
│       ├── README.md                          ← Full documentation
│       └── package.json
└── scripts/
    └── convert-functions.js            ← Data optimizer
```

## Troubleshooting

### Extension doesn't activate
- **Fix**: Reload window → `Cmd+Shift+P` → "Developer: Reload Window"

### Commands don't appear
- **Fix**: Check if extension is enabled in Extensions panel

### No functions in reference
- **Fix**: Reinstall the extension

### Generated code has errors
- **Fix**:
  1. Make your description more specific
  2. Check the generated prompt before sending to AI
  3. Manually adjust generated code if needed

## Sharing with Teammates

### Option 1: Direct Share
1. Send them `appian-ael-ai-1.0.0.vsix` (136KB file)
2. They install via drag-and-drop or Extensions panel
3. Works immediately - no configuration needed

### Option 2: Team Install
1. Place `.vsix` in shared drive or repo
2. Team members install from that location
3. Everyone gets the same version

## Future Enhancements (Planned)

- Direct API integration for non-Cursor users
- More intelligent function filtering with embeddings
- Code explanation mode (reverse: explain AEL → English)
- Integration with Appian documentation
- Custom function library support

## Architecture Notes

### Why No TypeScript Compilation?
- Simpler distribution (no build step)
- Faster development iteration
- No npm dependency issues
- Pure JavaScript works everywhere

### Why No Direct API Calls?
- Simpler for Cursor users (no API key needed)
- Lower maintenance (no auth logic)
- Leverages Cursor's superior AI integration
- Easy to add API mode later for VS Code users

### Data Optimization
- Original: 293KB JSON (VS Code snippet format)
- Optimized: 450KB JSON (structured for AI, includes categories)
- Markdown: 72KB (human-readable reference)
- Smart filtering: Only sends ~15 functions per request

## Success Metrics

✅ All 9 planned tasks completed
✅ 713 functions successfully converted and categorized
✅ Zero compilation dependencies
✅ 136KB distributable package
✅ Full documentation included
✅ Ready to share and use immediately

## Need Help?

1. Check the full README: `unpacked-extension/extension/README.md`
2. View function reference: Run "Appian: Show Appian Function Reference"
3. Review examples in this doc
4. Check plan.md for architecture details

---

**Built for Appian developers, by Appian Customer Success**
**Version 1.0.0 - Ready for production use**
