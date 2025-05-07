interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  url: string;
  uploadPreset: string;
}

interface OpenAIConfig {
  apiKey: string;
}

interface StockImageConfig {
  unsplashKey: string;
  pexelsKey: string;
}

interface APIConfig {
  cloudinary: CloudinaryConfig;
  openai: OpenAIConfig;
  stockImages: StockImageConfig;
}

class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

function validateEnvVariable(name: string): string {
  const value = import.meta.env[name];
  if (!value) {
    throw new ConfigurationError(`Missing required environment variable: ${name}`);
  }
  return value;
}

function loadConfig(): APIConfig {
  try {
    const config: APIConfig = {
      cloudinary: {
        cloudName: validateEnvVariable('VITE_CLOUDINARY_CLOUD_NAME'),
        apiKey: validateEnvVariable('VITE_CLOUDINARY_API_KEY'),
        apiSecret: validateEnvVariable('VITE_CLOUDINARY_API_SECRET'),
        url: validateEnvVariable('VITE_CLOUDINARY_URL'),
        uploadPreset: validateEnvVariable('VITE_CLOUDINARY_UPLOAD_PRESET'),
      },
      openai: {
        apiKey: validateEnvVariable('VITE_OPENAI_API_KEY'),
      },
      stockImages: {
        unsplashKey: validateEnvVariable('VITE_UNSPLASH_ACCESS_KEY'),
        pexelsKey: validateEnvVariable('VITE_PEXELS_API_KEY'),
      },
    };

    return config;
  } catch (error) {
    if (error instanceof ConfigurationError) {
      throw error;
    }
    throw new ConfigurationError('Failed to load configuration: ' + error.message);
  }
}

const config = loadConfig();

export function getCloudinaryConfig(): CloudinaryConfig {
  return config.cloudinary;
}

export function getOpenAIConfig(): OpenAIConfig {
  return config.openai;
}

export function getStockImageConfig(): StockImageConfig {
  return config.stockImages;
}

export type { CloudinaryConfig, OpenAIConfig, StockImageConfig, APIConfig };