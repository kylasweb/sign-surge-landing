// Existing imports...

export interface ImageMetadata {
  id: string;
  publicId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number;
  format: string;
  altText?: string;
  tags?: string[];
  folderId?: string;
  collectionIds?: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  optimizationSettings?: ImageOptimizationSettings;
}

export interface ImageOptimizationSettings {
  quality: number;
  format: 'auto' | 'jpg' | 'png' | 'webp' | 'avif';
  resize?: {
    width?: number;
    height?: number;
    fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  };
  compression: 'low' | 'medium' | 'high';
  effects?: {
    blur?: number;
    brightness?: number;
    contrast?: number;
    saturation?: number;
  };
}

export interface TransformationPreset {
  id: string;
  name: string;
  description: string;
  settings: ImageOptimizationSettings;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransformationHistory {
  id: string;
  presetId: string;
  assetId: string;
  settings: ImageOptimizationSettings;
  resultUrl: string;
  createdAt: Date;
}

export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'complete' | 'error';

export interface UploadProgress {
  id: string;
  progress: number;
  status: UploadStatus;
  error?: string;
}

export interface BatchOperation {
  id: string;
  type: 'upload' | 'transform' | 'delete' | 'move';
  items: string[];
  progress: number;
  status: UploadStatus;
  error?: string;
}

export interface StockImageProvider {
  name: 'unsplash' | 'pexels';
  query: string;
  page: number;
  perPage: number;
}

export interface ImageState {
  images: ImageMetadata[];
  folders: Folder[];
  collections: Collection[];
  transformationPresets: TransformationPreset[];
  transformationHistory: TransformationHistory[];
  selectedImage?: ImageMetadata;
  selectedFolder?: Folder;
  selectedCollection?: Collection;
  selectedPreset?: TransformationPreset;
  uploadProgress: Record<string, UploadProgress>;
  batchOperations: Record<string, BatchOperation>;
  isLoading: boolean;
  error?: string;
}

export interface ImageActions {
  // Asset Management
  uploadImage: (file: File, folderId?: string) => Promise<ImageMetadata>;
  uploadImages: (files: File[], folderId?: string) => Promise<string>; // Returns batch operation ID
  deleteImage: (id: string) => Promise<void>;
  deleteImages: (ids: string[]) => Promise<string>; // Returns batch operation ID
  updateMetadata: (id: string, metadata: Partial<ImageMetadata>) => Promise<void>;
  
  // Organization
  createFolder: (name: string, parentId?: string) => Promise<Folder>;
  updateFolder: (id: string, data: Partial<Folder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  moveToFolder: (assetIds: string[], folderId: string) => Promise<void>;
  
  // Collections
  createCollection: (data: { name: string; description?: string }) => Promise<Collection>;
  updateCollection: (id: string, data: Partial<Collection>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  addToCollection: (collectionId: string, assetIds: string[]) => Promise<void>;
  removeFromCollection: (collectionId: string, assetIds: string[]) => Promise<void>;
  
  // Transformations
  optimizeImage: (id: string, settings: ImageOptimizationSettings) => Promise<ImageMetadata>;
  batchTransform: (ids: string[], settings: ImageOptimizationSettings) => Promise<string>; // Returns batch operation ID
  createTransformationPreset: (preset: Omit<TransformationPreset, 'id' | 'createdAt' | 'updatedAt'>) => Promise<TransformationPreset>;
  updateTransformationPreset: (id: string, data: Partial<TransformationPreset>) => Promise<void>;
  deleteTransformationPreset: (id: string) => Promise<void>;
  applyPreset: (imageId: string, presetId: string) => Promise<ImageMetadata>;
  
  // Search & Stock Images
  searchStockImages: (provider: StockImageProvider) => Promise<ImageMetadata[]>;
  searchAssets: (query: string) => Promise<ImageMetadata[]>;
  
  // UI State
  selectImage: (id: string | undefined) => void;
  selectFolder: (id: string | undefined) => void;
  selectCollection: (id: string | undefined) => void;
  selectPreset: (id: string | undefined) => void;
  updateUploadProgress: (progress: UploadProgress) => void;
  updateBatchOperation: (operation: BatchOperation) => void;
}

export type ImageStore = ImageState & ImageActions;

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  assetIds: string[];
  createdAt: Date;
  updatedAt: Date;
}