import { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComponentType } from './types';

interface DraggableComponentProps {
  component: ComponentType;
}

const DraggableComponent = ({ component }: DraggableComponentProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: component.id,
    data: component,
  });

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="p-3 mb-2 bg-white border rounded-lg cursor-move hover:bg-gray-50"
    >
      <div className="flex items-center gap-2">
        {component.icon && (
          <span className="text-gray-500">
            {component.icon}
          </span>
        )}
        <span>{component.name}</span>
      </div>
    </div>
  );
};

interface ComponentPaletteProps {
  categories: string[];
  components: ComponentType[];
  searchTerm: string;
  onSearch: (term: string) => void;
}

export function ComponentPalette({
  categories,
  components,
  searchTerm,
  onSearch,
}: ComponentPaletteProps) {
  const [filteredComponents, setFilteredComponents] = useState(components);
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || 'all');

  useEffect(() => {
    let filtered = components;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(component =>
        component.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(component =>
        component.category === selectedCategory
      );
    }

    setFilteredComponents(filtered);
  }, [components, searchTerm, selectedCategory]);

  return (
    <Card className="w-64 h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Tabs defaultValue={categories[0]} onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start p-0 h-12 px-4 gap-2">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="px-3 py-1.5"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="m-0">
            <ScrollArea className="h-[calc(100vh-15rem)] p-4">
              <div className="space-y-2">
                {filteredComponents
                  .filter(component => category === 'all' || component.category === category)
                  .map(component => (
                    <DraggableComponent
                      key={component.id}
                      component={component}
                    />
                  ))
                }
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}