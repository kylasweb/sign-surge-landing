import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  ImageStore, 
  ImageMetadata, 
  ImageOptimizationSettings, 
  StockImageProvider, 
  UploadProgress, 
  Folder,
  Collection,
  TransformationPreset,
  TransformationHistory,
  BatchOperation
} from './types';
import ImageService from './ImageService';
import { defaultPresets } from './defaultPresets';

const imageService = new ImageService((progress) => {
  useImageStore.getState().updateUploadProgress(progress);
});

// Create presets from defaults with unique IDs and timestamps
const createInitialPresets = (): TransformationPreset[] => {
  return defaultPresets.map(preset => ({
    ...preset,
    id: `preset-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
};

export const useImageStore = create<ImageStore>()(
  persist(
    (set, get) => ({
      // State
      images: [],
      folders: [],
      collections: [],
      transformationPresets: createInitialPresets(),
      transformationHistory: [],
      selectedImage: undefined,
      selectedFolder: undefined,
      selectedCollection: undefined,
      selectedPreset: undefined,
      uploadProgress: {},
      batchOperations: {},
      isLoading: false,
      error: undefined,

      // Asset Management
      uploadImage: async (file: File, folderId?: string) => {
        set({ isLoading: true, error: undefined });
        try {
          const image = await imageService.uploadImage(file);
          set((state) => ({
            images: [...state.images, { ...image, folderId }],
            isLoading: false
          }));
          return image;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to upload image',
            isLoading: false
          });
          throw error;
        }
      },

      uploadImages: async (files: File[], folderId?: string) => {
        const batchId = `batch-${Date.now()}`;
        const operation: BatchOperation = {
          id: batchId,
          type: 'upload',
          items: [],
          progress: 0,
          status: 'uploading'
        };
    
        set((state) => ({
          batchOperations: { ...state.batchOperations, [batchId]: operation }
        }));
    
        try {
          const uploadPromises = files.map(async (file) => {
            const image = await imageService.uploadImage(file);
            set((state) => ({
              images: [...state.images, { ...image, folderId }],
            }));
            return image.id;
          });
    
          const uploadedIds = await Promise.all(uploadPromises);
          
          set((state) => ({
            batchOperations: {
              ...state.batchOperations,
              [batchId]: {
                ...operation,
                items: uploadedIds,
                progress: 100,
                status: 'complete'
              }
            }
          }));
    
          return batchId;
        } catch (error) {
          set((state) => ({
            batchOperations: {
              ...state.batchOperations,
              [batchId]: {
                ...operation,
                status: 'error',
                error: error instanceof Error ? error.message : 'Failed to upload images'
              }
            }
          }));
          throw error;
        }
      },

      deleteImage: async (id: string) => {
        set({ isLoading: true, error: undefined });
        try {
          await imageService.deleteImage(id);
          set((state) => ({
            images: state.images.filter((img) => img.id !== id),
            selectedImage: state.selectedImage?.id === id ? undefined : state.selectedImage,
            isLoading: false
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete image',
            isLoading: false
          });
          throw error;
        }
      },

      deleteImages: async (ids: string[]) => {
        const batchId = `batch-${Date.now()}`;
        const operation: BatchOperation = {
          id: batchId,
          type: 'delete',
          items: ids,
          progress: 0,
          status: 'processing'
        };
    
        set((state) => ({
          batchOperations: { ...state.batchOperations, [batchId]: operation }
        }));
    
        try {
          await Promise.all(ids.map(id => imageService.deleteImage(id)));
          set((state) => ({
            images: state.images.filter(img => !ids.includes(img.id)),
            selectedImage: state.selectedImage && ids.includes(state.selectedImage.id)
              ? undefined
              : state.selectedImage,
            batchOperations: {
              ...state.batchOperations,
              [batchId]: { ...operation, progress: 100, status: 'complete' }
            }
          }));
    
          return batchId;
        } catch (error) {
          set((state) => ({
            batchOperations: {
              ...state.batchOperations,
              [batchId]: {
                ...operation,
                status: 'error',
                error: error instanceof Error ? error.message : 'Failed to delete images'
              }
            }
          }));
          throw error;
        }
      },

      updateMetadata: async (id: string, metadata: Partial<ImageMetadata>) => {
        await imageService.updateMetadata(id, metadata);
        set((state) => ({
          images: state.images.map((img) =>
            img.id === id ? { ...img, ...metadata, updatedAt: new Date() } : img
          ),
          selectedImage: state.selectedImage?.id === id
            ? { ...state.selectedImage, ...metadata, updatedAt: new Date() }
            : state.selectedImage
        }));
      },

      // Organization
      createFolder: async (name: string, parentId?: string) => {
        const folder: Folder = {
          id: `folder-${Date.now()}`,
          name,
          parentId,
          path: parentId
            ? `${get().folders.find(f => f.id === parentId)?.path || ''}/${name}`
            : name,
          createdAt: new Date(),
          updatedAt: new Date()
        };
    
        set((state) => ({
          folders: [...state.folders, folder]
        }));
    
        return folder;
      },

      updateFolder: async (id: string, data: Partial<Folder>) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id
              ? { ...folder, ...data, updatedAt: new Date() }
              : folder
          )
        }));
      },

      deleteFolder: async (id: string) => {
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
          images: state.images.map((img) =>
            img.folderId === id ? { ...img, folderId: undefined } : img
          )
        }));
      },

      moveToFolder: async (assetIds: string[], folderId: string) => {
        set((state) => ({
          images: state.images.map((img) =>
            assetIds.includes(img.id) ? { ...img, folderId } : img
          )
        }));
      },

      // Collections
      createCollection: async (data: { name: string; description?: string }) => {
        const collection: Collection = {
          id: `collection-${Date.now()}`,
          name: data.name,
          description: data.description || '',
          assetIds: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
    
        set((state) => ({
          collections: [...state.collections, collection]
        }));
    
        return collection;
      },

      updateCollection: async (id: string, data: Partial<Collection>) => {
        set((state) => ({
          collections: state.collections.map((collection) =>
            collection.id === id
              ? { ...collection, ...data, updatedAt: new Date() }
              : collection
          )
        }));
      },

      deleteCollection: async (id: string) => {
        set((state) => ({
          collections: state.collections.filter((collection) => collection.id !== id)
        }));
      },

      addToCollection: async (collectionId: string, assetIds: string[]) => {
        set((state) => ({
          collections: state.collections.map((collection) =>
            collection.id === collectionId
              ? {
                  ...collection,
                  assetIds: [...new Set([...collection.assetIds, ...assetIds])],
                  updatedAt: new Date()
                }
              : collection
          )
        }));
      },

      removeFromCollection: async (collectionId: string, assetIds: string[]) => {
        set((state) => ({
          collections: state.collections.map((collection) =>
            collection.id === collectionId
              ? {
                  ...collection,
                  assetIds: collection.assetIds.filter(id => !assetIds.includes(id)),
                  updatedAt: new Date()
                }
              : collection
          )
        }));
      },

      // Transformations
      optimizeImage: async (id: string, settings: ImageOptimizationSettings) => {
        set({ isLoading: true, error: undefined });
        try {
          const optimizedImage = await imageService.optimizeImage(id, settings);
          
          const historyEntry: TransformationHistory = {
            id: `transform-${Date.now()}`,
            presetId: 'custom',
            assetId: id,
            settings,
            resultUrl: optimizedImage.url,
            createdAt: new Date()
          };

          set((state) => ({
            images: state.images.map((img) => 
              img.id === optimizedImage.id ? optimizedImage : img
            ),
            transformationHistory: [...state.transformationHistory, historyEntry],
            isLoading: false
          }));
          return optimizedImage;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to optimize image',
            isLoading: false
          });
          throw error;
        }
      },

      batchTransform: async (ids: string[], settings: ImageOptimizationSettings) => {
        const batchId = `batch-${Date.now()}`;
        const operation: BatchOperation = {
          id: batchId,
          type: 'transform',
          items: ids,
          progress: 0,
          status: 'processing'
        };
    
        set((state) => ({
          batchOperations: { ...state.batchOperations, [batchId]: operation }
        }));
    
        try {
          const transformPromises = ids.map(async (id) => {
            const optimizedImage = await imageService.optimizeImage(id, settings);
            set((state) => ({
              images: state.images.map((img) =>
                img.id === optimizedImage.id ? optimizedImage : img
              )
            }));
            return optimizedImage.id;
          });
    
          await Promise.all(transformPromises);
    
          set((state) => ({
            batchOperations: {
              ...state.batchOperations,
              [batchId]: { ...operation, progress: 100, status: 'complete' }
            }
          }));
    
          return batchId;
        } catch (error) {
          set((state) => ({
            batchOperations: {
              ...state.batchOperations,
              [batchId]: {
                ...operation,
                status: 'error',
                error: error instanceof Error ? error.message : 'Failed to transform images'
              }
            }
          }));
          throw error;
        }
      },

      createTransformationPreset: async (preset: Omit<TransformationPreset, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newPreset: TransformationPreset = {
          ...preset,
          id: `preset-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
    
        set((state) => ({
          transformationPresets: [...state.transformationPresets, newPreset]
        }));
    
        return newPreset;
      },

      updateTransformationPreset: async (id: string, data: Partial<TransformationPreset>) => {
        set((state) => ({
          transformationPresets: state.transformationPresets.map((preset) =>
            preset.id === id
              ? { ...preset, ...data, updatedAt: new Date() }
              : preset
          )
        }));
      },

      deleteTransformationPreset: async (id: string) => {
        set((state) => ({
          transformationPresets: state.transformationPresets.filter(preset => preset.id !== id),
          selectedPreset: state.selectedPreset?.id === id ? undefined : state.selectedPreset
        }));
      },

      applyPreset: async (imageId: string, presetId: string) => {
        const preset = get().transformationPresets.find(p => p.id === presetId);
        if (!preset) {
          throw new Error('Preset not found');
        }
    
        const optimizedImage = await get().optimizeImage(imageId, preset.settings);
        
        const historyEntry: TransformationHistory = {
          id: `transform-${Date.now()}`,
          presetId,
          assetId: imageId,
          settings: preset.settings,
          resultUrl: optimizedImage.url,
          createdAt: new Date()
        };
    
        set((state) => ({
          transformationHistory: [...state.transformationHistory, historyEntry]
        }));
    
        return optimizedImage;
      },

      // Search
      searchStockImages: async (provider: StockImageProvider) => {
        set({ isLoading: true, error: undefined });
        try {
          const images = await imageService.searchStockImages(provider);
          set({ isLoading: false });
          return images;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to search stock images',
            isLoading: false
          });
          throw error;
        }
      },

      searchAssets: async (query: string) => {
        const searchTerms = query.toLowerCase().split(' ');
        const results = get().images.filter(image => 
          searchTerms.every(term =>
            image.name.toLowerCase().includes(term) ||
            image.tags?.some(tag => tag.toLowerCase().includes(term)) ||
            image.altText?.toLowerCase().includes(term)
          )
        );
        return results;
      },

      // UI State
      selectImage: (id: string | undefined) => {
        set((state) => ({
          selectedImage: id ? state.images.find((img) => img.id === id) : undefined
        }));
      },

      selectFolder: (id: string | undefined) => {
        set((state) => ({
          selectedFolder: id ? state.folders.find((folder) => folder.id === id) : undefined
        }));
      },

      selectCollection: (id: string | undefined) => {
        set((state) => ({
          selectedCollection: id ? state.collections.find((collection) => collection.id === id) : undefined
        }));
      },

      selectPreset: (id: string | undefined) => {
        set((state) => ({
          selectedPreset: id ? state.transformationPresets.find((preset) => preset.id === id) : undefined
        }));
      },

      updateUploadProgress: (progress: UploadProgress) => {
        set((state) => ({
          uploadProgress: {
            ...state.uploadProgress,
            [progress.id]: progress
          }
        }));
      },

      updateBatchOperation: (operation: BatchOperation) => {
        set((state) => ({
          batchOperations: {
            ...state.batchOperations,
            [operation.id]: operation
          }
        }));
      }
    }),
    {
      name: 'image-store',
      partialize: (state) => ({
        images: state.images,
        folders: state.folders,
        collections: state.collections,
        transformationPresets: state.transformationPresets,
        transformationHistory: state.transformationHistory
      })
    }
  )
);

export default useImageStore;