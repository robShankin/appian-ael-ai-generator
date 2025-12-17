# Quick Start Guide: Build and Use the Extension

> **What you'll learn:** How to build this extension from source code and start generating Appian code with AI

**Time needed:** ~5 minutes
**Difficulty:** Moderate (requires basic command line familiarity)

---

## Table of Contents
1. [What This Extension Does](#what-this-extension-does)
2. [Building the Extension](#building-the-extension)
3. [Installing in Cursor/VS Code](#installing-in-cursorvs-code)
4. [Using the Extension](#using-the-extension)
5. [Troubleshooting](#troubleshooting)

---

## What This Extension Does

Think of this as a **translator** between you and AI:

**Without this extension:**
- You: "Create a dropdown in Appian"
- AI: *Generates JavaScript-style code that won't work in Appian* ❌

**With this extension:**
- You: Press `Cmd+Shift+A` → "Create a dropdown for status"
- Extension: *Builds a smart prompt with Appian syntax rules, best practices, and relevant functions*
- AI: *Generates proper Appian code with `a!dropdownField()`, local variables, etc.* ✅

**Why it works:** The extension gives AI the exact context it needs to generate valid Appian Expression Language (AEL) code.

---

## Building the Extension

### Prerequisites

You need two tools on your computer:

1. **Node.js** - [Download here](https://nodejs.org/) if you don't have it
   - Check if installed: Open Terminal and type `node --version`
   - Should show something like `v18.x.x` or higher

2. **vsce** (VS Code Extension packager)
   - Install by running: `npm install -g @vscode/vsce`
   - Check if installed: `vsce --version`

### Build Steps

**Step 1:** Open Terminal and navigate to the extension folder

```bash
cd /path/to/appian-ael-ai-generator/unpacked-extension/extension
```

💡 **Tip:** Drag the `extension` folder into Terminal to auto-fill the path

**Step 2:** Build the extension package

```bash
vsce package --no-dependencies
```

**What happens:**
- `vsce` reads the `package.json` file
- Bundles all the code files (`lib/`, JSON files, snippets, etc.)
- Creates a file called `appian-ael-ai-1.4.1.vsix`
- Takes ~5-10 seconds

**You'll see:**
```
✔ Packaged: /path/to/extension/appian-ael-ai-1.4.1.vsix (28 files, ~263KB)
```

✅ **Success!** You now have a `.vsix` file - this is your extension installer.

---

## Installing in Cursor/VS Code

### Method 1: Drag and Drop (Easiest)

1. Open Cursor (or VS Code)
2. Find the `appian-ael-ai-1.4.1.vsix` file in Finder/Explorer
3. **Drag it into the Cursor window**
4. Click **"Install"** when prompted
5. Done! ✅

### Method 2: Command Palette

1. Open Cursor/VS Code
2. Press **`Cmd+Shift+P`** (Mac) or **`Ctrl+Shift+P`** (Windows)
3. Type: `Extensions: Install from VSIX`
4. Navigate to and select `appian-ael-ai-1.4.1.vsix`
5. Click **"Install"**
6. Done! ✅

### Verify Installation

1. Press `Cmd+Shift+P` (Command Palette)
2. Type "Appian"
3. You should see:
   - ✓ Appian: Generate Code
   - ✓ Appian: Generate Code from Selection
   - ✓ Appian: Generate Code (Quick - Clipboard)
   - ✓ Appian: Show Appian Function Reference

If you see these, installation was successful! 🎉

---

## Using the Extension

### Your First Generated Code

Let's generate a simple dropdown field:

#### Step 1: Open the Extension

- Press **`Cmd+Shift+A`** (Mac) or **`Ctrl+Shift+A`** (Windows)
- A text box appears asking: *"Describe the Appian code you want to generate"*

#### Step 2: Describe What You Want

Type:
```
Create a dropdown field labeled "Status" with options Active, Inactive, and Pending
```

Press **Enter**

#### Step 3: Choose How to Use the Prompt

You'll see five options:

**Option 1: Send to chat** (Fastest!)
- Automatically copies prompt and opens chat
- You just press Cmd+V and Enter
- **Recommended for quickest workflow**

**Option 2: Generate inline** (Most automated!)
- Opens prompt in document and triggers Cmd+K automatically
- You just press Enter
- Code appears directly in the document

**Option 3: Copy to Clipboard**
- Copies the prompt
- You manually paste into Cursor's chat or inline editor

**Option 4: Open in New File**
- Opens a new editor tab with the prompt
- Good for reviewing before using

**Option 5: Insert at Cursor**
- Pastes prompt directly where your cursor is
- Quick for inline work

Choose **"Send to chat"** or **"Generate inline"** for the fastest experience

#### Step 4: Use with Cursor AI

**Using Inline Editor (Recommended):**
1. Press **`Cmd+K`** (opens Cursor's inline editor)
2. **`Cmd+V`** to paste the prompt
3. Press **Enter**
4. Cursor generates the code right in your document!

**Using Chat Panel:**
1. Press **`Cmd+L`** (opens Cursor chat)
2. **`Cmd+V`** to paste the prompt
3. Press **Enter**
4. Copy the generated code to your document

#### Step 5: See the Result

Cursor will generate something like:
```javascript
a!localVariables(
  local!status,
  a!dropdownField(
    label: "Status",
    choiceLabels: {"Active", "Inactive", "Pending"},
    choiceValues: {"active", "inactive", "pending"},
    value: local!status,
    saveInto: local!status
  )
)
```

✅ **Valid Appian code!** Ready to paste into your Appian interface.

---

## More Examples

### Example 2: Query Filter with Null Handling

**What you type:**
```
Create a query filter for employees where department might be null
```

**What the extension adds to the prompt:**
- ✓ Syntax rules (no JavaScript operators)
- ✓ **Null handling best practices** (because you mentioned "null")
- ✓ Relevant functions: `a!queryFilter()`, `a!isNullOrEmpty()`, etc.

**What AI generates:**
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

Notice: AI included null handling because the extension's prompt told it to!

---

### Example 3: Loop Through Data

**What you type:**
```
Loop through an array of customer records and extract their email addresses
```

**What the extension adds:**
- ✓ **Performance best practices** (because you mentioned "loop")
- ✓ Warning about 500 item limit
- ✓ Relevant functions: `a!forEach()`, array functions

**What AI generates:**
```javascript
a!forEach(
  items: ri!customers,
  expression: fv!item.email
)
```

Clean, performant code following Appian best practices!

---

## Understanding the Workflow

Here's what happens behind the scenes:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. YOU: "Create a dropdown for status"                     │
│    Press Cmd+Shift+A                                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. EXTENSION ANALYZES YOUR REQUEST                         │
│    • Extracts keywords: "dropdown", "status"                │
│    • Determines relevant categories: UI components          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. EXTENSION BUILDS SMART PROMPT                            │
│    ✓ System instructions (no ternary, no &&, use if())     │
│    ✓ Best practices (UI component rules)                    │
│    ✓ Top 15 relevant functions (a!dropdownField, etc.)      │
│    ✓ Your original request                                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. YOU PASTE INTO CURSOR (Cmd+K)                           │
│    Cursor's AI receives the full context                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. AI GENERATES APPIAN CODE                                 │
│    • Uses proper AEL syntax                                 │
│    • Follows best practices from prompt                     │
│    • Includes relevant functions                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. YOU GET PRODUCTION-READY CODE ✅                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Tips for Best Results

### ✅ DO:

**Be specific:**
- ❌ "Create a text field"
- ✅ "Create a text field for email address with validation"

**Use Appian terminology:**
- ✅ "local variables"
- ✅ "rule inputs"
- ✅ "a!queryEntity with pagination"

**Mention data types:**
- ✅ "array of integers"
- ✅ "text value"

**Include edge cases:**
- ✅ "with null handling"
- ✅ "disabled when form is read-only"

### ❌ DON'T:

**Be too vague:**
- ❌ "Make a thing"
- ❌ "Add some logic"

**Assume AI knows Appian:**
- ❌ "Standard dropdown setup" (what's standard?)
- ✅ "Dropdown with local variable and saveInto"

---

## Keyboard Shortcuts Reference

| Shortcut | What It Does |
|----------|--------------|
| **`Cmd+Shift+A`** | Open extension, describe what you want |
| **`Cmd+Alt+A`** | Quick mode - auto-copies prompt to clipboard |
| **`Cmd+K`** | Cursor inline editor (where you paste the prompt) |
| **`Cmd+L`** | Cursor chat panel (alternative paste location) |

💡 **Pro tip:** Use `Cmd+Shift+A` → Describe → Copy → `Cmd+K` → Paste for fastest workflow

---

## Troubleshooting

### Extension doesn't appear in Command Palette

**Solution:**
1. Check Extensions panel (`Cmd+Shift+X`)
2. Search for "Appian"
3. Make sure it's enabled (toggle should be on)
4. If not there, reinstall the `.vsix` file

### Commands don't work / No response when pressing Cmd+Shift+A

**Solution:**
1. Press `Cmd+Shift+P`
2. Type: "Developer: Reload Window"
3. Press Enter
4. Try `Cmd+Shift+A` again

### Generated code has syntax errors

**This is usually an AI issue, not the extension.** The extension provides the right guidance, but AI might still make mistakes.

**Solutions:**
1. **Be more specific** in your description
2. **Regenerate** - Press `Cmd+Shift+A` again with a clearer request
3. **Use Cmd+K iteratively** - Ask AI to fix specific issues
4. **Manual tweaks** - Small adjustments are normal

### Want to see what functions are available?

1. Press `Cmd+Shift+P`
2. Type: "Appian: Show Appian Function Reference"
3. Browse all 713 functions with examples

---

## What Files Are Where?

```
appian-ael-ai-generator/
│
├── unpacked-extension/
│   └── extension/
│       │
│       ├── src/                    ← TypeScript source (if you want to modify)
│       │   ├── promptBuilder.ts    ← Builds the AI prompts
│       │   ├── functionFilter.ts   ← Picks relevant functions
│       │   └── appianCodeGenerator.ts
│       │
│       ├── lib/                    ← Compiled JavaScript (what actually runs)
│       │   ├── promptBuilder.js
│       │   ├── functionFilter.js
│       │   └── appianCodeGenerator.js
│       │
│       ├── appian-best-practices.json     ← 40+ curated best practices
│       ├── appian-functions-docs.json     ← 713 functions with examples
│       │
│       ├── package.json            ← Extension config (version, commands, etc.)
│       │
│       └── appian-ael-ai-1.4.1.vsix    ← The installer (after you build it)
```

**To modify the extension:**
1. Edit files in `src/` (TypeScript)
2. Compile: *(Currently manual - just edit the `lib/` JS files directly)*
3. Rebuild: `vsce package --no-dependencies`
4. Reinstall the new `.vsix`

---

## Next Steps

Now that you have the extension working:

1. **Try different types of requests:**
   - UI components (dropdowns, text fields, grids)
   - Data queries (with filters and pagination)
   - Logic expressions (with loops and conditionals)
   - Local variable setups

2. **Experiment with the workflow:**
   - Try `Cmd+K` inline editor vs `Cmd+L` chat panel
   - See which works better for your style

3. **Refine prompts:**
   - Start general, then get more specific
   - Mention edge cases explicitly
   - Use Appian terminology

4. **Share with your team:**
   - Send them the `.vsix` file
   - They install it (drag and drop)
   - Everyone generates consistent, high-quality Appian code!

---

## Questions?

- 📖 See [README.md](README.md) for project overview
- 📝 See [VERSION_1.4.1_SUMMARY.md](VERSION_1.4.1_SUMMARY.md) for latest changes
- 🐛 Found a bug? [Open an issue](https://github.com/robShankin/appian-ael-ai-generator/issues)
- 💡 Have an idea? [Start a discussion](https://github.com/robShankin/appian-ael-ai-generator/discussions)

---

**Happy coding! 🚀**

Built for Appian developers, by Appian Customer Success
