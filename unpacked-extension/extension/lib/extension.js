const vscode = require('vscode');
const { AppianCodeGenerator } = require('./appianCodeGenerator');

/**
 * Extension activation entry point
 */
function activate(context) {
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

  // Register command: Generate inline with auto-triggered chat
  const generateInlineCommand = vscode.commands.registerCommand(
    'appian-ael.generateInline',
    async () => {
      await generator.generateInline();
    }
  );

  context.subscriptions.push(
    generateCommand,
    generateFromSelectionCommand,
    showReferenceCommand,
    generateInlineCommand
  );
}

/**
 * Extension deactivation
 */
function deactivate() {
  console.log('Appian AEL Code Generator extension is now deactivated');
}

module.exports = {
  activate,
  deactivate
};
