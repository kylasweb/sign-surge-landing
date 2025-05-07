import React from 'react';
import { useImageStore } from '../store';
import { Collection } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface CollectionFormData {
  name: string;
  description: string;
}

export function CollectionManagement() {
  const [formData, setFormData] = React.useState<CollectionFormData>({
    name: '',
    description: '',
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const { 
    collections, 
    createCollection, 
    deleteCollection, 
    updateCollection,
    addToCollection,
    removeFromCollection,
    selectedCollection,
    selectCollection,
    selectedImage,
  } = useImageStore();

  const handleCreateCollection = async () => {
    if (!formData.name.trim()) return;

    try {
      await createCollection({
        name: formData.name,
        description: formData.description,
      });
      setFormData({ name: '', description: '' });
      setIsOpen(false);
      toast({
        title: 'Success',
        description: 'Collection created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create collection',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCollection = async (collection: Collection) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;

    try {
      await deleteCollection(collection.id);
      if (selectedCollection?.id === collection.id) {
        selectCollection(undefined);
      }
      toast({
        title: 'Success',
        description: 'Collection deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete collection',
        variant: 'destructive',
      });
    }
  };

  const handleAddToCollection = async (collection: Collection) => {
    if (!selectedImage) return;

    try {
      await addToCollection(collection.id, [selectedImage.id]);
      toast({
        title: 'Success',
        description: 'Image added to collection',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add image to collection',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveFromCollection = async (collection: Collection, imageId: string) => {
    try {
      await removeFromCollection(collection.id, [imageId]);
      toast({
        title: 'Success',
        description: 'Image removed from collection',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove image from collection',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Collections</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">New Collection</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Collection name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
              <Textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
              <Button onClick={handleCreateCollection}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-4">
        {collections.map((collection) => (
          <Card 
            key={collection.id}
            className={`cursor-pointer ${
              selectedCollection?.id === collection.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => selectCollection(collection.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{collection.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {collection.assetIds.length} images
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {selectedImage && !collection.assetIds.includes(selectedImage.id) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCollection(collection);
                      }}
                    >
                      Add Selected
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCollection(collection);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            {collection.assetIds.length > 0 && (
              <CardContent className="pt-2">
                <div className="flex flex-wrap gap-2">
                  {collection.assetIds.map((imageId) => (
                    <Button
                      key={imageId}
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromCollection(collection, imageId);
                      }}
                    >
                      Remove
                    </Button>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
        {collections.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No collections created yet
          </div>
        )}
      </div>
    </div>
  );
}

export default CollectionManagement;