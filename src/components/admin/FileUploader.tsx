
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UploadIcon, ImageIcon } from "lucide-react";

interface FileUploaderProps {
  onFileUploaded: (fileUrl: string, fileName: string) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

const FileUploader = ({ 
  onFileUploaded,
  allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"],
  maxSizeMB = 5
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Please upload one of the following: ${allowedTypes.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // In a real implementation, this would upload to a server
    // For this demo, we'll just create a local URL
    setTimeout(() => {
      const fileUrl = URL.createObjectURL(file);
      onFileUploaded(fileUrl, file.name);
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully`,
      });
      
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center space-y-4">
        <div className="mx-auto bg-gray-100 rounded-full p-3 w-12 h-12 flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-gray-500" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {isDragging ? "Drop your file here" : "Drag & drop your file here"}
          </p>
          <p className="text-xs text-gray-500">
            Supports {allowedTypes.map(type => type.split('/')[1]).join(', ')} (Max: {maxSizeMB}MB)
          </p>
        </div>
        <div className="flex justify-center">
          <label className="cursor-pointer">
            <Input 
              type="file"
              className="hidden"
              onChange={handleFileInput}
              accept={allowedTypes.join(',')}
              disabled={isUploading}
            />
            <Button 
              type="button" 
              variant="outline" 
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              <UploadIcon className="w-4 h-4" />
              {isUploading ? "Uploading..." : "Browse files"}
            </Button>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
