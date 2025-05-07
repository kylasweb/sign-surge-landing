import { Component, ComponentType, StyleProperties } from '../../types';

// AI Service Response Types
export interface AIContentResponse {
  content: string;
  confidence: number;
  alternatives: string[];
}

export interface AIDesignSuggestion {
  recommendation: string;
  layoutChanges: {
    componentId: string;
    changes: Partial<StyleProperties>;
  }[];
  confidence: number;
}

export interface AIComponentSuggestion {
  componentType: ComponentType;
  reason: string;
  suggestedPosition: {
    parentId: string | null;
    index: number;
  };
  confidence: number;
}

export interface AIStyleSuggestion {
  componentId: string;
  styleChanges: Partial<StyleProperties>;
  reason: string;
  confidence: number;
}

// AI Service Error Types
export interface AIServiceError {
  code: string;
  message: string;
  suggestion?: string;
}

// AI Service Request Types
export interface ContentGenerationParams {
  componentType: string;
  context: string;
  tone?: string;
  length?: 'short' | 'medium' | 'long';
}

export interface DesignSuggestionParams {
  currentLayout: Component[];
  targetBreakpoint: string;
  stylePreferences?: Record<string, string>;
}

export interface ComponentSuggestionParams {
  currentComponents: Component[];
  context: string;
  userIntent?: string;
}

export interface StyleOptimizationParams {
  component: Component;
  globalStyles: Record<string, string>;
  brandColors?: string[];
}

// Cache Types
export interface AISuggestionCache {
  contentCache: Map<string, AIContentResponse>;
  designCache: Map<string, AIDesignSuggestion[]>;
  componentCache: Map<string, AIComponentSuggestion[]>;
  styleCache: Map<string, AIStyleSuggestion[]>;
}

// Rate Limiting Types
export interface RateLimitConfig {
  maxRequestsPerMinute: number;
  maxTokensPerDay: number;
  cooldownPeriod: number;
}

export interface RateLimitInfo {
  remainingRequests: number;
  remainingTokens: number;
  resetTime: Date;
}