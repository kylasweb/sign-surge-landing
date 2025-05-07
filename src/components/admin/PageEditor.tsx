
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ComponentEditor from './ComponentEditor';
import PreviewFrame from './PreviewFrame';
import ComponentsList from './ComponentsList';
import StylesEditor from './StylesEditor';

// Define a shared type for component data that will be used across files
export type ComponentData = {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    features: string[];
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    buttonTextColor: string;
    layout: string;
    alignment: string;
    padding: string;
    spacing: string;
    showImage: boolean;
    imagePosition: string;
    imageUrl: string;
    backgroundImage: string;
  };
  achievements: {
    title: string;
    items: Array<{ number: string; label: string }>;
  };
  faq: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
  painPoints: {
    title: string;
    problems: Array<{ id: number; question: string; icon: string; description: string }>;
  };
};

const PageEditor = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedComponent, setSelectedComponent] = useState('');
  const { toast } = useToast();
  
  // Define the initial data structure for all editable components
  const [componentsData, setComponentsData] = useState<ComponentData>({
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
      backgroundImage: "",
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
    },
    achievements: {
      title: "Our Achievements",
      items: [
        { number: "500+", label: "Completed Projects" },
        { number: "350+", label: "Satisfied Clients" },
        { number: "25+", label: "Industry Awards" }
      ]
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        { question: "What if I hate the design?", answer: "We'll redesign it free until you're thrilled!" },
        { question: "How long does production take?", answer: "Standard production is 7-10 business days, but our rush service can deliver in as little as 24 hours!" }
      ]
    },
    painPoints: {
      title: "Is Your Business Suffering From These Signage Problems?",
      problems: [
        {
          id: 1,
          question: "Invisible storefronts losing customers?",
          icon: "🔍",
          description: "Studies show 68% of customers have skipped a business because they couldn't find or notice it."
        },
        {
          id: 2,
          question: "Faded signs making your brand look cheap?",
          icon: "🌦️",
          description: "Weather-damaged signage can reduce perceived business value by up to 47% according to consumer surveys."
        },
        {
          id: 3,
          question: "Event booths nobody notices?",
          icon: "📊",
          description: "The average trade show visitor walks past 87% of booths without stopping - yours doesn't have to be one of them."
        }
      ]
    }
  });

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedData = localStorage.getItem('landingPageData');
    if (savedData) {
      try {
        setComponentsData(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to parse saved data:', error);
      }
    }
  }, []);

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

  // Function to update component data
  const updateComponentData = (section: string, field: string, value: any) => {
    setComponentsData(prev => {
      if (!prev[section as keyof ComponentData]) return prev;
      
      return {
        ...prev,
        [section]: {
          ...prev[section as keyof ComponentData],
          [field]: value
        }
      };
    });
  };

  const handlePublish = () => {
    // Save the data to localStorage
    localStorage.setItem('landingPageData', JSON.stringify(componentsData));
    
    // Also save as published data which the front-end will use
    localStorage.setItem('publishedLandingPageData', JSON.stringify(componentsData));
    
    toast({
      title: "Changes published",
      description: "Your changes have been published to the live site",
    });
  };

  const handleSaveDraft = () => {
    // Save the data to localStorage but don't update the published version
    localStorage.setItem('landingPageData', JSON.stringify(componentsData));
    
    toast({
      title: "Draft saved",
      description: "Your changes have been saved as a draft",
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Page Sections</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button onClick={handlePublish}>
              Publish Changes
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
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
              <ComponentsList onSelectComponent={setSelectedComponent} />
            </TabsContent>
            <TabsContent value="properties" className="p-4">
              <ComponentEditor 
                sectionId={activeSection} 
                selectedComponent={selectedComponent}
                componentsData={componentsData}
                updateComponentData={updateComponentData}
              />
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
            </div>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <PreviewFrame 
              sectionId={activeSection} 
              componentsData={componentsData} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageEditor;
