
import React, { useState, useEffect } from 'react';

interface PreviewFrameProps {
  sectionId: string;
}

const PreviewFrame = ({ sectionId }: PreviewFrameProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading preview
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [sectionId]);

  // This function would be more complex in a real implementation
  const getSectionPreview = () => {
    switch (sectionId) {
      case 'hero':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-gray-100 p-8 rounded-lg">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Dubai's #1 Custom Signage</h2>
              <h3 className="text-xl text-highlight font-bold mb-4">Get 40% More Foot Traffic or We'll Rebuild It Free!</h3>
              <p className="mb-6">Attention Retailers: Our Proven Designs Make Your Business Impossible to Miss</p>
              <button className="cta-button">👉 GET MY FREE SIGNAGE PROPOSAL</button>
            </div>
          </div>
        );
      case 'achievements':
        return (
          <div className="bg-white p-8 rounded-lg border">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-highlight">500+</p>
                <p className="text-gray-500">Completed Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-highlight">350+</p>
                <p className="text-gray-500">Satisfied Clients</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-highlight">25+</p>
                <p className="text-gray-500">Industry Awards</p>
              </div>
            </div>
          </div>
        );
      case 'faq':
        return (
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-bold">What if I hate the design?</h3>
                <p className="text-gray-600">We'll redesign it free until you're thrilled!</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-bold">How long does production take?</h3>
                <p className="text-gray-600">Standard production is 7-10 business days, but our rush service can deliver in as little as 24 hours!</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Select a section to preview</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      {isLoading ? (
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-highlight border-gray-200 border-solid rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading preview...</p>
        </div>
      ) : (
        <div className="w-full">
          {getSectionPreview()}
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>This is a preview of the {sectionId} section. In a real implementation, changes in the editor would be reflected here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewFrame;
