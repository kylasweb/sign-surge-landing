import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { PageVersion, PageTemplate } from '../types';
import { pageService } from '../';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface PageLibraryProps {
  onSelectPage: (version: PageVersion) => void;
  onSelectTemplate: (template: PageTemplate) => void;
}

export function PageLibrary({ onSelectPage, onSelectTemplate }: PageLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pages, setPages] = useState<PageVersion[]>([]);
  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [activeTab, setActiveTab] = useState('pages');

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadContent();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const loadContent = async () => {
    const searchQuery = searchTerm ? { term: searchTerm } : undefined;
    
    if (activeTab === 'pages') {
      const results = await pageService.searchPages(searchQuery || {});
      setPages(results);
    } else {
      const results = await pageService.listTemplates(searchQuery);
      setTemplates(results);
    }
  };

  const PageCard = ({ version }: { version: PageVersion }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{version.metadata.name}</CardTitle>
        <CardDescription>
          Last modified {formatDistanceToNow(version.metadata.modifiedAt)} ago
          by {version.metadata.author}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {version.metadata.tags.map(tag => (
          <span key={tag} className="mr-2 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
            {tag}
          </span>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => onSelectPage(version)}>
          Open
        </Button>
      </CardFooter>
    </Card>
  );

  const TemplateCard = ({ template }: { template: PageTemplate }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      {template.thumbnail && (
        <CardContent>
          <img 
            src={template.thumbnail} 
            alt={template.name} 
            className="w-full h-32 object-cover rounded-md"
          />
        </CardContent>
      )}
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => onSelectTemplate(template)}>
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center space-x-4 p-4 border-b">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search pages and templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="flex-1">
          <ScrollArea className="h-[calc(100vh-220px)] px-4">
            {pages.map((page) => (
              <PageCard key={page.id} version={page} />
            ))}
            {pages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No pages found
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="templates" className="flex-1">
          <ScrollArea className="h-[calc(100vh-220px)] px-4">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
            {templates.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No templates found
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}