import React from 'react';
import { useImageStore } from '../store';
import { TransformationHistory as TransformationHistoryType } from '../types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';

interface TransformationHistoryProps {
  imageId?: string;
  maxHeight?: string;
  className?: string;
}

export const TransformationHistory: React.FC<TransformationHistoryProps> = ({
  imageId,
  maxHeight = '400px',
  className
}) => {
  const { 
    transformationHistory,
    transformationPresets,
    optimizeImage,
    selectedImage
  } = useImageStore();

  // Filter history for current image if imageId is provided
  const filteredHistory = React.useMemo(() => {
    if (!imageId) return transformationHistory;
    return transformationHistory.filter(item => item.assetId === imageId);
  }, [imageId, transformationHistory]);

  const getPresetName = (presetId: string) => {
    if (presetId === 'custom') return 'Custom Settings';
    const preset = transformationPresets.find(p => p.id === presetId);
    return preset?.name || 'Unknown Preset';
  };

  const handleRevert = async (historyItem: TransformationHistoryType) => {
    if (!selectedImage) {
      toast({
        title: 'Error',
        description: 'No image selected',
        variant: 'destructive',
      });
      return;
    }

    try {
      await optimizeImage(selectedImage.id, historyItem.settings);
      toast({
        title: 'Success',
        description: 'Transformation applied successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to apply transformation',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(date));
  };

  const formatSettings = (historyItem: TransformationHistoryType) => {
    const { settings } = historyItem;
    const parts = [
      `Quality: ${settings.quality}%`,
      `Format: ${settings.format}`,
      settings.resize && `Resize: ${settings.resize.width}x${settings.resize.height}`,
      settings.effects && Object.entries(settings.effects)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')
    ].filter(Boolean);

    return parts.join(' • ');
  };

  return (
    <div className={className}>
      <ScrollArea style={{ maxHeight }} className="pr-4">
        <div className="space-y-2">
          {filteredHistory.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No transformation history
            </div>
          ) : (
            filteredHistory.map((item) => (
              <Card key={item.id} className="relative">
                <CardHeader className="p-4">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{getPresetName(item.presetId)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevert(item)}
                      disabled={!selectedImage}
                    >
                      Revert to This
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    {formatDate(item.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-sm truncate">
                          {formatSettings(item)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{formatSettings(item)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {/* Preview */}
                  <div className="mt-2 aspect-video relative overflow-hidden rounded-md">
                    <img
                      src={item.resultUrl}
                      alt="Transformation result"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TransformationHistory;