/**
 * Type definitions for Appian function reference data
 */

export interface AppianFunction {
  name: string;
  signature: string;
  category: string;
  description: string;
  searchTerms: string[];
}

export interface FunctionReference {
  metadata: {
    version: string;
    source: string;
    convertedAt: string;
    totalFunctions: number;
  };
  functions: AppianFunction[];
  categories: {
    [category: string]: AppianFunction[];
  };
}

export interface GenerationContext {
  userRequest: string;
  relevantFunctions: AppianFunction[];
  additionalContext?: string;
}
