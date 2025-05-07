import React, { useState } from 'react';
import AIService from '../AIService';
import { AIContentResponse, ContentGenerationParams, AIServiceError } from '../ai-types';
import { Button } from '../../../../../ui/button';
import { Input } from '../../../../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../ui/select';
import { Alert } from '../../../../../ui/alert';

interface AIContentGeneratorProps {
  componentType: string;
  onContentGenerated: (content: string) => void;
  context?: string;
}

export const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({
  componentType,
  onContentGenerated,
  context = ''
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tone, setTone] = useState<string>('professional');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [suggestions, setSuggestions] = useState<AIContentResponse | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: ContentGenerationParams = {
        componentType,
        context,
        tone,
        length
      };

      const aiService = AIService.getInstance();
      const response = await aiService.generateContent(params);
      setSuggestions(response);
      
      // Automatically apply the main suggestion
      onContentGenerated(response.content);
    } catch (err) {
      const error = err as AIServiceError;
      setError(error.message || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAlternative = (content: string) => {
    onContentGenerated(content);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background">
      <div className="flex gap-4">
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="friendly">Friendly</SelectItem>
            <SelectItem value="formal">Formal</SelectItem>
          </SelectContent>
        </Select>

        <Select value={length} onValueChange={(value) => setLength(value as 'short' | 'medium' | 'long')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select length" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short">Short</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="long">Long</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Input
        placeholder="Add additional context for content generation..."
        value={context}
        onChange={(e) => onContentGenerated(e.target.value)}
      />

      <Button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Generating...' : 'Generate Content'}
      </Button>

      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      {suggestions && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">Alternative Suggestions:</h3>
          {suggestions.alternatives.map((alternative, index) => (
            <div
              key={index}
              className="p-2 border rounded hover:bg-accent cursor-pointer"
              onClick={() => handleSelectAlternative(alternative)}
            >
              {alternative}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIContentGenerator;