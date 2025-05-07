import React from 'react';
import { useImageStore } from '../store';
import { ImageMetadata } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import FolderManagement from './FolderManagement';
import CollectionManagement from './CollectionManagement';
import BatchOperations from './BatchOperations';
import ImagePropertiesPanel from './ImagePropertiesPanel';
import ImageEditor from './ImageEditor';
import StockImageBrowser from './StockImageBrowser';

export function ImageLibrary() {
  const { 
    images,
    selectedImage,
    selectedFolder,
    selectedCollection,
    searchAssets,
    updateMetadata,
  } = useImageStore();
  
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredImages, setFilteredImages] = React.useState<ImageMetadata[]>(images);
  const [view, setView] = React.useState<'grid' | 'list'>('grid');

  // For ImagePropertiesPanel
  const [componentData, setComponentData] = React.useState({
    src: selectedImage?.url || '',
    alt: selectedImage?.altText || '',
    style: {}
  });

  React.useEffect(() => {
    if (selectedImage) {
      setComponentData({
        src: selectedImage.url,
        alt: selectedImage.altText || '',
        style: {}
      });
    }
  }, [selectedImage]);

  React.useEffect(() => {
    const filterImages = async () => {
      if (searchQuery.trim()) {
        const results = await searchAssets(searchQuery);
        setFilteredImages(results);
      } else {
        // Filter based on selected folder/collection
        let filtered = images;
        if (selectedFolder) {
          filtered = filtered.filter(img => img.folderId === selectedFolder.id);
        }
        if (selectedCollection) {
          filtered = filtered.filter(img => selectedCollection.assetIds.includes(img.id));
        }
        setFilteredImages(filtered);
      }
    };
    filterImages();
  }, [searchQuery, images, selectedFolder, selectedCollection]);

  const handleUpdateComponentData = async (data: any) => {
    if (!selectedImage) return;
    
    // Update component data locally
    setComponentData(prev => ({ ...prev, ...data }));

    // Update image metadata if necessary
    if (data.alt !== undefined && data.alt !== selectedImage.altText) {
      await updateMetadata(selectedImage.id, { altText: data.alt });
    }
  };

  const handleImageSave = async (updatedImage: ImageMetadata) => {
    setComponentData({
      src: updatedImage.url,
      alt: updatedImage.altText || '',
      style: componentData.style
    });
  };

  return (
    <div className="h-full flex">
      {/* Left Sidebar - Organization */}
      <div className="w-64 border-r p-4">
        <Tabs defaultValue="folders">
          <TabsList className="w-full">
            <TabsTrigger value="folders">Folders</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>
          <TabsContent value="folders">
            <FolderManagement />
          </TabsContent>
          <TabsContent value="collections">
            <CollectionManagement />
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
            >
              {view === 'grid' ? 'List View' : 'Grid View'}
            </Button>
          </div>
          <BatchOperations />
        </div>

        {/* Image Grid/List */}
        <ScrollArea className="flex-1">
          <div className={`p-4 ${
            view === 'grid' 
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
              : 'space-y-2'
          }`}>
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className={`group relative ${
                  view === 'grid'
                    ? 'aspect-square'
                    : 'flex items-center gap-4 p-2 hover:bg-gray-50 rounded'
                }`}
              >
                <img
                  src={view === 'grid' ? image.thumbnailUrl : image.url}
                  alt={image.altText || image.name}
                  className={
                    view === 'grid'
                      ? 'w-full h-full object-cover rounded'
                      : 'w-16 h-16 object-cover rounded'
                  }
                />
                <div className={
                  view === 'grid'
                    ? 'absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2'
                    : 'flex-1'
                }>
                  {view === 'list' && (
                    <div>
                      <h3 className="font-medium">{image.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(image.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <Button
                    variant={view === 'grid' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => {/* Handle edit */}}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
            {filteredImages.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No images found
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Sidebar - Properties & Tools */}
      <div className="w-80 border-l">
        <Tabs defaultValue="properties">
          <TabsList className="w-full">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
          </TabsList>
          <TabsContent value="properties" className="p-4">
            {selectedImage ? (
              <ImagePropertiesPanel
                componentId={selectedImage.id}
                data={componentData}
                onChange={handleUpdateComponentData}
              />
            ) : (
              <div className="text-center text-gray-500 py-4">
                Select an image to view properties
              </div>
            )}
          </TabsContent>
          <TabsContent value="edit" className="p-4">
            {selectedImage ? (
              <ImageEditor
                image={selectedImage}
                onSave={handleImageSave}
              />
            ) : (
              <div className="text-center text-gray-500 py-4">
                Select an image to edit
              </div>
            )}
          </TabsContent>
          <TabsContent value="stock" className="p-4">
            <StockImageBrowser />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ImageLibrary;