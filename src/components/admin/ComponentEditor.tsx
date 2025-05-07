
import React, { useState, useEffect } from 'react';
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
import { ComponentData } from './PageEditor';

interface ComponentEditorProps {
  sectionId: string;
  selectedComponent: string;
  componentsData: ComponentData;
  updateComponentData: (section: string, field: string, value: any) => void;
}

const ComponentEditor = ({ sectionId, selectedComponent, componentsData, updateComponentData }: ComponentEditorProps) => {
  const { toast } = useToast();
  const [newFeature, setNewFeature] = useState("");
  const [selectedTab, setSelectedTab] = useState("content");
  
  // Use the actual component to edit based on selection or section
  const componentToEdit = selectedComponent || sectionId;
  
  // Get current section data
  const currentSection = componentsData[componentToEdit as keyof ComponentData];

  // Handle field changes
  const handleChange = (field: string, value: any) => {
    updateComponentData(componentToEdit, field, value);
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    
    if (componentToEdit === 'hero' && componentsData.hero) {
      const updatedFeatures = [...componentsData.hero.features, newFeature.trim()];
      updateComponentData('hero', 'features', updatedFeatures);
      setNewFeature("");
      
      toast({
        title: "Feature added",
        description: "The new feature has been added to the list",
      });
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (componentToEdit === 'hero' && componentsData.hero) {
      const newFeatures = [...componentsData.hero.features];
      newFeatures.splice(index, 1);
      updateComponentData('hero', 'features', newFeatures);
      
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

  // Handle adding a new FAQ item
  const handleAddFaqItem = () => {
    if (componentToEdit === 'faq' && componentsData.faq) {
      const updatedItems = [
        ...componentsData.faq.items,
        { question: "New Question", answer: "Add your answer here" }
      ];
      updateComponentData('faq', 'items', updatedItems);
    }
  };

  // Handle removing a FAQ item
  const handleRemoveFaqItem = (index: number) => {
    if (componentToEdit === 'faq' && componentsData.faq) {
      const updatedItems = [...componentsData.faq.items];
      updatedItems.splice(index, 1);
      updateComponentData('faq', 'items', updatedItems);
    }
  };

  // Handle updating a FAQ item
  const handleUpdateFaqItem = (index: number, field: 'question' | 'answer', value: string) => {
    if (componentToEdit === 'faq' && componentsData.faq) {
      const updatedItems = [...componentsData.faq.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
      updateComponentData('faq', 'items', updatedItems);
    }
  };

  // Handle adding achievement item
  const handleAddAchievement = () => {
    if (componentToEdit === 'achievements' && componentsData.achievements) {
      const updatedItems = [
        ...componentsData.achievements.items,
        { number: "0+", label: "New Achievement" }
      ];
      updateComponentData('achievements', 'items', updatedItems);
    }
  };

  // Handle removing achievement item
  const handleRemoveAchievement = (index: number) => {
    if (componentToEdit === 'achievements' && componentsData.achievements) {
      const updatedItems = [...componentsData.achievements.items];
      updatedItems.splice(index, 1);
      updateComponentData('achievements', 'items', updatedItems);
    }
  };

  // Handle updating achievement item
  const handleUpdateAchievement = (index: number, field: 'number' | 'label', value: string) => {
    if (componentToEdit === 'achievements' && componentsData.achievements) {
      const updatedItems = [...componentsData.achievements.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
      updateComponentData('achievements', 'items', updatedItems);
    }
  };

  if (!currentSection) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select a component or section to edit its properties
      </div>
    );
  }

  if (componentToEdit === 'hero') {
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
                  value={componentsData.hero.title} 
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input 
                  id="subtitle"
                  value={componentsData.hero.subtitle} 
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  value={componentsData.hero.description} 
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ctaText">CTA Button Text</Label>
                <Input 
                  id="ctaText"
                  value={componentsData.hero.ctaText} 
                  onChange={(e) => handleChange('ctaText', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <Label>Features List</Label>
                </div>
                <div className="space-y-2 mb-3">
                  {componentsData.hero.features.map((feature, index) => (
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
                      value={componentsData.hero.backgroundColor} 
                      onChange={(e) => handleChange('backgroundColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input 
                      type="text"
                      value={componentsData.hero.backgroundColor} 
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
                      value={componentsData.hero.textColor} 
                      onChange={(e) => handleChange('textColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input 
                      type="text"
                      value={componentsData.hero.textColor} 
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
                      value={componentsData.hero.buttonColor} 
                      onChange={(e) => handleChange('buttonColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input 
                      type="text"
                      value={componentsData.hero.buttonColor} 
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
                      value={componentsData.hero.buttonTextColor} 
                      onChange={(e) => handleChange('buttonTextColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input 
                      type="text"
                      value={componentsData.hero.buttonTextColor} 
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
                    value={componentsData.hero.layout}
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
                    value={componentsData.hero.alignment}
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
                      value={componentsData.hero.padding}
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
                      value={componentsData.hero.spacing}
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
            </div>
          </TabsContent>
          
          <TabsContent value="media" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="showImage">Show Image</Label>
                <Switch 
                  id="showImage" 
                  checked={componentsData.hero.showImage} 
                  onCheckedChange={(checked) => handleChange('showImage', checked)}
                />
              </div>
              
              {componentsData.hero.showImage && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="imagePosition">Image Position</Label>
                    <Select 
                      value={componentsData.hero.imagePosition}
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
                  
                  {componentsData.hero.imageUrl && (
                    <div className="space-y-2">
                      <Label>Current Image</Label>
                      <div className="border rounded-md overflow-hidden">
                        <img 
                          src={componentsData.hero.imageUrl} 
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
                      value={componentsData.hero.imageUrl} 
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
                  value={componentsData.hero.backgroundImage} 
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
  } else if (componentToEdit === 'achievements') {
    return (
      <div className="h-[calc(100vh-250px)] overflow-auto p-1">
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="achievements-title">Title</Label>
            <Input 
              id="achievements-title"
              value={componentsData.achievements.title} 
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Achievement Items</Label>
            <Button 
              onClick={handleAddAchievement} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
            >
              <PlusCircleIcon className="w-4 h-4" /> Add Item
            </Button>
          </div>

          {componentsData.achievements.items.map((item, index) => (
            <div key={index} className="border rounded-md p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Item {index + 1}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveAchievement(index)}
                >
                  Remove
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`achievement-number-${index}`}>Number</Label>
                <Input
                  id={`achievement-number-${index}`}
                  value={item.number}
                  onChange={(e) => handleUpdateAchievement(index, 'number', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`achievement-label-${index}`}>Label</Label>
                <Input
                  id={`achievement-label-${index}`}
                  value={item.label}
                  onChange={(e) => handleUpdateAchievement(index, 'label', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (componentToEdit === 'faq') {
    return (
      <div className="h-[calc(100vh-250px)] overflow-auto p-1">
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="faq-title">Title</Label>
            <Input 
              id="faq-title"
              value={componentsData.faq.title} 
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>FAQ Items</Label>
            <Button 
              onClick={handleAddFaqItem} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
            >
              <PlusCircleIcon className="w-4 h-4" /> Add Question
            </Button>
          </div>

          {componentsData.faq.items.map((item, index) => (
            <div key={index} className="border rounded-md p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Question {index + 1}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveFaqItem(index)}
                >
                  Remove
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`faq-question-${index}`}>Question</Label>
                <Input
                  id={`faq-question-${index}`}
                  value={item.question}
                  onChange={(e) => handleUpdateFaqItem(index, 'question', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
                <Textarea
                  id={`faq-answer-${index}`}
                  value={item.answer}
                  onChange={(e) => handleUpdateFaqItem(index, 'answer', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="p-4 text-center">
        <p>Select a component to edit from the Components tab.</p>
      </div>
    );
  }
};

export default ComponentEditor;
