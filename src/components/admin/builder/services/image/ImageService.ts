import { v4 as uuidv4 } from 'uuid';
import { 
  ImageMetadata, 
  ImageOptimizationSettings, 
  StockImageProvider, 
  UploadProgress
} from './types';
import { CloudinaryConfig, StockImageConfig } from '../../../../../config/api';

export class ImageService {
  private cloudinaryConfig: CloudinaryConfig;
  private stockConfig: StockImageConfig;
  private onProgressCallback?: (progress: UploadProgress) => void;

  constructor(onProgress?: (progress: UploadProgress) => void) {
    const { getCloudinaryConfig, getStockImageConfig } = require('../../../../../config/api');
    this.cloudinaryConfig = getCloudinaryConfig();
    this.stockConfig = getStockImageConfig();
    this.onProgressCallback = onProgress;
  }

  private getOptimizationParams(settings: ImageOptimizationSettings): URLSearchParams {
    const params = new URLSearchParams();
    params.append('quality', settings.quality.toString());
    
    if (settings.format !== 'auto') {
      params.append('format', settings.format);
    }
    
    if (settings.resize) {
      if (settings.resize.width) params.append('width', settings.resize.width.toString());
      if (settings.resize.height) params.append('height', settings.resize.height.toString());
      params.append('fit', settings.resize.fit);
    }

    if (settings.effects) {
      if (settings.effects.blur) params.append('blur', settings.effects.blur.toString());
      if (settings.effects.brightness) params.append('brightness', settings.effects.brightness.toString());
      if (settings.effects.contrast) params.append('contrast', settings.effects.contrast.toString());
      if (settings.effects.saturation) params.append('saturation', settings.effects.saturation.toString());
    }
    
    return params;
  }

  private getAuthHeaders(): Headers {
    const headers = new Headers();
    headers.append('Authorization', 
      `Basic ${btoa(`${this.cloudinaryConfig.apiKey}:${this.cloudinaryConfig.apiSecret}`)}`
    );
    return headers;
  }

  async uploadImage(file: File, options?: ImageOptimizationSettings): Promise<ImageMetadata> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.cloudinaryConfig.uploadPreset);

    if (options) {
      const params = this.getOptimizationParams(options);
      formData.append('transformation', params.toString());
    }

    const uploadId = uuidv4();
    this.updateProgress({ 
      id: uploadId,
      progress: 0, 
      status: 'uploading' 
    });

    try {
      const response = await fetch(this.cloudinaryConfig.url, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      this.updateProgress({ 
        id: uploadId,
        progress: 100, 
        status: 'complete' 
      });

      return {
        id: data.public_id,
        publicId: data.public_id,
        name: file.name,
        url: data.secure_url,
        thumbnailUrl: data.secure_url.replace('/upload/', '/upload/w_200,h_200,c_fit/'),
        width: data.width,
        height: data.height,
        size: data.bytes,
        format: data.format,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        optimizationSettings: options
      };
    } catch (error) {
      this.updateProgress({
        id: uploadId,
        progress: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async optimizeImage(id: string, settings: ImageOptimizationSettings): Promise<ImageMetadata> {
    const params = this.getOptimizationParams(settings);
    const optimizedUrl = `${this.cloudinaryConfig.url}/${id}?${params.toString()}`;

    try {
      const response = await fetch(optimizedUrl);
      if (!response.ok) throw new Error('Optimization failed');

      const data = await response.json();
      return {
        id: data.public_id,
        publicId: data.public_id,
        name: id,
        url: data.secure_url,
        thumbnailUrl: data.secure_url.replace('/upload/', '/upload/w_200,h_200,c_fit/'),
        width: data.width,
        height: data.height,
        size: data.bytes,
        format: data.format,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        optimizationSettings: settings
      };
    } catch (error) {
      throw new Error('Failed to optimize image');
    }
  }

  async updateMetadata(id: string, metadata: Partial<ImageMetadata>): Promise<void> {
    const url = `${this.cloudinaryConfig.url}/${id}/metadata`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadata)
      });

      if (!response.ok) {
        throw new Error('Failed to update metadata');
      }
    } catch (error) {
      throw new Error('Failed to update metadata');
    }
  }

  async searchStockImages(provider: StockImageProvider): Promise<ImageMetadata[]> {
    const apiUrl = provider.name === 'unsplash' 
      ? `https://api.unsplash.com/search/photos`
      : `https://api.pexels.com/v1/search`;

    try {
      const response = await fetch(`${apiUrl}?query=${provider.query}&page=${provider.page}&per_page=${provider.perPage}`, {
        headers: {
          'Authorization': provider.name === 'unsplash'
            ? `Client-ID ${this.stockConfig.unsplashKey}`
            : this.stockConfig.pexelsKey
        }
      });

      if (!response.ok) throw new Error('Failed to fetch stock images');

      const data = await response.json();
      return this.mapStockImagesToMetadata(data.results || data.photos, provider.name);
    } catch (error) {
      throw new Error('Failed to search stock images');
    }
  }

  private mapStockImagesToMetadata(images: any[], provider: 'unsplash' | 'pexels'): ImageMetadata[] {
    return images.map(img => ({
      id: img.id,
      publicId: img.id,
      name: provider === 'unsplash' ? img.alt_description : img.photographer,
      url: provider === 'unsplash' ? img.urls.regular : img.src.original,
      thumbnailUrl: provider === 'unsplash' ? img.urls.thumb : img.src.tiny,
      width: img.width,
      height: img.height,
      size: 0, // Stock images don't provide size information
      format: 'jpg',
      metadata: {},
      altText: provider === 'unsplash' ? img.alt_description : img.photographer,
      createdAt: new Date(img.created_at || Date.now()),
      updatedAt: new Date(img.created_at || Date.now())
    }));
  }

  private updateProgress(progress: UploadProgress): void {
    if (this.onProgressCallback) {
      this.onProgressCallback(progress);
    }
  }

  async deleteImage(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.cloudinaryConfig.url}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) throw new Error('Failed to delete image');
    } catch (error) {
      throw new Error('Failed to delete image');
    }
  }
}

export default ImageService;