
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const CaseStudies = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const caseStudies = [
    {
      id: 1,
      client: "Boutique Rania",
      result: "67% Sales Increase in 30 Days",
      imageBefore: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      imageAfter: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      testimonial: "Our boutique was struggling to attract walk-ins until IDesign Ads created our new storefront signage. The difference was immediate and dramatic.",
      person: "Rania Al Mazroui, Owner"
    },
    {
      id: 2,
      client: "Marriott Dubai",
      result: "200% More Lobby Engagement",
      imageBefore: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      imageAfter: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      testimonial: "The digital signage IDesign implemented throughout our lobby has transformed guest engagement with our amenities. Bookings for our spa services alone increased 200%.",
      person: "Ahmed Hassan, Operations Director"
    },
    {
      id: 3,
      client: "Spice Market Restaurant",
      result: "45% Boost in First-Time Visitors",
      imageBefore: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      imageAfter: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      testimonial: "Our restaurant was hidden in a busy area until IDesign created signage that made us impossible to miss. Our reservation rate from walk-ins has skyrocketed.",
      person: "Fatima Qureshi, Restaurant Manager"
    }
  ];

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % caseStudies.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + caseStudies.length) % caseStudies.length);
  };

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gray-50">
      <div className="container">
        <h2 className="section-title">
          Real Results for
          <span className="text-highlight"> Real Businesses</span>
        </h2>
        
        <div className="relative mt-12">
          <div className="overflow-hidden rounded-xl shadow-xl">
            <div className="relative">
              {caseStudies.map((study, index) => (
                <div 
                  key={study.id} 
                  className={`transition-all duration-500 ease-in-out ${index === activeIndex ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'}`}
                >
                  <div className="bg-white p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold">{study.client}</h3>
                      <div className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold">
                        {study.result}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-2">BEFORE:</p>
                        <div className="relative h-64 rounded overflow-hidden">
                          <img 
                            src={study.imageBefore} 
                            alt={`${study.client} Before`} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded text-xs font-bold">
                            BEFORE
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">AFTER:</p>
                        <div className="relative h-64 rounded overflow-hidden">
                          <img 
                            src={study.imageAfter} 
                            alt={`${study.client} After`} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded text-xs font-bold">
                            AFTER
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                      <blockquote className="italic text-gray-700">
                        "{study.testimonial}"
                      </blockquote>
                      <p className="mt-4 font-semibold">{study.person}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-8 space-x-4">
            <button 
              onClick={prevSlide} 
              className="p-3 rounded-full bg-white shadow hover:bg-gray-100 transition-colors"
              aria-label="Previous case study"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex space-x-2">
              {caseStudies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === activeIndex ? 'bg-highlight' : 'bg-gray-300'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={nextSlide} 
              className="p-3 rounded-full bg-white shadow hover:bg-gray-100 transition-colors"
              aria-label="Next case study"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
