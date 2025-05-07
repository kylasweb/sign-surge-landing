
import React from 'react';
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Dubai's #1 Custom Signage
                <span className="block text-highlight mt-2">
                  Get 40% More Foot Traffic or We'll Rebuild It Free!
                </span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-700">
                Attention Retailers: Our Proven Designs Make Your Business Impossible to Miss
                <span className="font-semibold">(See Case Studies Below)</span>
              </p>
            </div>
            
            <button className="cta-button w-full md:w-auto group">
              👉 GET MY FREE SIGNAGE PROPOSAL
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <div className="flex items-center">
                <div className="text-green-500 mr-2 text-xl">✔️</div>
                <p className="text-sm">500+ UAE Businesses Trust Us</p>
              </div>
              <div className="flex items-center">
                <div className="text-green-500 mr-2 text-xl">✔️</div>
                <p className="text-sm">24-Hour Rush Service</p>
              </div>
              <div className="flex items-center">
                <div className="text-green-500 mr-2 text-xl">✔️</div>
                <p className="text-sm">Free Design Consultation</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white p-4 rounded-xl shadow-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1586356986290-9eb801c282e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Professional Signage" 
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute top-2 right-2 bg-cta text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                PREMIUM QUALITY
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-highlight text-white p-4 rounded-lg shadow-lg transform rotate-6">
              <p className="font-bold">DUBAI QUALITY CERTIFIED</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
