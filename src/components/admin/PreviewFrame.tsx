
import React, { useState, useEffect } from 'react';
import { ComponentData } from './PageEditor';

interface PreviewFrameProps {
  sectionId: string;
  componentsData: ComponentData;
}

const PreviewFrame = ({ sectionId, componentsData }: PreviewFrameProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [previewSize, setPreviewSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // Simulate loading preview
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
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

  // Get the section data based on the section ID
  const getSectionData = () => {
    return componentsData[sectionId as keyof ComponentData];
  };

  // This function generates the preview for each section type
  const getSectionPreview = () => {
    const currentSection = getSectionData();
    
    if (!currentSection) {
      return (
        <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Select a section to preview</p>
        </div>
      );
    }
    
    switch (sectionId) {
      case 'hero': {
        const heroSection = currentSection as ComponentData['hero'];
        
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
        const achievementsSection = currentSection as ComponentData['achievements'];
        
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
        const faqSection = currentSection as ComponentData['faq'];
        
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
      
      case 'painPoints': {
        const painPointsSection = currentSection as ComponentData['painPoints'];
        
        return (
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">{painPointsSection.title}</h2>
            <div className="grid grid-cols-3 gap-4">
              {painPointsSection.problems.map((problem) => (
                <div key={problem.id} className="p-4 border rounded-lg">
                  <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4">
                    {problem.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{problem.question}</h3>
                  <p className="text-gray-600">{problem.description}</p>
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
