import OpenAI from 'openai';
import {
  AIContentResponse,
  AIDesignSuggestion,
  AIComponentSuggestion,
  AIStyleSuggestion,
  AIServiceError,
  ContentGenerationParams,
  DesignSuggestionParams,
  ComponentSuggestionParams,
  StyleOptimizationParams,
  AISuggestionCache,
  RateLimitConfig,
  RateLimitInfo
} from './ai-types';

class AIService {
  private static instance: AIService;
  private openai: OpenAI;
  private cache: AISuggestionCache;
  private rateLimitConfig: RateLimitConfig;
  private rateLimit: RateLimitInfo;

  private constructor() {
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY
    });
    this.cache = {
      contentCache: new Map(),
      designCache: new Map(),
      componentCache: new Map(),
      styleCache: new Map()
    };
    this.rateLimitConfig = {
      maxRequestsPerMinute: 60,
      maxTokensPerDay: 100000,
      cooldownPeriod: 60000 // 1 minute
    };
    this.rateLimit = {
      remainingRequests: this.rateLimitConfig.maxRequestsPerMinute,
      remainingTokens: this.rateLimitConfig.maxTokensPerDay,
      resetTime: new Date(Date.now() + this.rateLimitConfig.cooldownPeriod)
    };
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private async checkRateLimit(): Promise<void> {
    if (Date.now() >= this.rateLimit.resetTime.getTime()) {
      this.rateLimit.remainingRequests = this.rateLimitConfig.maxRequestsPerMinute;
      this.rateLimit.resetTime = new Date(Date.now() + this.rateLimitConfig.cooldownPeriod);
    }

    if (this.rateLimit.remainingRequests <= 0) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    this.rateLimit.remainingRequests--;
  }

  private getCacheKey(params: object): string {
    return JSON.stringify(params);
  }

  public async generateContent(params: ContentGenerationParams): Promise<AIContentResponse> {
    await this.checkRateLimit();
    const cacheKey = this.getCacheKey(params);
    const cached = this.cache.contentCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const prompt = `Generate ${params.length || 'medium'} length content for a ${params.componentType} component.
                     Context: ${params.context}
                     Tone: ${params.tone || 'professional'}`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        n: 3,
        max_tokens: 500
      });

      const result: AIContentResponse = {
        content: completion.choices[0].message.content?.trim() || '',
        confidence: 0.8,
        alternatives: completion.choices.slice(1).map(c => c.message.content?.trim() || '')
      };

      this.cache.contentCache.set(cacheKey, result);
      return result;

    } catch (error) {
      throw {
        code: 'CONTENT_GENERATION_ERROR',
        message: 'Failed to generate content',
        suggestion: 'Please try again or adjust your parameters'
      } as AIServiceError;
    }
  }

  public async getDesignSuggestions(params: DesignSuggestionParams): Promise<AIDesignSuggestion[]> {
    await this.checkRateLimit();
    const cacheKey = this.getCacheKey(params);
    const cached = this.cache.designCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const prompt = `Analyze the current layout and suggest design improvements for ${params.targetBreakpoint} breakpoint.
                     Consider visual hierarchy, spacing, and alignment.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 500
      });

      // Process and structure the suggestions
      const suggestions = this.processDesignSuggestions(completion.choices[0].message.content || '');
      this.cache.designCache.set(cacheKey, suggestions);
      return suggestions;

    } catch (error) {
      throw {
        code: 'DESIGN_SUGGESTION_ERROR',
        message: 'Failed to generate design suggestions',
        suggestion: 'Try with a simpler layout or fewer components'
      } as AIServiceError;
    }
  }

  private processDesignSuggestions(rawSuggestions: string): AIDesignSuggestion[] {
    // Transform raw AI output into structured design suggestions
    // This is a placeholder implementation
    return [{
      recommendation: "Improve spacing between components",
      layoutChanges: [{
        componentId: "sample-id",
        changes: {
          layout: { gap: "2rem" }
        }
      }],
      confidence: 0.85
    }];
  }

  public async suggestComponents(params: ComponentSuggestionParams): Promise<AIComponentSuggestion[]> {
    await this.checkRateLimit();
    const cacheKey = this.getCacheKey(params);
    const cached = this.cache.componentCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Implementation for component suggestions
      // This would analyze the current components and suggest new ones based on context
      return [];
    } catch (error) {
      throw {
        code: 'COMPONENT_SUGGESTION_ERROR',
        message: 'Failed to generate component suggestions',
        suggestion: 'Try providing more context about your needs'
      } as AIServiceError;
    }
  }

  public async optimizeStyles(params: StyleOptimizationParams): Promise<AIStyleSuggestion> {
    await this.checkRateLimit();
    const cacheKey = this.getCacheKey(params);
    const cached = this.cache.styleCache.get(cacheKey);
    
    if (cached?.[0]) {
      return cached[0];
    }

    try {
      // Implementation for style optimization
      // This would analyze current styles and suggest improvements
      return {
        componentId: params.component.id,
        styleChanges: {},
        reason: "Placeholder optimization",
        confidence: 0.7
      };
    } catch (error) {
      throw {
        code: 'STYLE_OPTIMIZATION_ERROR',
        message: 'Failed to optimize styles',
        suggestion: 'Try with simpler style properties'
      } as AIServiceError;
    }
  }
}

export default AIService;