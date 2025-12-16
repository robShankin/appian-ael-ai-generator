import * as vscode from 'vscode';
import * as path from 'path';
import { AppianFunction, FunctionReference, GenerationContext } from './types';
import { FunctionFilter } from './functionFilter';
import { PromptBuilder } from './promptBuilder';

export class AppianCodeGenerator {
  private functionReference: FunctionReference | null = null;
  private functionFilter: FunctionFilter;
  private promptBuilder: PromptBuilder;

  constructor(private context: vscode.ExtensionContext) {
    this.functionFilter = new FunctionFilter();
    this.promptBuilder = new PromptBuilder();
    this.loadFunctionReference();
  }

  /**
   * Load the Appian function reference data
   */
  private loadFunctionReference(): void {
    try {
      const referencePath = path.join(
        this.context.extensionPath,
        'appian-functions-reference.json'
      );
      const fs = require('fs');
      const data = fs.readFileSync(referencePath, 'utf8');
      this.functionReference = JSON.parse(data);
      console.log(
        `Loaded ${this.functionReference?.metadata.totalFunctions} Appian functions`
      );
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to load Appian function reference: ${error}`
      );
    }
  }

  /**
   * Generate code from user-provided prompt
   */
  async generateFromPrompt(): Promise<void> {
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
  async generateFromSelection(): Promise<void> {
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
  private async generateCode(userRequest: string): Promise<void> {
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
    const context: GenerationContext = {
      userRequest,
      relevantFunctions,
    };

    const prompt = this.promptBuilder.buildPrompt(context);

    // Show options for how to use the generated prompt
    await this.presentPromptToUser(prompt, userRequest);
  }

  /**
   * Present the generated prompt to the user
   * Options:
   * 1. Copy to clipboard (user can paste into Cursor chat)
   * 2. Open in new document (user can use Cursor inline chat)
   * 3. Show in webview panel
   */
  private async presentPromptToUser(
    prompt: string,
    userRequest: string
  ): Promise<void> {
    const choice = await vscode.window.showQuickPick(
      [
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
      case 'copy':
        await vscode.env.clipboard.writeText(prompt);
        vscode.window.showInformationMessage(
          '✓ Prompt copied! Open Cursor chat and paste to generate Appian code.',
          'Open Chat'
        ).then((selected) => {
          if (selected === 'Open Chat') {
            vscode.commands.executeCommand('workbench.action.chat.open');
          }
        });
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
  async showFunctionReference(): Promise<void> {
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
