// Export AI types
export * from './ai-types';

// Export AI service
export { default as AIService } from './AIService';

// Export AI components
export {
  AIContentGenerator,
  AIDesignSuggestions,
  AIComponentRecommender,
  AIStyleOptimizer,
  type AIContentGeneratorProps,
  type AIDesignSuggestionsProps,
  type AIComponentRecommenderProps,
  type AIStyleOptimizerProps,
} from './components';

// Export constants and utilities
export const AI_CONFIG = {
  maxRequestsPerMinute: 60,
  maxTokensPerDay: 100000,
  apiEndpoint: process.env.VITE_OPENAI_API_ENDPOINT || 'https://api.openai.com/v1',
  defaultModel: 'gpt-4',
  cacheDuration: 1000 * 60 * 60, // 1 hour
};

// Export AI panel types
export type AIPanelState = {
  isOpen: boolean;
  type: 'content' | 'design' | 'components' | 'styles' | null;
};

export type AIActionType = 'content' | 'design' | 'components' | 'styles';

// Export utility functions
export const createAIPrompt = (type: AIActionType, context: Record<string, any>): string => {
  const prompts: Record<AIActionType, string> = {
    content: `Generate content for a ${context.componentType} component. 
             Consider: ${context.description || 'No specific requirements'}. 
             Tone: ${context.tone || 'professional'}`,
    
    design: `Analyze the current layout and suggest improvements for ${context.breakpoint} view. 
            Focus on: Visual hierarchy, spacing, and alignment. 
            Style preferences: ${JSON.stringify(context.stylePreferences || {})}`,
    
    components: `Recommend components that would enhance the current layout. 
                Current components: ${context.currentComponents?.length || 0}. 
                User intent: ${context.userIntent || 'No specific intent provided'}`,
    
    styles: `Optimize styles for the selected component of type ${context.componentType}. 
            Consider: Brand colors, typography, and spacing system. 
            Current breakpoint: ${context.breakpoint}`
  };

  return prompts[type];
};

export const getAIConfidence = (
  type: AIActionType,
  context: Record<string, any>
): number => {
  const baseConfidence = 0.7;
  const confidenceFactors: Record<string, number> = {
    hasContext: 0.1,
    hasPreferences: 0.1,
    hasExistingContent: 0.1,
  };

  let confidence = baseConfidence;
  
  if (context.description || context.userIntent) confidence += confidenceFactors.hasContext;
  if (context.stylePreferences) confidence += confidenceFactors.hasPreferences;
  if (context.currentComponents?.length > 0) confidence += confidenceFactors.hasExistingContent;

  return Math.min(confidence, 1);
};