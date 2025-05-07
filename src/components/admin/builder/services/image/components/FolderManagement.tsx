import React from 'react';
import { useImageStore } from '../store';
import { Folder } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

export function FolderManagement() {
  const [newFolderName, setNewFolderName] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const { folders, createFolder, deleteFolder, selectedFolder, selectFolder } = useImageStore();

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await createFolder(newFolderName, selectedFolder?.id);
      setNewFolderName('');
      setIsOpen(false);
      toast({
        title: 'Success',
        description: 'Folder created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create folder',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteFolder = async (folder: Folder) => {
    if (!confirm('Are you sure you want to delete this folder?')) return;

    try {
      await deleteFolder(folder.id);
      if (selectedFolder?.id === folder.id) {
        selectFolder(undefined);
      }
      toast({
        title: 'Success',
        description: 'Folder deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete folder',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Folders</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">New Folder</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <Button onClick={handleCreateFolder}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-2">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer ${
              selectedFolder?.id === folder.id ? 'bg-gray-100' : ''
            }`}
            onClick={() => selectFolder(folder.id)}
          >
            <span>{folder.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFolder(folder);
              }}
            >
              Delete
            </Button>
          </div>
        ))}
        {folders.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No folders created yet
          </div>
        )}
      </div>
    </div>
  );
}

export default FolderManagement;