
import React, { useState, useEffect } from 'react';

interface PreviewFrameProps {
  sectionId: string;
}

const PreviewFrame = ({ sectionId }: PreviewFrameProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [previewSize, setPreviewSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // States for the section data - in a real app, this would be shared with the ComponentEditor
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
        { 
          question: "What if I hate the design?", 
          answer: "We'll redesign it free until you're thrilled!" 
        },
        {
          question: "How long does production take?",
          answer: "Standard production is 7-10 business days, but our rush service can deliver in as little as 24 hours!"
        }
      ]
    }
  });

  // Simulate loading preview
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [sectionId]);

  // Get the appropriate container class based on the preview size
  const getPreviewContainerClass = () => {
    switch (previewSize) {
      case 'desktop':
        return 'w-full';
      case 'tablet':
        return 'w-[768px] mx-auto border';
      case 'mobile':
        return 'w-[375px] mx-auto border';
      default:
        return 'w-full';
    }
  };

  // This function would be more complex in a real implementation
  const getSectionPreview = () => {
    const currentSection = sectionData[sectionId as keyof typeof sectionData];
    
    if (!currentSection) {
      return (
        <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Select a section to preview</p>
        </div>
      );
    }
    
    switch (sectionId) {
      case 'hero': {
        const heroSection = currentSection as typeof sectionData.hero;
        
        const sectionStyle = {
          backgroundColor: heroSection.backgroundColor,
          color: heroSection.textColor,
          padding: heroSection.padding === 'small' ? '1rem' : heroSection.padding === 'medium' ? '2rem' : '4rem',
          backgroundImage: heroSection.backgroundImage ? `url(${heroSection.backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
        
        const contentStyle = {
          textAlign: heroSection.alignment as 'left' | 'center' | 'right',
          display: 'flex',
          flexDirection: heroSection.layout === 'split' ? 'row' : 'column',
          gap: heroSection.spacing === 'small' ? '0.5rem' : heroSection.spacing === 'medium' ? '1rem' : '2rem'
        };
        
        const buttonStyle = {
          backgroundColor: heroSection.buttonColor,
          color: heroSection.buttonTextColor,
          padding: '0.75rem 1.5rem',
          borderRadius: '0.375rem',
          fontWeight: 'bold',
          display: 'inline-block',
          marginTop: '1rem'
        };
        
        return (
          <div style={sectionStyle} className="rounded-lg overflow-hidden">
            <div className="max-w-4xl mx-auto" style={contentStyle as React.CSSProperties}>
              {heroSection.showImage && heroSection.imageUrl && heroSection.imagePosition === 'left' && (
                <div className="flex-1">
                  <img src={heroSection.imageUrl} alt="Hero" className="w-full h-auto rounded-lg" />
                </div>
              )}
              
              <div className={`${heroSection.showImage && heroSection.imageUrl ? 'flex-1' : 'w-full'}`}>
                {heroSection.title && <h2 className="text-3xl font-bold mb-2">{heroSection.title}</h2>}
                {heroSection.subtitle && <h3 className="text-xl font-bold mb-3">{heroSection.subtitle}</h3>}
                {heroSection.description && <p className="mb-4">{heroSection.description}</p>}
                
                {heroSection.features && heroSection.features.length > 0 && (
                  <ul className="mb-4 space-y-1">
                    {heroSection.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-primary">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                )}
                
                {heroSection.ctaText && (
                  <button style={buttonStyle}>{heroSection.ctaText}</button>
                )}
              </div>
              
              {heroSection.showImage && heroSection.imageUrl && heroSection.imagePosition === 'right' && (
                <div className="flex-1">
                  <img src={heroSection.imageUrl} alt="Hero" className="w-full h-auto rounded-lg" />
                </div>
              )}
            </div>
          </div>
        );
      }
      
      case 'achievements': {
        const achievementsSection = currentSection as typeof sectionData.achievements;
        
        return (
          <div className="bg-white p-8 rounded-lg border">
            <h2 className="text-2xl font-bold mb-6 text-center">{achievementsSection.title}</h2>
            <div className="grid grid-cols-3 gap-4">
              {achievementsSection.items.map((item, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl font-bold text-highlight">{item.number}</p>
                  <p className="text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }
      
      case 'faq': {
        const faqSection = currentSection as typeof sectionData.faq;
        
        return (
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">{faqSection.title}</h2>
            <div className="space-y-4">
              {faqSection.items.map((item, index) => (
                <div key={index} className="p-4 bg-white rounded-lg">
                  <h3 className="font-bold">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }
      
      default:
        return (
          <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Preview not available for this section</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-4">
        <div className="flex gap-2">
          <button 
            onClick={() => setPreviewSize('desktop')} 
            className={`px-3 py-1 text-sm rounded ${previewSize === 'desktop' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Desktop
          </button>
          <button 
            onClick={() => setPreviewSize('tablet')} 
            className={`px-3 py-1 text-sm rounded ${previewSize === 'tablet' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Tablet
          </button>
          <button 
            onClick={() => setPreviewSize('mobile')} 
            className={`px-3 py-1 text-sm rounded ${previewSize === 'mobile' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Mobile
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto border rounded-lg bg-gray-50 p-4">
        <div className={getPreviewContainerClass()}>
          {isLoading ? (
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-t-highlight border-gray-200 border-solid rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading preview...</p>
            </div>
          ) : (
            <div className="w-full">
              {getSectionPreview()}
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>This is a preview of the {sectionId} section.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewFrame;
