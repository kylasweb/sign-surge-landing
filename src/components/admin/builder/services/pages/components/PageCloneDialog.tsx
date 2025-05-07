import { useState } from 'react';
import { pageService } from '../';
import { PageVersion, PageMetadata } from '../types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  author: z.string().min(1, 'Author is required'),
});

type FormValues = z.infer<typeof formSchema>;

function tagsToString(tags: string[]): string {
  return tags?.join(', ') || '';
}

function stringToTags(value: string): string[] {
  return value.split(',').map(t => t.trim()).filter(Boolean);
}

interface PageCloneDialogProps {
  page?: PageVersion;
  isOpen: boolean;
  onClose: () => void;
  onCloned: (newPageId: string) => void;
}

export function PageCloneDialog({
  page,
  isOpen,
  onClose,
  onCloned
}: PageCloneDialogProps) {
  const [isCloning, setIsCloning] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: page ? `Copy of ${page.metadata.name}` : '',
      description: page?.metadata.description || '',
      tags: page?.metadata.tags || [],
      author: page?.metadata.author || '',
    },
  });

  async function onSubmit(values: FormValues) {
    if (!page) return;

    setIsCloning(true);
    try {
      const metadata: PageMetadata = {
        name: values.name,
        description: values.description,
        tags: values.tags,
        createdAt: Date.now(),
        modifiedAt: Date.now(),
        author: values.author,
      };

      const newPageId = await pageService.clonePage(page.id, metadata);
      onCloned(newPageId);
      onClose();
    } catch (error) {
      console.error('Error cloning page:', error);
      // Here you might want to show an error message to the user
    } finally {
      setIsCloning(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Clone Page</DialogTitle>
          <DialogDescription>
            Create a copy of this page with new metadata
          </DialogDescription>
          <Button
            variant="ghost"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    Optional description for the cloned page
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      value={tagsToString(field.value)}
                      onChange={e => field.onChange(stringToTags(e.target.value))}
                      placeholder="tag1, tag2, tag3"
                    />
                  </FormControl>
                  <FormDescription>
                    Separate tags with commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCloning}>
                {isCloning ? 'Cloning...' : 'Clone Page'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}