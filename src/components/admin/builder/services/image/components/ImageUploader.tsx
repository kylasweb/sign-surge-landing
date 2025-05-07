import React from 'react';
import { useImageStore } from '../store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';

interface ImageUploaderProps {
  onUploadComplete?: () => void;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadComplete,
  className
}) => {
  const { uploadImage, uploadProgress } = useImageStore();
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          toast({
            title: 'Invalid file type',
            description: 'Please select image files only',
            variant: 'destructive',
          });
          continue;
        }

        await uploadImage(file);
      }
      
      onUploadComplete?.();
      toast({
        title: 'Success',
        description: 'Images uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        variant: 'destructive',
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const activeUploads = Object.values(uploadProgress).filter(
    progress => progress.status === 'uploading' || progress.status === 'processing'
  );

  return (
    <div className={className}>
      {/* Upload Progress */}
      {activeUploads.length > 0 && (
        <div className="space-y-2 mb-4">
          {activeUploads.map((progress) => (
            <div key={progress.id} className="space-y-1">
              <div className="text-sm">Uploading...</div>
              <Progress value={progress.progress} />
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center
          ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'}
          transition-colors duration-200
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Drag and drop your images here, or click to select files
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Select Files
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;