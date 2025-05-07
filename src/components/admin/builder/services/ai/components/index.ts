import { Component } from '../../../types';

// Component exports
export { default as AIContentGenerator } from './AIContentGenerator';
export { default as AIDesignSuggestions } from './AIDesignSuggestions';
export { default as AIComponentRecommender } from './AIComponentRecommender';
export { default as AIStyleOptimizer } from './AIStyleOptimizer';

// Props interfaces
export interface AIContentGeneratorProps {
  componentType: string;
  onContentGenerated: (content: string) => void;
  context?: string;
}

export interface AIDesignSuggestionsProps {
  currentLayout: Component[];
  breakpoint: string;
  onApplySuggestion: (changes: any) => void;
}

export interface AIComponentRecommenderProps {
  currentComponents: Component[];
  onAddComponent: (suggestion: any) => void;
  userIntent?: string;
}

export interface AIStyleOptimizerProps {
  component: Component;
  globalStyles: Record<string, string>;
  brandColors?: string[];
  onApplyStyles: (changes: any) => void;
}