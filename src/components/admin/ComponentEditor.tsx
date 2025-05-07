
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ComponentEditorProps {
  sectionId: string;
}

const ComponentEditor = ({ sectionId }: ComponentEditorProps) => {
  // This would be loaded dynamically based on the selected section
  const sectionData = {
    hero: {
      title: "Dubai's #1 Custom Signage",
      subtitle: "Get 40% More Foot Traffic or We'll Rebuild It Free!",
      description: "Attention Retailers: Our Proven Designs Make Your Business Impossible to Miss",
      ctaText: "👉 GET MY FREE SIGNAGE PROPOSAL",
      features: [
        "500+ UAE Businesses Trust Us",
        "24-Hour Rush Service",
        "Free Design Consultation"
      ]
    }
  };

  // This is a simplified version - in a real app, this would update state
  const handleChange = (field: string, value: string) => {
    console.log(`Updating ${field} to ${value} for section ${sectionId}`);
  };

  const currentSection = sectionData[sectionId as keyof typeof sectionData];

  if (!currentSection) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select a section to edit its properties
      </div>
    );
  }

  return (
    <div className="space-y-6 h-[calc(100vh-250px)] overflow-auto">
      <div className="space-y-4">
        <h3 className="text-md font-medium">Content</h3>
        
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title"
            defaultValue={currentSection.title} 
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input 
            id="subtitle"
            defaultValue={currentSection.subtitle} 
            onChange={(e) => handleChange('subtitle', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            defaultValue={currentSection.description} 
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ctaText">CTA Button Text</Label>
          <Input 
            id="ctaText"
            defaultValue={currentSection.ctaText} 
            onChange={(e) => handleChange('ctaText', e.target.value)}
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-md font-medium">Display Options</h3>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="showSection">Show Section</Label>
          <Switch id="showSection" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="fullWidth">Full Width</Label>
          <Switch id="fullWidth" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="useAnimation">Use Animation</Label>
          <Switch id="useAnimation" defaultChecked />
        </div>
      </div>
    </div>
  );
};

export default ComponentEditor;
