import React from 'react';
import { useImageStore } from '../store';
import { StockImageProvider } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';

interface StockImageBrowserProps {
  onSelect?: () => void;
  className?: string;
}

export const StockImageBrowser: React.FC<StockImageBrowserProps> = ({
  onSelect,
  className
}) => {
  const { searchStockImages, uploadImage } = useImageStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [provider, setProvider] = React.useState<'unsplash' | 'pexels'>('unsplash');
  const [page, setPage] = React.useState(1);
  const [perPage] = React.useState(20);
  const [results, setResults] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const searchConfig: StockImageProvider = {
        name: provider,
        query: searchQuery,
        page,
        perPage
      };

      const images = await searchStockImages(searchConfig);
      setResults(images);
    } catch (err) {
      setError('Failed to fetch stock images');
      toast({
        title: 'Error',
        description: 'Failed to fetch stock images',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (imageUrl: string, altText: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'stock-image.jpg', { type: 'image/jpeg' });
      
      const uploadedImage = await uploadImage(file);
      await fetch(uploadedImage.url); // Ensure the image is processed before proceeding
      
      toast({
        title: 'Success',
        description: 'Stock image imported successfully',
      });
      
      onSelect?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to import stock image',
        variant: 'destructive',
      });
    }
  };

  React.useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, [page, provider]); // Trigger search when page or provider changes

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Search Controls */}
        <div className="flex gap-2">
          <Select
            value={provider}
            onValueChange={(value: 'unsplash' | 'pexels') => setProvider(value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unsplash">Unsplash</SelectItem>
              <SelectItem value="pexels">Pexels</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Search stock images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Results Grid */}
        <ScrollArea className="h-[400px]">
          {error ? (
            <div className="text-center text-destructive py-8">{error}</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {results.map((image) => (
                <div key={image.id} className="group relative">
                  <img
                    src={image.thumbnailUrl}
                    alt={image.altText || image.name}
                    className="w-full aspect-square object-cover rounded"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleImport(image.url, image.altText || image.name)}
                    >
                      Import
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Pagination */}
        {results.length > 0 && (
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              disabled={page === 1 || isLoading}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span>Page {page}</span>
            <Button
              variant="outline"
              disabled={results.length < perPage || isLoading}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockImageBrowser;