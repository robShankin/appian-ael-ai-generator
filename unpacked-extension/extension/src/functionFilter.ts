import { AppianFunction, FunctionReference } from './types';

/**
 * Filters Appian functions based on user request
 * Uses semantic keyword matching to find relevant functions
 */
export class FunctionFilter {
  private readonly MAX_FUNCTIONS = 15; // Limit functions to control token usage

  /**
   * Find functions relevant to the user's request
   */
  findRelevantFunctions(
    userRequest: string,
    reference: FunctionReference
  ): AppianFunction[] {
    const keywords = this.extractKeywords(userRequest);
    const scored: Array<{ func: AppianFunction; score: number }> = [];

    // Score each function based on relevance
    for (const func of reference.functions) {
      const score = this.calculateRelevanceScore(func, keywords, userRequest);
      if (score > 0) {
        scored.push({ func, score });
      }
    }

    // Sort by score (descending) and take top N
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, this.MAX_FUNCTIONS).map((item) => item.func);
  }

  /**
   * Extract keywords from user request
   */
  private extractKeywords(text: string): string[] {
    // Convert to lowercase and extract words
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2); // Filter out very short words

    // Remove common stop words
    const stopWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'from',
      'by',
      'as',
      'is',
      'was',
      'are',
      'been',
      'be',
      'have',
      'has',
      'had',
      'do',
      'does',
      'did',
      'will',
      'would',
      'could',
      'should',
      'may',
      'might',
      'must',
      'can',
      'this',
      'that',
      'these',
      'those',
      'i',
      'you',
      'he',
      'she',
      'it',
      'we',
      'they',
      'want',
      'need',
      'create',
      'make',
      'get',
      'use',
      'using',
    ]);

    return words.filter((w) => !stopWords.has(w));
  }

  /**
   * Calculate relevance score for a function
   */
  private calculateRelevanceScore(
    func: AppianFunction,
    keywords: string[],
    fullRequest: string
  ): number {
    let score = 0;
    const fullRequestLower = fullRequest.toLowerCase();

    // Exact function name match in request (highest score)
    if (fullRequestLower.includes(func.name.toLowerCase())) {
      score += 100;
    }

    // Category match
    if (keywords.includes(func.category.toLowerCase())) {
      score += 30;
    }

    // Search term matches
    for (const searchTerm of func.searchTerms) {
      if (keywords.includes(searchTerm)) {
        score += 15;
      }
      // Partial match
      if (keywords.some((k) => searchTerm.includes(k) || k.includes(searchTerm))) {
        score += 5;
      }
    }

    // Keyword matches in function signature or description
    for (const keyword of keywords) {
      const sigLower = func.signature.toLowerCase();
      const descLower = func.description.toLowerCase();

      if (sigLower.includes(keyword)) {
        score += 10;
      }
      if (descLower.includes(keyword)) {
        score += 5;
      }
    }

    // Boost for UI components if request mentions UI-related terms
    const uiTerms = ['dropdown', 'field', 'button', 'form', 'grid', 'chart', 'display', 'input', 'select', 'picker', 'layout', 'section'];
    if (uiTerms.some((term) => fullRequestLower.includes(term))) {
      if (func.category === 'ui' || func.name.startsWith('a!')) {
        score += 20;
      }
    }

    // Boost for array functions if request mentions arrays/lists
    const arrayTerms = ['array', 'list', 'collection', 'filter', 'map', 'sort', 'append', 'remove'];
    if (arrayTerms.some((term) => fullRequestLower.includes(term))) {
      if (func.category === 'arrays') {
        score += 20;
      }
    }

    // Boost for date functions if request mentions dates/time
    const dateTerms = ['date', 'time', 'datetime', 'today', 'now', 'calendar', 'day', 'month', 'year'];
    if (dateTerms.some((term) => fullRequestLower.includes(term))) {
      if (func.category === 'dates') {
        score += 20;
      }
    }

    // Boost for text functions if request mentions text operations
    const textTerms = ['text', 'string', 'concat', 'split', 'trim', 'upper', 'lower', 'search', 'replace'];
    if (textTerms.some((term) => fullRequestLower.includes(term))) {
      if (func.category === 'text') {
        score += 20;
      }
    }

    return score;
  }
}
