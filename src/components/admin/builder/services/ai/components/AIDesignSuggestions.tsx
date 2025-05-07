import React, { useState } from 'react';
import AIService from '../AIService';
import { AIDesignSuggestion, DesignSuggestionParams, AIServiceError } from '../ai-types';
import { Button } from '../../../../../ui/button';
import { Alert } from '../../../../../ui/alert';
import { Card } from '../../../../../ui/card';
import { Separator } from '../../../../../ui/separator';
import { Check, ArrowRight } from 'lucide-react';

interface AIDesignSuggestionsProps {
  currentLayout: any[];
  breakpoint: string;
  onApplySuggestion: (changes: AIDesignSuggestion) => void;
}

export const AIDesignSuggestions: React.FC<AIDesignSuggestionsProps> = ({
  currentLayout,
  breakpoint,
  onApplySuggestion
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AIDesignSuggestion[]>([]);

  const handleGetSuggestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: DesignSuggestionParams = {
        currentLayout,
        targetBreakpoint: breakpoint,
        stylePreferences: {
          spacing: 'comfortable',
          alignment: 'balanced',
          hierarchy: 'clear'
        }
      };

      const aiService = AIService.getInstance();
      const response = await aiService.getDesignSuggestions(params);
      setSuggestions(response);
    } catch (err) {
      const error = err as AIServiceError;
      setError(error.message || 'Failed to generate design suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Design Suggestions</h3>
        <Button
          onClick={handleGetSuggestions}
          disabled={loading}
          size="sm"
        >
          {loading ? 'Analyzing...' : 'Analyze Layout'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="font-medium">{suggestion.recommendation}</p>
                <div className="text-sm text-muted-foreground">
                  Confidence: {Math.round(suggestion.confidence * 100)}%
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onApplySuggestion(suggestion)}
                className="ml-2"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <Separator className="my-3" />
            
            <div className="space-y-2">
              {suggestion.layoutChanges.map((change, changeIndex) => (
                <div
                  key={changeIndex}
                  className="text-sm flex items-center text-muted-foreground"
                >
                  <Check className="h-4 w-4 mr-2" />
                  <span>
                    {`Adjust ${Object.keys(change.changes).join(', ')} for ${change.componentId}`}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {suggestions.length === 0 && !loading && !error && (
        <div className="text-center text-muted-foreground py-8">
          Click "Analyze Layout" to get AI-powered design suggestions
        </div>
      )}
    </div>
  );
};

export default AIDesignSuggestions;