import React from 'react';
import { useImageStore } from '../store';
import { TransformationPreset, ImageOptimizationSettings } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';

interface PresetFormData {
  name: string;
  description: string;
  settings: ImageOptimizationSettings;
  isDefault: boolean;
}

interface PresetManagerProps {
  onPresetSelect?: (preset: TransformationPreset) => void;
  className?: string;
}

export const PresetManager: React.FC<PresetManagerProps> = ({
  onPresetSelect,
  className
}) => {
  const { 
    transformationPresets,
    createTransformationPreset,
    updateTransformationPreset,
    deleteTransformationPreset,
    selectedPreset,
    selectPreset
  } = useImageStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<PresetFormData>({
    name: '',
    description: '',
    isDefault: false,
    settings: {
      quality: 80,
      format: 'auto',
      compression: 'medium',
      resize: {
        fit: 'cover'
      },
      effects: {}
    }
  });

  const handleCreatePreset = async () => {
    if (!formData.name) {
      toast({
        title: 'Error',
        description: 'Please enter a preset name',
        variant: 'destructive',
      });
      return;
    }

    try {
      const preset = await createTransformationPreset(formData);
      setIsCreateDialogOpen(false);
      setFormData({
        name: '',
        description: '',
        isDefault: false,
        settings: {
          quality: 80,
          format: 'auto',
          compression: 'medium',
          resize: {
            fit: 'cover'
          },
          effects: {}
        }
      });
      toast({
        title: 'Success',
        description: 'Preset created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create preset',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePreset = async (preset: TransformationPreset) => {
    if (!confirm('Are you sure you want to delete this preset?')) return;

    try {
      await deleteTransformationPreset(preset.id);
      toast({
        title: 'Success',
        description: 'Preset deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete preset',
        variant: 'destructive',
      });
    }
  };

  const handlePresetClick = (preset: TransformationPreset) => {
    selectPreset(preset.id);
    onPresetSelect?.(preset);
  };

  return (
    <div className={className}>
      {/* Create Preset Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">Create Preset</Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Transformation Preset</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Preset name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Quality</label>
                <Slider
                  value={[formData.settings.quality]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={([value]) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, quality: value }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Format</label>
                <Select
                  value={formData.settings.format}
                  onValueChange={(value: any) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, format: value }
                  }))}
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Compression</label>
                <Select
                  value={formData.settings.compression}
                  onValueChange={(value: any) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, compression: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select compression" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleCreatePreset}>Create Preset</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Presets List */}
      <div className="space-y-2">
        {transformationPresets.map((preset) => (
          <Card
            key={preset.id}
            className={`cursor-pointer transition-colors hover:bg-gray-50 ${
              selectedPreset?.id === preset.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handlePresetClick(preset)}
          >
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{preset.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {preset.description}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePreset(preset);
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-sm">
              <div className="flex flex-wrap gap-2">
                <span>Quality: {preset.settings.quality}%</span>
                <span>Format: {preset.settings.format}</span>
                <span>Compression: {preset.settings.compression}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {transformationPresets.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No presets created yet
          </div>
        )}
      </div>
    </div>
  );
};

export default PresetManager;