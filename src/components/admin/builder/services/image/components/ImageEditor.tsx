import React, { useState, useCallback } from 'react';
import { useImageStore } from '../store';
import { ImageMetadata, ImageOptimizationSettings } from '../types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { PresetManager } from './PresetManager';
import { TransformationHistory } from './TransformationHistory';

interface ImageEditorProps {
  image: ImageMetadata;
  onSave?: (image: ImageMetadata) => void;
  className?: string;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  image,
  onSave,
  className
}) => {
  const { optimizeImage, selectedPreset, applyPreset } = useImageStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState<ImageOptimizationSettings>({
    quality: image.optimizationSettings?.quality || 80,
    format: image.optimizationSettings?.format || 'auto',
    compression: image.optimizationSettings?.compression || 'medium',
    resize: image.optimizationSettings?.resize || {
      width: undefined,
      height: undefined,
      fit: 'cover'
    }
  });

  const handleOptimize = useCallback(async () => {
    setIsProcessing(true);
    try {
      let optimizedImage;
      if (selectedPreset) {
        optimizedImage = await applyPreset(image.id, selectedPreset.id);
      } else {
        optimizedImage = await optimizeImage(image.id, settings);
      }
      onSave?.(optimizedImage);
    } catch (error) {
      console.error('Failed to optimize image:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [image.id, settings, optimizeImage, onSave, selectedPreset, applyPreset]);

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-6">
        {/* Preview */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-6">
          <img
            src={image.url}
            alt={image.altText || image.name}
            className="w-full h-full object-contain"
          />
        </div>

        <Tabs defaultValue="manual" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            {/* Format */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select
                value={settings.format}
                onValueChange={(value) => setSettings({ ...settings, format: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (Recommended)</SelectItem>
                  <SelectItem value="jpg">JPG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                  <SelectItem value="avif">AVIF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quality Slider */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quality ({settings.quality}%)</label>
              <Slider
                value={[settings.quality]}
                min={1}
                max={100}
                step={1}
                onValueChange={([value]) => setSettings({ ...settings, quality: value })}
              />
            </div>

            {/* Compression Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Compression</label>
              <Select
                value={settings.compression}
                onValueChange={(value) => setSettings({ ...settings, compression: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select compression level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resize Settings */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Resize</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs">Width</label>
                  <input
                    type="number"
                    value={settings.resize?.width || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      resize: {
                        ...settings.resize,
                        width: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    })}
                    placeholder="Auto"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs">Height</label>
                  <input
                    type="number"
                    value={settings.resize?.height || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      resize: {
                        ...settings.resize,
                        height: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    })}
                    placeholder="Auto"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <Select
                value={settings.resize?.fit || 'cover'}
                onValueChange={(value) => setSettings({
                  ...settings,
                  resize: {
                    ...settings.resize,
                    fit: value as any
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fit mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">Cover</SelectItem>
                  <SelectItem value="contain">Contain</SelectItem>
                  <SelectItem value="fill">Fill</SelectItem>
                  <SelectItem value="inside">Inside</SelectItem>
                  <SelectItem value="outside">Outside</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="presets">
            <PresetManager
              onPresetSelect={() => {
                // Preset selection is handled by the store
                handleOptimize();
              }}
            />
          </TabsContent>

          <TabsContent value="history">
            <TransformationHistory imageId={image.id} />
          </TabsContent>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="default"
              onClick={handleOptimize}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Apply Changes'}
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ImageEditor;