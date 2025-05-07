import React from 'react';
import { useImageStore } from '../store';
import { ImageMetadata, ImageOptimizationSettings } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageComponentData {
  src: string;
  alt: string;
  style?: React.CSSProperties;
}

interface ImagePropertiesPanelProps {
  componentId: string;
  data: ImageComponentData;
  onChange: (data: Partial<ImageComponentData>) => void;
  className?: string;
}

export const ImagePropertiesPanel: React.FC<ImagePropertiesPanelProps> = ({
  componentId,
  data,
  onChange,
  className
}) => {
  const { images, optimizeImage } = useImageStore();
  const currentImage = images.find(img => img.url === data.src);

  const handleOptimizationChange = async (settings: ImageOptimizationSettings) => {
    if (!currentImage) return;

    try {
      const optimizedImage = await optimizeImage(currentImage.id, settings);
      onChange({ src: optimizedImage.url });
    } catch (error) {
      console.error('Failed to optimize image:', error);
    }
  };

  const objectFitOptions = [
    { value: 'contain', label: 'Contain' },
    { value: 'cover', label: 'Cover' },
    { value: 'fill', label: 'Fill' },
    { value: 'none', label: 'None' },
    { value: 'scale-down', label: 'Scale Down' },
  ];

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-4 space-y-4">
        {/* Alt Text */}
        <div className="space-y-2">
          <Label htmlFor="alt-text">Alt Text</Label>
          <Input
            id="alt-text"
            value={data.alt}
            onChange={(e) => onChange({ alt: e.target.value })}
            placeholder="Describe the image..."
          />
        </div>

        {/* Object Fit */}
        <div className="space-y-2">
          <Label>Object Fit</Label>
          <Select
            value={data.style?.objectFit || 'cover'}
            onValueChange={(value) => onChange({
              style: { ...data.style, objectFit: value as any }
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select object fit" />
            </SelectTrigger>
            <SelectContent>
              {objectFitOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Width */}
        <div className="space-y-2">
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            type="text"
            value={data.style?.width || ''}
            onChange={(e) => onChange({
              style: { ...data.style, width: e.target.value }
            })}
            placeholder="auto, 100%, 200px..."
          />
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            type="text"
            value={data.style?.height || ''}
            onChange={(e) => onChange({
              style: { ...data.style, height: e.target.value }
            })}
            placeholder="auto, 100%, 200px..."
          />
        </div>

        {/* Border Radius */}
        <div className="space-y-2">
          <Label htmlFor="border-radius">Border Radius</Label>
          <Input
            id="border-radius"
            type="text"
            value={data.style?.borderRadius || ''}
            onChange={(e) => onChange({
              style: { ...data.style, borderRadius: e.target.value }
            })}
            placeholder="0px, 8px, 50%..."
          />
        </div>

        {/* Optimization Options (if current image is found) */}
        {currentImage && (
          <>
            <div className="space-y-2">
              <Label>Image Quality</Label>
              <Slider
                defaultValue={[80]}
                min={1}
                max={100}
                step={1}
                onValueCommit={([value]) => {
                  handleOptimizationChange({
                    quality: value,
                    format: 'auto',
                    compression: 'medium'
                  });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <Select
                onValueChange={(format) => {
                  handleOptimizationChange({
                    quality: 80,
                    format: format as any,
                    compression: 'medium'
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (Recommended)</SelectItem>
                  <SelectItem value="jpg">JPG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Replace Image Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            // TODO: Open image library modal for image replacement
          }}
        >
          Replace Image
        </Button>
      </CardContent>
    </Card>
  );
};

export default ImagePropertiesPanel;