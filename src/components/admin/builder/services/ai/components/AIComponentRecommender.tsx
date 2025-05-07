import React, { useState } from 'react';
import AIService from '../AIService';
import { AIComponentSuggestion, ComponentSuggestionParams, AIServiceError } from '../ai-types';
import { Button } from '../../../../../ui/button';
import { Alert } from '../../../../../ui/alert';
import { Card } from '../../../../../ui/card';
import { Badge } from '../../../../../ui/badge';
import { Plus, Target } from 'lucide-react';
import { Textarea } from '../../../../../ui/textarea';

interface AIComponentRecommenderProps {
  currentComponents: any[];
  onAddComponent: (suggestion: AIComponentSuggestion) => void;
  userIntent?: string;
}

export const AIComponentRecommender: React.FC<AIComponentRecommenderProps> = ({
  currentComponents,
  onAddComponent,
  userIntent: initialIntent = ''
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AIComponentSuggestion[]>([]);
  const [userIntent, setUserIntent] = useState(initialIntent);

  const handleGetSuggestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: ComponentSuggestionParams = {
        currentComponents,
        context: 'landing-page',
        userIntent
      };

      const aiService = AIService.getInstance();
      const response = await aiService.suggestComponents(params);
      setSuggestions(response);
    } catch (err) {
      const error = err as AIServiceError;
      setError(error.message || 'Failed to generate component suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Component Recommendations</h3>
        
        <div className="space-y-2">
          <label htmlFor="intent" className="text-sm font-medium">
            What are you trying to achieve?
          </label>
          <Textarea
            id="intent"
            placeholder="e.g., Increase conversions, Showcase testimonials, Highlight features..."
            value={userIntent}
            onChange={(e) => setUserIntent(e.target.value)}
            className="h-20"
          />
        </div>

        <Button
          onClick={handleGetSuggestions}
          disabled={loading || !userIntent.trim()}
          className="w-full"
        >
          {loading ? 'Analyzing...' : 'Get Recommendations'}
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
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {suggestion.componentType.name}
                  </span>
                  <Badge variant="secondary">
                    {suggestion.componentType.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {suggestion.reason}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span>
                    {suggestion.suggestedPosition.parentId
                      ? `Inside ${suggestion.suggestedPosition.parentId}`
                      : 'At root level'}
                    {' - Position: '}
                    {suggestion.suggestedPosition.index + 1}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddComponent(suggestion)}
                className="ml-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {suggestions.length === 0 && !loading && !error && (
        <div className="text-center text-muted-foreground py-8">
          {userIntent
            ? 'Click "Get Recommendations" to see AI suggestions'
            : 'Describe your goal to get component recommendations'}
        </div>
      )}
    </div>
  );
};

export default AIComponentRecommender;