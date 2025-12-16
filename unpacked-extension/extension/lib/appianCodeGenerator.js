const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { FunctionFilter } = require('./functionFilter');
const { PromptBuilder } = require('./promptBuilder');

class AppianCodeGenerator {
  constructor(context) {
    this.context = context;
    this.functionReference = null;
    this.enrichedDocs = null;
    this.functionFilter = new FunctionFilter();
    this.promptBuilder = new PromptBuilder();
    this.loadFunctionData();
  }

  /**
   * Load and merge function reference + rich documentation
   */
  loadFunctionData() {
    try {
      // Load base function reference (signatures, categories)
      const referencePath = path.join(
        this.context.extensionPath,
        'appian-functions-reference.json'
      );
      const referenceData = fs.readFileSync(referencePath, 'utf8');
      this.functionReference = JSON.parse(referenceData);

      // Load rich documentation (descriptions, examples, use cases)
      const docsPath = path.join(
        this.context.extensionPath,
        'appian-functions-docs.json'
      );

      if (fs.existsSync(docsPath)) {
        const docsData = fs.readFileSync(docsPath, 'utf8');
        this.enrichedDocs = JSON.parse(docsData);

        // Merge enriched docs into function reference
        this.mergeFunctionDocs();
        console.log(
          `Loaded ${this.functionReference?.metadata.totalFunctions} Appian functions with enriched documentation`
        );
      } else {
        console.log(
          `Loaded ${this.functionReference?.metadata.totalFunctions} Appian functions (no enriched docs found)`
        );
      }
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to load Appian function data: ${error}`
      );
    }
  }

  /**
   * Merge enriched documentation into function reference
   */
  mergeFunctionDocs() {
    if (!this.enrichedDocs || !this.functionReference) {
      return;
    }

    // Merge enriched data into each function
    for (const func of this.functionReference.functions) {
      const enrichedDoc = this.enrichedDocs.functions[func.name];
      if (enrichedDoc) {
        // Merge in the rich documentation
        func.enrichedDescription = enrichedDoc.description || func.description;
        func.examples = enrichedDoc.examples || [];
        func.useCase = enrichedDoc.useCase || '';
        func.returnType = enrichedDoc.returnType || '';
        func.returnDescription = enrichedDoc.returnDescription || '';
        func.parameterDetails = enrichedDoc.parameters || {};
        func.relatedFunctions = enrichedDoc.relatedFunctions || [];

        // Update category if enriched one is more specific
        if (enrichedDoc.category && enrichedDoc.category !== 'Other Functions') {
          func.category = enrichedDoc.category;
        }
      }
    }

    console.log(`Merged enriched documentation for functions`);
  }

  /**
   * Generate code from user-provided prompt
   */
  async generateFromPrompt() {
    const userInput = await vscode.window.showInputBox({
      prompt: 'Describe the Appian code you want to generate',
      placeHolder: 'Example: Create a dropdown with values from a query',
      validateInput: (value) => {
        return value.trim().length < 5
          ? 'Please provide a more detailed description'
          : null;
      },
    });

    if (!userInput) {
      return; // User cancelled
    }

    await this.generateCode(userInput);
  }

  /**
   * Generate code from selected text
   */
  async generateFromSelection() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    if (!selectedText || selectedText.trim().length === 0) {
      vscode.window.showWarningMessage(
        'Please select text describing what you want to generate'
      );
      return;
    }

    await this.generateCode(selectedText);
  }

  /**
   * Core code generation logic
   */
  async generateCode(userRequest) {
    if (!this.functionReference) {
      vscode.window.showErrorMessage(
        'Function reference not loaded. Please reload the extension.'
      );
      return;
    }

    // Filter relevant functions based on user request
    const relevantFunctions = this.functionFilter.findRelevantFunctions(
      userRequest,
      this.functionReference
    );

    // Build the prompt
    const context = {
      userRequest,
      relevantFunctions,
    };

    const prompt = this.promptBuilder.buildPrompt(context);

    // Show options for how to use the generated prompt
    await this.presentPromptToUser(prompt, userRequest);
  }

  /**
   * Generate code inline with clipboard approach
   */
  async generateInline() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    // Get user input for what to generate
    const userInput = await vscode.window.showInputBox({
      prompt: 'Describe the Appian code you want to generate',
      placeHolder: 'Example: Create a dropdown with values from a query',
      validateInput: (value) => {
        return value.trim().length < 5
          ? 'Please provide a more detailed description'
          : null;
      },
    });

    if (!userInput) {
      return; // User cancelled
    }

    if (!this.functionReference) {
      vscode.window.showErrorMessage(
        'Function reference not loaded. Please reload the extension.'
      );
      return;
    }

    // Insert the original user description as a comment in the document
    const position = editor.selection.active;
    await editor.edit((editBuilder) => {
      editBuilder.insert(position, `/* ${userInput} */\n`);
    });

    // Move cursor to next line
    const newPosition = position.translate(1, 0);
    editor.selection = new vscode.Selection(newPosition, newPosition);

    // Filter relevant functions based on user request
    const relevantFunctions = this.functionFilter.findRelevantFunctions(
      userInput,
      this.functionReference
    );

    // Build the prompt
    const context = {
      userRequest: userInput,
      relevantFunctions,
    };

    const prompt = this.promptBuilder.buildPrompt(context);

    // Copy prompt to clipboard
    await vscode.env.clipboard.writeText(prompt);

    // Show notification with clear instructions
    const choice = await vscode.window.showInformationMessage(
      '✓ Comment added & enriched prompt copied!',
      'Open Inline Chat (Cmd+K)',
      'Open Composer (Cmd+L)',
      'Got it'
    );

    // Help user open the appropriate chat mode
    if (choice === 'Open Inline Chat (Cmd+K)') {
      try {
        await vscode.commands.executeCommand('aichat.newInlineChat');
      } catch (error) {
        vscode.window.showInformationMessage(
          'Press Cmd+K (or Ctrl+K) to open Inline Chat, then paste the prompt.'
        );
      }
    } else if (choice === 'Open Composer (Cmd+L)') {
      try {
        await vscode.commands.executeCommand('workbench.action.chat.open');
      } catch (error) {
        vscode.window.showInformationMessage(
          'Press Cmd+L (or Ctrl+L) to open Composer, then paste the prompt.'
        );
      }
    }
  }

  /**
   * Present the generated prompt to the user
   */
  async presentPromptToUser(prompt, userRequest) {
    const choice = await vscode.window.showQuickPick(
      [
        {
          label: '$(comment-discussion) Send to chat',
          description: 'Opens chat with prompt ready to paste (Cmd+V)',
          action: 'sendToChat',
        },
        {
          label: '$(sparkle) Generate inline',
          description: 'Opens prompt and triggers Cmd+K automatically',
          action: 'generateInline',
        },
        {
          label: '$(copy) Copy prompt to clipboard',
          description: 'Paste into Cursor chat to generate code',
          action: 'copy',
        },
        {
          label: '$(file-code) Open in new file',
          description: 'Use Cursor inline chat (Cmd+K) on the prompt',
          action: 'newFile',
        },
        {
          label: '$(insert) Insert at cursor',
          description: 'Insert prompt at current cursor position',
          action: 'insert',
        },
      ],
      {
        placeHolder: 'How would you like to use this prompt?',
      }
    );

    if (!choice) {
      return;
    }

    switch (choice.action) {
      case 'sendToChat':
        // Copy to clipboard and open chat automatically
        await vscode.env.clipboard.writeText(prompt);
        await vscode.commands.executeCommand('workbench.action.chat.open');
        vscode.window.showInformationMessage(
          '✓ Chat opened! Press Cmd+V (Mac) or Ctrl+V (Windows) to paste the prompt.'
        );
        break;

      case 'generateInline':
        // Open in new file and trigger inline chat automatically
        const inlineDoc = await vscode.workspace.openTextDocument({
          content: prompt,
          language: 'markdown',
        });
        const inlineEditor = await vscode.window.showTextDocument(inlineDoc);

        // Select all text in the document
        const fullRange = new vscode.Range(
          inlineDoc.positionAt(0),
          inlineDoc.positionAt(inlineDoc.getText().length)
        );
        inlineEditor.selection = new vscode.Selection(fullRange.start, fullRange.end);

        // Trigger inline chat (Cmd+K / Ctrl+K)
        await vscode.commands.executeCommand('inlineChat.start');

        vscode.window.showInformationMessage(
          '✓ Inline chat activated! Press Enter to generate code in the document.'
        );
        break;

      case 'copy':
        await vscode.env.clipboard.writeText(prompt);
        const selected = await vscode.window.showInformationMessage(
          '✓ Prompt copied! Open Cursor chat and paste to generate Appian code.',
          'Open Chat'
        );
        if (selected === 'Open Chat') {
          vscode.commands.executeCommand('workbench.action.chat.open');
        }
        break;

      case 'newFile':
        const doc = await vscode.workspace.openTextDocument({
          content: prompt,
          language: 'markdown',
        });
        await vscode.window.showTextDocument(doc);
        vscode.window.showInformationMessage(
          '✓ Prompt opened. Use Cursor inline chat (Cmd+K / Ctrl+K) to generate code.'
        );
        break;

      case 'insert':
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          editor.edit((editBuilder) => {
            editBuilder.insert(editor.selection.active, prompt);
          });
          vscode.window.showInformationMessage(
            '✓ Prompt inserted at cursor position'
          );
        }
        break;
    }
  }

  /**
   * Show function reference in a webview
   */
  async showFunctionReference() {
    if (!this.functionReference) {
      vscode.window.showErrorMessage('Function reference not loaded');
      return;
    }

    // Open the markdown reference file
    const referencePath = path.join(
      this.context.extensionPath,
      'appian-functions-reference.md'
    );

    try {
      const doc = await vscode.workspace.openTextDocument(referencePath);
      await vscode.window.showTextDocument(doc, {
        viewColumn: vscode.ViewColumn.Beside,
        preview: true,
      });
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to open reference: ${error}`
      );
    }
  }
}

module.exports = { AppianCodeGenerator };
