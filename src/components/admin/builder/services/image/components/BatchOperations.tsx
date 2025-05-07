import React from 'react';
import { useImageStore } from '../store';
import { BatchOperation, ImageOptimizationSettings } from '../types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function BatchOperations() {
  const { 
    batchOperations,
    uploadImages,
    deleteImages,
    batchTransform,
    selectedFolder,
    images,
    selectedImage
  } = useImageStore();

  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null);
  const [selectedImageIds, setSelectedImageIds] = React.useState<Set<string>>(new Set());

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const handleBatchUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select files to upload',
        variant: 'destructive',
      });
      return;
    }

    try {
      const batchId = await uploadImages(Array.from(selectedFiles), selectedFolder?.id);
      toast({
        title: 'Success',
        description: 'Batch upload started',
      });
      setSelectedFiles(null);
      // Reset file input
      const fileInput = document.getElementById('batch-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start batch upload',
        variant: 'destructive',
      });
    }
  };

  const handleBatchDelete = async () => {
    if (selectedImageIds.size === 0) {
      toast({
        title: 'Error',
        description: 'Please select images to delete',
        variant: 'destructive',
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedImageIds.size} images?`)) {
      return;
    }

    try {
      const batchId = await deleteImages(Array.from(selectedImageIds));
      toast({
        title: 'Success',
        description: 'Batch deletion started',
      });
      setSelectedImageIds(new Set());
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start batch deletion',
        variant: 'destructive',
      });
    }
  };

  const handleBatchTransform = async () => {
    if (selectedImageIds.size === 0) {
      toast({
        title: 'Error',
        description: 'Please select images to transform',
        variant: 'destructive',
      });
      return;
    }

    // Example transformation settings - in a real app, these would come from a form
    const settings: ImageOptimizationSettings = {
      quality: 80,
      format: 'webp',
      compression: 'medium',
    };

    try {
      const batchId = await batchTransform(Array.from(selectedImageIds), settings);
      toast({
        title: 'Success',
        description: 'Batch transformation started',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start batch transformation',
        variant: 'destructive',
      });
    }
  };

  const toggleImageSelection = (imageId: string) => {
    const newSelection = new Set(selectedImageIds);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImageIds(newSelection);
  };

  const getOperationTypeLabel = (type: BatchOperation['type']) => {
    switch (type) {
      case 'upload': return 'Uploading images';
      case 'delete': return 'Deleting images';
      case 'transform': return 'Transforming images';
      case 'move': return 'Moving images';
      default: return 'Processing';
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg space-y-4">
        <div>
          <h3 className="font-medium mb-2">Batch Upload</h3>
          <div className="flex gap-2">
            <input
              id="batch-file-input"
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('batch-file-input')?.click()}
            >
              Select Files
            </Button>
            <Button
              onClick={handleBatchUpload}
              disabled={!selectedFiles || selectedFiles.length === 0}
            >
              Upload {selectedFiles ? `(${selectedFiles.length})` : ''}
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Batch Actions</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleBatchDelete}
              disabled={selectedImageIds.size === 0}
            >
              Delete Selected ({selectedImageIds.size})
            </Button>
            <Button
              variant="outline"
              onClick={handleBatchTransform}
              disabled={selectedImageIds.size === 0}
            >
              Transform Selected ({selectedImageIds.size})
            </Button>
          </div>
        </div>
      </div>

      {Object.values(batchOperations).length > 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="batch-operations">
            <AccordionTrigger>Batch Operations</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {Object.values(batchOperations).map((operation) => (
                  <Card key={operation.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">
                        {getOperationTypeLabel(operation.type)}
                      </CardTitle>
                      <CardDescription>
                        {operation.items.length} items
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={operation.progress} />
                      {operation.error && (
                        <p className="text-sm text-destructive mt-1">
                          {operation.error}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}

export default BatchOperations;