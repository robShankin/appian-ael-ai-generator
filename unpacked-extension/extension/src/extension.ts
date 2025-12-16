import * as vscode from 'vscode';
import { AppianCodeGenerator } from './appianCodeGenerator';

/**
 * Extension activation entry point
 * Called when extension is activated (on first use of registered commands)
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Appian AEL Code Generator extension is now active');

  const generator = new AppianCodeGenerator(context);

  // Register command: Generate Appian code from prompt
  const generateCommand = vscode.commands.registerCommand(
    'appian-ael.generateCode',
    async () => {
      await generator.generateFromPrompt();
    }
  );

  // Register command: Generate Appian code from selection
  const generateFromSelectionCommand = vscode.commands.registerCommand(
    'appian-ael.generateFromSelection',
    async () => {
      await generator.generateFromSelection();
    }
  );

  // Register command: Show Appian function reference
  const showReferenceCommand = vscode.commands.registerCommand(
    'appian-ael.showReference',
    async () => {
      await generator.showFunctionReference();
    }
  );

  context.subscriptions.push(
    generateCommand,
    generateFromSelectionCommand,
    showReferenceCommand
  );
}

/**
 * Extension deactivation
 */
export function deactivate() {
  console.log('Appian AEL Code Generator extension is now deactivated');
}
