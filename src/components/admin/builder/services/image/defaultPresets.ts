import { TransformationPreset } from './types';

export const defaultPresets: Omit<TransformationPreset, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Web Optimized (Recommended)',
    description: 'Best balance of quality and file size for web images',
    isDefault: true,
    settings: {
      quality: 85,
      format: 'webp',
      compression: 'medium',
      resize: {
        fit: 'cover'
      }
    }
  },
  {
    name: 'High Quality',
    description: 'Maximum quality with minimal compression',
    isDefault: false,
    settings: {
      quality: 100,
      format: 'auto',
      compression: 'low',
      resize: {
        fit: 'contain'
      }
    }
  },
  {
    name: 'Thumbnail',
    description: 'Optimized for thumbnail previews',
    isDefault: false,
    settings: {
      quality: 75,
      format: 'webp',
      compression: 'high',
      resize: {
        width: 200,
        height: 200,
        fit: 'cover'
      }
    }
  },
  {
    name: 'Social Media',
    description: 'Optimized for social media platforms',
    isDefault: false,
    settings: {
      quality: 90,
      format: 'jpg',
      compression: 'medium',
      resize: {
        width: 1200,
        height: 630,
        fit: 'cover'
      }
    }
  },
  {
    name: 'Blog Hero',
    description: 'Optimized for blog hero images',
    isDefault: false,
    settings: {
      quality: 90,
      format: 'webp',
      compression: 'medium',
      resize: {
        width: 1920,
        height: 1080,
        fit: 'cover'
      },
      effects: {
        brightness: 1.1,
        saturation: 1.1
      }
    }
  }
];