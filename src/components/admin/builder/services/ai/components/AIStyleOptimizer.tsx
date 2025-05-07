import React, { useState } from 'react';
import AIService from '../AIService';
import { AIStyleSuggestion, StyleOptimizationParams, AIServiceError } from '../ai-types';
import { Button } from '../../../../../ui/button';
import { Alert } from '../../../../../ui/alert';
import { Card } from '../../../../../ui/card';
import { Badge } from '../../../../../ui/badge';
import { Wand2 } from 'lucide-react';
import { Component } from '../../../types';

interface AIStyleOptimizerProps {
  component: Component;
  globalStyles: Record<string, string>;
  brandColors?: string[];
  onApplyStyles: (changes: Partial<AIStyleSuggestion>) => void;
}

export const AIStyleOptimizer: React.FC<AIStyleOptimizerProps> = ({
  component,
  globalStyles,
  brandColors = [],
  onApplyStyles
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<AIStyleSuggestion | null>(null);

  const handleOptimize = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: StyleOptimizationParams = {
        component,
        globalStyles,
        brandColors
      };

      const aiService = AIService.getInstance();
      const response = await aiService.optimizeStyles(params);
      setSuggestion(response);
    } catch (err) {
      const error = err as AIServiceError;
      setError(error.message || 'Failed to generate style suggestions');
    } finally {
      setLoading(false);
    }
  };

  const renderStyleChanges = (changes: Partial<AIStyleSuggestion['styleChanges']>) => {
    const categories = Object.keys(changes);
    return categories.map(category => {
      const properties = changes[category];
      if (!properties) return null;

      return (
        <div key={category} className="space-y-1">
          <Badge variant="outline" className="mb-2">
            {category}
          </Badge>
          {Object.entries(properties).map(([prop, value]) => (
            <div key={prop} className="text-sm flex items-center justify-between">
              <span className="text-muted-foreground">{prop}:</span>
              <span className="font-mono">{value as string}</span>
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Style Optimization</h3>
        <Button
          onClick={handleOptimize}
          disabled={loading}
          size="sm"
          variant="outline"
        >
          {loading ? 'Optimizing...' : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Optimize Styles
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      {suggestion && (
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <p className="font-medium">{suggestion.reason}</p>
            <div className="text-sm text-muted-foreground">
              Confidence: {Math.round(suggestion.confidence * 100)}%
            </div>
          </div>

          <div className="space-y-4">
            {renderStyleChanges(suggestion.styleChanges)}
          </div>

          <Button
            onClick={() => onApplyStyles(suggestion)}
            className="w-full"
            variant="default"
          >
            Apply Optimizations
          </Button>
        </Card>
      )}

      {!suggestion && !loading && !error && (
        <div className="text-center text-muted-foreground py-8">
          Click "Optimize Styles" to get AI-powered style suggestions
        </div>
      )}
    </div>
  );
};

export default AIStyleOptimizer;