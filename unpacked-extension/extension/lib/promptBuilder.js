const fs = require('fs');
const path = require('path');

/**
 * Builds optimized prompts for Cursor AI to generate Appian code
 */
class PromptBuilder {
  constructor() {
    this.bestPractices = null;
    this.loadBestPractices();
  }

  /**
   * Load best practices from JSON file
   */
  loadBestPractices() {
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
  buildPrompt(context) {
    const sections = [];

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
  buildBestPracticesSection(userRequest) {
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
  filterBestPractices(requestKeywords) {
    if (!this.bestPractices) {
      return [];
    }

    const selected = [];

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
    const relevantCategories = new Set();
    for (const [category, triggers] of Object.entries(categoryTriggers)) {
      if (triggers.some(trigger => requestKeywords.includes(trigger))) {
        relevantCategories.add(category);
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
  extractKeywords(text) {
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
  buildSystemInstructions() {
    return `# Appian Expression Language (AEL) Code Generation

You are an expert Appian developer. Generate valid Appian Expression Language (AEL) code based on the user's request.

## Critical AEL Syntax Rules:
**Appian Expression Language is NOT JavaScript/Java. Follow these rules strictly:**

1. **Conditional Logic**: Use \`if(condition, valueIfTrue, valueIfFalse)\`
   - ❌ NEVER use ternary operators: \`condition ? true : false\`
   - ✅ ALWAYS use: \`if(condition, value1, value2)\`

2. **Function Calls**: All functions use parentheses and named parameters
   - Example: \`a!textField(label: "Name", value: local!name)\`

3. **Local Variables**: Declare with \`a!localVariables()\`
   - Use \`local!\` prefix: \`local!myVar: "value"\`

4. **Comments**: Use block comment syntax
   - ✅ Correct: \`/* This is a comment */\`
   - ❌ NEVER use: \`// This is wrong\`

5. **No Semicolons**: Expressions don't end with semicolons

6. **No JavaScript Operators**:
   - ❌ No \`&&\`, \`||\`, \`!\` operators
   - ✅ Use: \`and()\`, \`or()\`, \`not()\` functions

## Important Guidelines:
- Generate ONLY valid AEL code - no explanations, no markdown formatting, no code blocks
- Use proper Appian syntax and naming conventions
- Follow Appian best practices for performance and maintainability
- Use the provided function reference below for accurate function signatures
- If the request is ambiguous, make reasonable assumptions and document them in \`/* block comments */\`
- Return the raw AEL code ready to be inserted into an Appian interface or expression`;
  }

  /**
   * Build the function reference section with enriched documentation
   */
  buildFunctionReference(functions) {
    let output = `# Relevant Appian Functions\n\nUse these functions as needed for the implementation:\n\n`;

    for (const func of functions) {
      // Function signature
      output += `### ${func.signature}\n`;

      // Enriched description (if available) or fallback to basic description
      const description = func.enrichedDescription || func.description;
      if (description && description !== func.name) {
        output += `${description}\n`;
      }

      // Return type information
      if (func.returnType) {
        output += `**Returns:** ${func.returnType}`;
        if (func.returnDescription) {
          output += ` - ${func.returnDescription}`;
        }
        output += '\n';
      }

      // Use case (when to use this function)
      if (func.useCase) {
        output += `**Use case:** ${func.useCase}\n`;
      }

      // Examples (limit to first 2 for brevity, clean up garbage text)
      if (func.examples && func.examples.length > 0) {
        const cleanExample = this.cleanExample(func.examples[0]);
        if (cleanExample) {
          output += `**Example:** \`${cleanExample}\`\n`;
        }
      }

      output += '\n';
    }

    return output;
  }

  /**
   * Build the user request section
   */
  buildUserRequest(request) {
    return `# User Request\n\n${request}`;
  }

  /**
   * Build output format instructions
   */
  buildOutputInstructions() {
    return `# Output Format\n\nGenerate the Appian Expression Language code below. Do NOT include markdown code blocks, explanations, or any text other than the raw AEL code:\n\n`;
  }

  /**
   * Clean up scraped examples by removing common garbage patterns
   */
  cleanExample(example) {
    if (!example) return '';

    let cleaned = example;

    // Remove leading numbers and spaces (from scraping artifacts)
    // Pattern: "1 2 3 4 5if(...)" -> "if(...)"
    cleaned = cleaned.replace(/^[\d\s]+(?=[a-zA-Z!{(])/, '');

    // Remove trailing "See also" and similar artifacts
    cleaned = cleaned.replace(/\s*(See also|Related|Privacy|Disclaimer).*$/i, '');

    // Trim whitespace
    cleaned = cleaned.trim();

    // Return null if example is too short or empty after cleaning
    if (cleaned.length < 5) {
      return null;
    }

    return cleaned;
  }
}

module.exports = { PromptBuilder };
