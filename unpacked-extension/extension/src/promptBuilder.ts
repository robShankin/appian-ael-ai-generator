import { GenerationContext } from './types';
import * as fs from 'fs';
import * as path from 'path';

interface BestPractice {
  rule: string;
  example?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  keywords: string[];
}

interface BestPractices {
  coreRules: BestPractice[];
  performance: BestPractice[];
  nullHandling: BestPractice[];
  localVariables: BestPractice[];
  advanced: BestPractice[];
}

/**
 * Builds optimized prompts for Cursor AI to generate Appian code
 */
export class PromptBuilder {
  private bestPractices: BestPractices | null = null;

  constructor() {
    this.loadBestPractices();
  }

  /**
   * Load best practices from JSON file
   */
  private loadBestPractices(): void {
    try {
      const bestPracticesPath = path.join(__dirname, '..', 'appian-best-practices.json');
      const content = fs.readFileSync(bestPracticesPath, 'utf8');
      this.bestPractices = JSON.parse(content);
    } catch (error) {
      console.error('Failed to load best practices:', error);
      this.bestPractices = null;
    }
  }

  /**
   * Build a complete prompt for code generation
   */
  buildPrompt(context: GenerationContext): string {
    const sections: string[] = [];

    // System instructions
    sections.push(this.buildSystemInstructions());

    // Best practices (contextually filtered)
    if (this.bestPractices) {
      const practicesSection = this.buildBestPracticesSection(context.userRequest);
      if (practicesSection) {
        sections.push(practicesSection);
      }
    }

    // Relevant function reference
    if (context.relevantFunctions.length > 0) {
      sections.push(this.buildFunctionReference(context.relevantFunctions));
    }

    // User request
    sections.push(this.buildUserRequest(context.userRequest));

    // Output format instructions
    sections.push(this.buildOutputInstructions());

    return sections.join('\n\n---\n\n');
  }

  /**
   * Build best practices section based on user request context
   */
  private buildBestPracticesSection(userRequest: string): string | null {
    if (!this.bestPractices) {
      return null;
    }

    const keywords = this.extractKeywords(userRequest);
    const selectedPractices = this.filterBestPractices(keywords);

    if (selectedPractices.length === 0) {
      return null;
    }

    let output = '# Appian Best Practices & Patterns\n\n';
    output += 'Follow these Appian-specific guidelines when generating code:\n\n';

    for (const practice of selectedPractices) {
      output += `• ${practice.rule}\n`;
      if (practice.example) {
        output += `  Example: ${practice.example}\n`;
      }
      output += '\n';
    }

    return output;
  }

  /**
   * Filter best practices based on user request keywords
   */
  private filterBestPractices(requestKeywords: string[]): BestPractice[] {
    if (!this.bestPractices) {
      return [];
    }

    const selected: BestPractice[] = [];

    // Always include critical core rules
    const criticalCoreRules = this.bestPractices.coreRules.filter(
      p => p.priority === 'critical'
    );
    selected.push(...criticalCoreRules);

    // Define category triggers
    const categoryTriggers = {
      performance: ['loop', 'query', 'large', 'filter', 'pagination', 'array', 'foreach', 'apply', 'data'],
      nullHandling: ['null', 'empty', 'optional', 'missing', 'default', 'filter'],
      localVariables: ['variable', 'local!', 'a!localvariables', 'store', 'temporary'],
      advanced: ['partial', 'dynamic', 'complex', 'nested', 'cast', 'type']
    };

    // Check which categories are relevant
    const relevantCategories = new Set<keyof BestPractices>();
    for (const [category, triggers] of Object.entries(categoryTriggers)) {
      if (triggers.some(trigger => requestKeywords.includes(trigger))) {
        relevantCategories.add(category as keyof BestPractices);
      }
    }

    // Add relevant practices from each category (max 5 per category, prioritize critical/high)
    for (const category of relevantCategories) {
      const categoryPractices = this.bestPractices[category] || [];
      const sortedPractices = categoryPractices
        .filter(p => {
          // Include if practice keywords match request keywords
          return p.keywords.some(kw => requestKeywords.includes(kw));
        })
        .sort((a, b) => {
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        })
        .slice(0, 5);

      selected.push(...sortedPractices);
    }

    // Remove duplicates and limit total
    const uniquePractices = Array.from(
      new Map(selected.map(p => [p.rule, p])).values()
    );

    // Limit to 20 total practices
    return uniquePractices.slice(0, 20);
  }

  /**
   * Extract keywords from user request
   */
  private extractKeywords(text: string): string[] {
    // Convert to lowercase and split into words
    const words = text.toLowerCase()
      .replace(/[^\w\s!]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);

    // Remove common stop words
    const stopWords = new Set([
      'the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'has',
      'are', 'was', 'were', 'been', 'will', 'would', 'could', 'should',
      'can', 'may', 'might', 'must', 'shall', 'does', 'did', 'doing'
    ]);

    return words.filter(word => !stopWords.has(word));
  }

  /**
   * Build system instructions for the AI
   */
  private buildSystemInstructions(): string {
    return `# Appian Expression Language (AEL) Code Generation

You are an expert Appian developer. Generate valid Appian Expression Language (AEL) code based on the user's request.

## Critical AEL Syntax Rules:
- NO ternary operators (condition ? true : false) - use if() function instead
- NO JavaScript operators like &&, ||, ! - use and(), or(), not() functions
- NO line comments (//) - use block comments /* */ only
- NO semicolons at end of statements
- Arrays use braces {} with comma separation, index starts at 1
- Text concatenation uses & operator, not +
- Local variables use a!localVariables() with local! prefix

## Important Guidelines:
- Generate ONLY valid AEL code - no explanations, no markdown formatting, no code blocks
- Use proper Appian syntax and naming conventions
- Follow Appian best practices for performance and maintainability
- Use the provided function reference below for accurate function signatures
- If the request is ambiguous, make reasonable assumptions and document them in code comments
- Return the raw AEL code ready to be inserted into an Appian interface or expression`;
  }

  /**
   * Build the function reference section
   */
  private buildFunctionReference(functions: any[]): string {
    let output = `# Relevant Appian Functions\n\nUse these functions as needed for the implementation:\n\n`;

    for (const func of functions) {
      output += `**${func.signature}**\n`;
      if (func.description && func.description !== func.name) {
        output += `  ${func.description}\n`;
      }
      output += '\n';
    }

    return output;
  }

  /**
   * Build the user request section
   */
  private buildUserRequest(request: string): string {
    return `# User Request\n\n${request}`;
  }

  /**
   * Build output format instructions
   */
  private buildOutputInstructions(): string {
    return `# Output Format\n\nGenerate the Appian Expression Language code below. Do NOT include markdown code blocks, explanations, or any text other than the raw AEL code:\n\n`;
  }
}
