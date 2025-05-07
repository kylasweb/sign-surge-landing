
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComponentEditor from './ComponentEditor';
import PreviewFrame from './PreviewFrame';
import ComponentsList from './ComponentsList';
import StylesEditor from './StylesEditor';

const PageEditor = () => {
  const [activeSection, setActiveSection] = useState('hero');
  
  // Simplified structure of sections that can be edited
  const sections = [
    { id: 'hero', name: 'Hero Section' },
    { id: 'achievements', name: 'Achievements' },
    { id: 'painPoints', name: 'Pain Points' },
    { id: 'caseStudies', name: 'Case Studies' },
    { id: 'offerStack', name: 'Offer Stack' },
    { id: 'comparisonTable', name: 'Comparison Table' },
    { id: 'urgencyCta', name: 'Urgency CTA' },
    { id: 'faq', name: 'FAQ Section' },
    { id: 'footer', name: 'Footer' }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-medium mb-4">Page Sections</h2>
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "outline"}
              onClick={() => setActiveSection(section.id)}
            >
              {section.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-6 flex-1">
        <div className="w-1/3 bg-white rounded-lg shadow">
          <Tabs defaultValue="components" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="styles">Styles</TabsTrigger>
            </TabsList>
            <TabsContent value="components" className="p-4">
              <ComponentsList />
            </TabsContent>
            <TabsContent value="properties" className="p-4">
              <ComponentEditor sectionId={activeSection} />
            </TabsContent>
            <TabsContent value="styles" className="p-4">
              <StylesEditor sectionId={activeSection} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="w-2/3 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Preview</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Desktop</Button>
                <Button variant="outline" size="sm">Tablet</Button>
                <Button variant="outline" size="sm">Mobile</Button>
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <PreviewFrame sectionId={activeSection} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageEditor;
