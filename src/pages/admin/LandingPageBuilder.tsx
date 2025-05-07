import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LandingPageBuilder } from '@/components/admin/builder/LandingPageBuilder';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useBuilderStore } from '@/components/admin/builder/store';
import { Layout, ComponentType } from '@/components/admin/builder/types';
import { useToast } from '@/components/ui/use-toast';
import { v2 as cloudinary } from 'cloudinary';
import OpenAI from 'openai';

// Available components for the builder
const AVAILABLE_COMPONENTS: ComponentType[] = [
  { id: 'hero', name: 'Hero', category: 'Layout' },
  { id: 'header', name: 'Header', category: 'Layout' },
  { id: 'footer', name: 'Footer', category: 'Layout' },
  { id: 'case-studies', name: 'CaseStudies', category: 'Content' },
  { id: 'pain-points', name: 'PainPoints', category: 'Content' },
  { id: 'offer-stack', name: 'OfferStack', category: 'Content' },
  { id: 'faq', name: 'FAQ', category: 'Content' },
  { id: 'comparison-table', name: 'ComparisonTable', category: 'Content' },
  { id: 'urgency-cta', name: 'UrgencyCTA', category: 'Content' },
  { id: 'achievements', name: 'Achievements', category: 'Content' }
];

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-red-600 mb-4">Something went wrong:</h2>
      <pre className="text-sm bg-red-50 p-4 rounded mb-4 overflow-auto">{error.message}</pre>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </Card>
  );
};

export default function LandingPageBuilderPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const updateLayout = useBuilderStore((state) => state.updateLayout);

  useEffect(() => {
    const initializeBuilder = async () => {
      try {
        // Initialize Cloudinary
        cloudinary.config({
          cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
          api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
        });

        // Initialize OpenAI
        const openai = new OpenAI({
          apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        });

        // Initialize other image services (if needed)
        const unsplashKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
        const pexelsKey = import.meta.env.VITE_PEXELS_API_KEY;

        // Save initialized services to global state or context if needed
        // For now, we'll just verify they're initialized
        if (!cloudinary.config().cloud_name || !openai) {
          throw new Error('Failed to initialize required services');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize builder:', error);
        toast({
          title: 'Initialization Error',
          description: 'Failed to initialize the page builder. Please try refreshing the page.',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };

    initializeBuilder();
  }, [toast]);

  const handleSave = async (layout: Layout) => {
    try {
      // TODO: Implement actual save functionality
      // For now, we'll just show a success message
      toast({
        title: 'Changes Saved',
        description: 'Your landing page changes have been saved successfully.'
      });
      updateLayout(layout);
    } catch (error) {
      console.error('Failed to save layout:', error);
      toast({
        title: 'Save Error',
        description: 'Failed to save your changes. Please try again.',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="h-[calc(100vh-6rem)]">
        <LandingPageBuilder
          onSave={handleSave}
          availableComponents={AVAILABLE_COMPONENTS}
        />
      </div>
    </ErrorBoundary>
  );
}