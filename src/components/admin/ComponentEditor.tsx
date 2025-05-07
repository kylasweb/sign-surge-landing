
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { ImageIcon, LayoutIcon, TypeIcon, PlusCircleIcon } from "lucide-react";
import FileUploader from './FileUploader';
import { useToast } from '@/hooks/use-toast';

interface ComponentEditorProps {
  sectionId: string;
}

const ComponentEditor = ({ sectionId }: ComponentEditorProps) => {
  const { toast } = useToast();
  // This would be loaded dynamically based on the selected section
  const [sectionData, setSectionData] = useState({
    hero: {
      title: "Dubai's #1 Custom Signage",
      subtitle: "Get 40% More Foot Traffic or We'll Rebuild It Free!",
      description: "Attention Retailers: Our Proven Designs Make Your Business Impossible to Miss",
      ctaText: "👉 GET MY FREE SIGNAGE PROPOSAL",
      features: [
        "500+ UAE Businesses Trust Us",
        "24-Hour Rush Service",
        "Free Design Consultation"
      ],
      backgroundImage: "", // Added to match PreviewFrame
      backgroundColor: "#ffffff",
      textColor: "#000000",
      buttonColor: "#4338ca",
      buttonTextColor: "#ffffff",
      layout: "centered",
      alignment: "left",
      padding: "medium",
      spacing: "medium",
      showImage: true,
      imagePosition: "right",
      imageUrl: ""
    }
  });

  const [selectedTab, setSelectedTab] = useState("content");
  const [newFeature, setNewFeature] = useState("");

  // This is a simplified version - in a real app, this would update state and save to backend
  const handleChange = (field: string, value: any) => {
    console.log(`Updating ${field} to ${value} for section ${sectionId}`);
    if (sectionId && sectionData[sectionId as keyof typeof sectionData]) {
      setSectionData(prev => ({
        ...prev,
        [sectionId]: {
          ...prev[sectionId as keyof typeof prev],
          [field]: value
        }
      }));
    }
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    
    if (sectionId && sectionData[sectionId as keyof typeof sectionData]) {
      setSectionData(prev => {
        const currentSection = prev[sectionId as keyof typeof prev];
        return {
          ...prev,
          [sectionId]: {
            ...currentSection,
            features: [...currentSection.features, newFeature.trim()]
          }
        };
      });
      setNewFeature("");
      
      toast({
        title: "Feature added",
        description: "The new feature has been added to the list",
      });
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (sectionId && sectionData[sectionId as keyof typeof sectionData]) {
      setSectionData(prev => {
        const currentSection = prev[sectionId as keyof typeof prev];
        const newFeatures = [...currentSection.features];
        newFeatures.splice(index, 1);
        
        return {
          ...prev,
          [sectionId]: {
            ...currentSection,
            features: newFeatures
          }
        };
      });
      
      toast({
        title: "Feature removed",
        description: "The feature has been removed from the list",
      });
    }
  };

  const handleFileUploaded = (fileUrl: string, fileName: string) => {
    handleChange('imageUrl', fileUrl);
    
    toast({
      title: "Image updated",
      description: `${fileName} has been set as the section image`,
    });
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
    <div className="h-[calc(100vh-250px)] overflow-auto">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="content" className="flex items-center gap-1">
            <TypeIcon className="w-4 h-4" /> Content
          </TabsTrigger>
          <TabsTrigger value="style" className="flex items-center gap-1">
            <LayoutIcon className="w-4 h-4" /> Style
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-1">
            <ImageIcon className="w-4 h-4" /> Media
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title"
                value={currentSection.title} 
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input 
                id="subtitle"
                value={currentSection.subtitle} 
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={currentSection.description} 
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ctaText">CTA Button Text</Label>
              <Input 
                id="ctaText"
                value={currentSection.ctaText} 
                onChange={(e) => handleChange('ctaText', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <Label>Features List</Label>
              </div>
              <div className="space-y-2 mb-3">
                {currentSection.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={feature} readOnly className="flex-1" />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add new feature" 
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddFeature} className="flex-shrink-0">
                  <PlusCircleIcon className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color"
                    id="backgroundColor"
                    value={currentSection.backgroundColor} 
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    type="text"
                    value={currentSection.backgroundColor} 
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color"
                    id="textColor"
                    value={currentSection.textColor} 
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    type="text"
                    value={currentSection.textColor} 
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonColor">Button Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color"
                    id="buttonColor"
                    value={currentSection.buttonColor} 
                    onChange={(e) => handleChange('buttonColor', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    type="text"
                    value={currentSection.buttonColor} 
                    onChange={(e) => handleChange('buttonColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buttonTextColor">Button Text Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color"
                    id="buttonTextColor"
                    value={currentSection.buttonTextColor} 
                    onChange={(e) => handleChange('buttonTextColor', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    type="text"
                    value={currentSection.buttonTextColor} 
                    onChange={(e) => handleChange('buttonTextColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="layout">Layout</Label>
                <Select 
                  value={currentSection.layout}
                  onValueChange={(value) => handleChange('layout', value)}
                >
                  <SelectTrigger id="layout">
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="centered">Centered</SelectItem>
                    <SelectItem value="split">Split</SelectItem>
                    <SelectItem value="fullWidth">Full Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alignment">Text Alignment</Label>
                <Select 
                  value={currentSection.alignment}
                  onValueChange={(value) => handleChange('alignment', value)}
                >
                  <SelectTrigger id="alignment">
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="padding">Padding</Label>
                  <Select 
                    value={currentSection.padding}
                    onValueChange={(value) => handleChange('padding', value)}
                  >
                    <SelectTrigger id="padding">
                      <SelectValue placeholder="Select padding" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="spacing">Spacing</Label>
                  <Select 
                    value={currentSection.spacing}
                    onValueChange={(value) => handleChange('spacing', value)}
                  >
                    <SelectTrigger id="spacing">
                      <SelectValue placeholder="Select spacing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showSection">Show Section</Label>
                <Switch 
                  id="showSection" 
                  checked={true} 
                  onCheckedChange={(checked) => handleChange('showSection', checked)}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="media" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="showImage">Show Image</Label>
              <Switch 
                id="showImage" 
                checked={currentSection.showImage} 
                onCheckedChange={(checked) => handleChange('showImage', checked)}
              />
            </div>
            
            {currentSection.showImage && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="imagePosition">Image Position</Label>
                  <Select 
                    value={currentSection.imagePosition}
                    onValueChange={(value) => handleChange('imagePosition', value)}
                  >
                    <SelectTrigger id="imagePosition">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Upload Image</Label>
                  <FileUploader 
                    onFileUploaded={handleFileUploaded}
                    allowedTypes={["image/jpeg", "image/png", "image/gif", "image/svg+xml"]}
                    maxSizeMB={2}
                  />
                </div>
                
                {currentSection.imageUrl && (
                  <div className="space-y-2">
                    <Label>Current Image</Label>
                    <div className="border rounded-md overflow-hidden">
                      <img 
                        src={currentSection.imageUrl} 
                        alt="Section image" 
                        className="w-full h-auto max-h-48 object-contain"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleChange('imageUrl', '')}
                      >
                        Remove Image
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Or use Image URL</Label>
                  <Input 
                    id="imageUrl"
                    value={currentSection.imageUrl} 
                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </>
            )}
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="backgroundImage">Background Image URL</Label>
              <Input 
                id="backgroundImage"
                value={currentSection.backgroundImage} 
                onChange={(e) => handleChange('backgroundImage', e.target.value)}
                placeholder="https://example.com/background.jpg"
              />
              <p className="text-xs text-gray-500">Leave empty to use background color</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComponentEditor;
