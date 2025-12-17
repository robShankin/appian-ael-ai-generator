# Data Update Automation Script - ELI5 Guide

> **ELI5 (Explain Like I'm 5):** This script is like having a robot helper that moves your files from one folder to another, checks they arrived safely, and tells you if anything went wrong!

## What Problem Does This Solve?

**The Manual Way (boring!):**
1. Open Finder
2. Navigate to docScraper folder
3. Find two JSON files
4. Copy them
5. Navigate to extension folder
6. Paste them
7. Hope you didn't miss anything
8. Hope the files are valid

**The Script Way (easy!):**
1. Run one command: `./scripts/update-from-docscraper.sh`
2. Done! ✓

## What Does the Script Actually Do?

Think of it like a smart delivery service:

```
📦 STEP 1: Pick up packages
   The script goes to your docScraper folder and picks up the JSON files

🚚 STEP 2: Deliver packages
   It carries them over to the extension folder

✓ STEP 3: Quality check
   It makes sure the files:
   - Aren't broken (valid JSON)
   - Aren't empty (at least 100KB)
   - Have the right number of functions (~713)
   - Don't have error messages in them

📣 STEP 4: Tell you what happened
   It prints a report: "✓ Copied 2 files, validated 715 functions"
```

## First Time Setup (One-Time Thing)

### What Happens

The first time you run the script, it needs to know where you keep your docScraper folder.

**It's like telling a pizza delivery person your address - you only need to do it once!**

### The Process

1. Run the script:
   ```bash
   ./scripts/update-from-docscraper.sh
   ```

2. It will say: "Where is your docScraper folder?"

3. It might even find it for you! It shows a list:
   ```
   Found these possible locations:
   1. /Users/you/kiro_projects/docScraper
   2. /Users/you/projects/appian-docs-scraper

   Enter the number or type a custom path:
   ```

4. Type `1` (or the correct number) and press Enter

5. It saves this to `scripts/config.json` - you're done!

### If You Move Your Folders Later

No problem! Just:
- **Option A:** Delete `scripts/config.json` and run the script again (it will re-ask)
- **Option B:** Edit `scripts/config.json` with the new path
- **Option C:** Use the `--source` flag (see below)

## How to Use It

### Basic Usage (Most Common)

Just run it with no options:

```bash
./scripts/update-from-docscraper.sh
```

**What it does:**
- Copies the files from docScraper to extension
- Validates them
- Tells you the results

**Example output:**
```
================================
Copying Files
================================

ℹ Processing: appian-functions-complete.json
ℹ appian-functions-complete.json: 713 functions found
✓ appian-functions-complete.json: Valid
✓ Copied to: /path/to/extension/appian-functions-complete.json
✓ appian-functions-complete.json: Valid

ℹ Processing: appian-functions-docs.json
✓ appian-functions-docs.json: Valid
✓ Copied to: /path/to/extension/appian-functions-docs.json
✓ appian-functions-docs.json: Valid

================================
✓ Update Complete
================================

ℹ Next step: Rebuild the extension
  cd /path/to/extension
  vsce package --no-dependencies
```

### Check Files Without Copying

Want to make sure your current files are good?

```bash
./scripts/update-from-docscraper.sh --check-only
```

**What it does:**
- Doesn't copy anything
- Just checks the files already in the extension folder
- Tells you if they're valid

**When to use this:**
- After manually copying files
- Before committing changes
- Just to be safe!

### Override the Source Path (One Time)

Maybe you downloaded new scraper files to a different folder:

```bash
./scripts/update-from-docscraper.sh --source ~/Downloads/appian-docs-scraper
```

**What it does:**
- Uses `~/Downloads/appian-docs-scraper` instead of your saved path
- Just for this one time
- Doesn't change your config

**When to use this:**
- Testing files from a different location
- Someone sent you updated files
- Trying files before officially updating

### Copy AND Rebuild in One Step

```bash
./scripts/update-from-docscraper.sh --rebuild
```

**What it does:**
- Copies the files
- Validates them
- Automatically runs `vsce package`
- Creates the new `.vsix` file

**When to use this:**
- You want to go straight to testing
- You're confident the files are good
- You want to save time

### Get Help

```bash
./scripts/update-from-docscraper.sh --help
```

Shows all the options with examples.

## What Gets Checked?

The script is pretty smart about validation:

### 1. File Exists Check
   - **Simple:** Does the file exist?
   - **Why:** Sometimes copy operations fail silently

### 2. File Size Check
   - **Simple:** Is the file at least 100KB?
   - **Why:** If it's tiny, something probably went wrong
   - **Normal sizes:**
     - `appian-functions-complete.json`: ~290KB
     - `appian-functions-docs.json`: ~1MB

### 3. JSON Syntax Check
   - **Simple:** Is it valid JSON that can be read?
   - **Why:** Corrupted files will break the extension
   - **How:** Uses Python's JSON parser

### 4. Error Text Check
   - **Simple:** Does the file contain "error" or "failed"?
   - **Why:** The scraper might have written error messages
   - **Note:** This is just a warning, not a failure

### 5. Function Count Check
   - **Simple:** Are there ~713+ functions?
   - **Why:** If there are only 300, something went wrong with the scraper
   - **Note:** More than 713 is fine (new Appian versions add functions)

## Understanding the Output

### Success Output

```
ℹ Source: /Users/you/kiro_projects/docScraper
ℹ Destination: /Users/you/codingRepo/CodeCompletion/unpacked-extension/extension

ℹ Processing: appian-functions-complete.json
ℹ appian-functions-complete.json: 713 functions found
✓ appian-functions-complete.json: Valid
✓ Copied to: ...
✓ appian-functions-complete.json: Valid

================================
✓ Update Complete
================================
```

**Meaning:** Everything worked perfectly!

### Warning Output

```
⚠ appian-functions-complete.json: Only 650 functions found (expected ~713+)
✓ appian-functions-complete.json: Valid
```

**Meaning:** File is valid JSON, but something seems off. Check manually.

### Error Output

```
✗ appian-functions-complete.json: Invalid JSON syntax
✗ Failed to copy appian-functions-complete.json

================================
✗ Update Failed
================================

✗ Some files had errors (see above)
```

**Meaning:** Something went wrong. Don't use these files!

## Troubleshooting

### "Directory not found"

**Problem:** Can't find your docScraper folder

**Solution:**
1. Check the path in `scripts/config.json`
2. Make sure the folder exists
3. Or delete `config.json` and run setup again

### "Invalid JSON syntax"

**Problem:** The JSON file is corrupted

**Solution:**
1. Re-run the scraper to generate fresh files
2. Check the scraper didn't have errors
3. Don't copy the files until scraper succeeds

### "Only 300 functions found"

**Problem:** Scraper didn't finish properly

**Solution:**
1. Check scraper logs for errors
2. Re-run the scraper
3. Make sure Appian docs site is accessible

### "File is suspiciously small"

**Problem:** File might be incomplete

**Solution:**
1. Compare with previous version's file size
2. Re-run the scraper
3. Check for scraper errors

### Script won't run

**Problem:** Permission denied

**Solution:**
```bash
chmod +x scripts/update-from-docscraper.sh
```

## Files Created by This Script

### `scripts/config.json` (auto-generated)

**What it is:** Saves your folder locations

**Example:**
```json
{
  "docScraperPath": "/Users/you/kiro_projects/docScraper",
  "extensionDataPath": "/Users/you/codingRepo/CodeCompletion/unpacked-extension/extension"
}
```

**Note:** This file is in `.gitignore` - it's just for you!

### `scripts/config.json.example` (template)

**What it is:** Example config you can copy

**How to use:**
```bash
cp scripts/config.json.example scripts/config.json
# Then edit with your actual paths
```

## Quick Command Reference

| Command | What It Does |
|---------|--------------|
| `./scripts/update-from-docscraper.sh` | Copy files and validate |
| `./scripts/update-from-docscraper.sh --check-only` | Just validate, don't copy |
| `./scripts/update-from-docscraper.sh --rebuild` | Copy, validate, AND rebuild .vsix |
| `./scripts/update-from-docscraper.sh --source PATH` | Use different source folder |
| `./scripts/update-from-docscraper.sh --help` | Show all options |

## Real-World Workflow Example

**Scenario:** You just ran the scraper for Appian 26.1

```bash
# Step 1: Run the scraper (in docScraper folder)
cd ~/kiro_projects/docScraper
python3 scrape_appian_docs.py
python3 scrape_appian_docs_enhanced.py

# Step 2: Use automation script (in CodeCompletion folder)
cd ~/codingRepo/CodeCompletion
./scripts/update-from-docscraper.sh

# Output shows:
# ✓ Copied 2 files
# ✓ All validations passed
# ℹ Next step: Rebuild the extension

# Step 3: Rebuild
cd unpacked-extension/extension
vsce package --no-dependencies

# Step 4: Test the new .vsix
# Install it in VS Code/Cursor and test

# Step 5: If it works, commit!
git add .
git commit -m "Update to Appian 26.1 function data"
```

**With the `--rebuild` flag, even easier:**

```bash
cd ~/codingRepo/CodeCompletion
./scripts/update-from-docscraper.sh --rebuild

# Done! The .vsix is built and ready to test
```

## Why This is Better Than Manual

| Manual Process | With Script |
|----------------|-------------|
| Remember which files to copy | Script knows |
| Navigate through folders | Script handles it |
| Hope files are valid | Script validates |
| Might forget a file | Script copies all |
| No safety checks | Multiple validations |
| ~5 minutes | ~10 seconds |
| Boring! | Satisfying! ✓ |

## Questions?

**Q: Do I have to use this script?**
A: Nope! You can still copy files manually. This just makes it easier and safer.

**Q: What if I mess up the config?**
A: Just delete `scripts/config.json` and run the script again. It will re-prompt.

**Q: Can I see what the script will do before it does it?**
A: Yes! Use `--check-only` first. It won't change anything.

**Q: What if the paths change?**
A: Edit `scripts/config.json` or use the `--source` flag for one-time overrides.

**Q: Is this safe?**
A: Yes! The script:
- Only copies files (never deletes)
- Validates before reporting success
- Shows you exactly what it's doing

---

**Remember:** This script is a helper, not a requirement. Use it if it makes your life easier!

**Need more help?** See [DATA_UPDATE_PROCESS.md](../docs/DATA_UPDATE_PROCESS.md) for the complete manual process.
