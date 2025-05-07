
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

interface StylesEditorProps {
  sectionId: string;
}

const StylesEditor = ({ sectionId }: StylesEditorProps) => {
  const handleColorChange = (property: string, value: string) => {
    console.log(`Setting ${property} to ${value} for section ${sectionId}`);
  };

  const handleFontChange = (property: string, value: string) => {
    console.log(`Setting ${property} to ${value} for section ${sectionId}`);
  };

  const handleSpacingChange = (property: string, value: number[]) => {
    console.log(`Setting ${property} to ${value[0]} for section ${sectionId}`);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-250px)] overflow-auto">
      <div className="space-y-4">
        <h3 className="text-md font-medium">Colors</h3>
        
        <div className="space-y-2">
          <Label htmlFor="bgColor">Background Color</Label>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded border bg-gradient-to-br from-blue-50 to-gray-100"></div>
            <Input 
              id="bgColor"
              defaultValue="#f8f9fa" 
              onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="textColor">Text Color</Label>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded border bg-gray-900"></div>
            <Input 
              id="textColor"
              defaultValue="#212529" 
              onChange={(e) => handleColorChange('textColor', e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="accentColor">Accent Color</Label>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded border bg-highlight"></div>
            <Input 
              id="accentColor"
              defaultValue="#9b87f5" 
              onChange={(e) => handleColorChange('accentColor', e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-md font-medium">Typography</h3>
        
        <div className="space-y-2">
          <Label htmlFor="fontFamily">Font Family</Label>
          <Select defaultValue="sans" onValueChange={(value) => handleFontChange('fontFamily', value)}>
            <SelectTrigger id="fontFamily">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans">Sans Serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Heading Size</Label>
            <span className="text-sm text-gray-500">32px</span>
          </div>
          <Slider 
            defaultValue={[32]} 
            min={16} 
            max={72} 
            step={1}
            onValueChange={(value) => handleFontChange('headingSize', value[0].toString())}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Body Text Size</Label>
            <span className="text-sm text-gray-500">16px</span>
          </div>
          <Slider 
            defaultValue={[16]} 
            min={12} 
            max={24} 
            step={1}
            onValueChange={(value) => handleFontChange('bodySize', value[0].toString())}
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-md font-medium">Spacing</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Padding</Label>
            <span className="text-sm text-gray-500">16px</span>
          </div>
          <Slider 
            defaultValue={[16]} 
            min={0} 
            max={64} 
            step={4}
            onValueChange={(value) => handleSpacingChange('padding', value)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Margin</Label>
            <span className="text-sm text-gray-500">24px</span>
          </div>
          <Slider 
            defaultValue={[24]} 
            min={0} 
            max={64} 
            step={4}
            onValueChange={(value) => handleSpacingChange('margin', value)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Gap</Label>
            <span className="text-sm text-gray-500">12px</span>
          </div>
          <Slider 
            defaultValue={[12]} 
            min={0} 
            max={48} 
            step={4}
            onValueChange={(value) => handleSpacingChange('gap', value)}
          />
        </div>
      </div>
    </div>
  );
};

export default StylesEditor;
