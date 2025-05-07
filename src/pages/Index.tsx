
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PainPoints from '@/components/PainPoints';
import CaseStudies from '@/components/CaseStudies';
import OfferStack from '@/components/OfferStack';
import ComparisonTable from '@/components/ComparisonTable';
import UrgencyCTA from '@/components/UrgencyCTA';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import Achievements from '@/components/Achievements';
import { ArrowRight } from 'lucide-react';
import { ComponentData } from '@/components/admin/PageEditor';

const Index = () => {
  const [publishedData, setPublishedData] = useState<ComponentData | null>(null);
  
  useEffect(() => {
    // Load published data from local storage
    const savedData = localStorage.getItem('publishedLandingPageData');
    if (savedData) {
      try {
        setPublishedData(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to parse published data:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Pass data to components if it exists, otherwise they'll use their defaults */}
        <Hero customData={publishedData?.hero} />
        <Achievements customData={publishedData?.achievements} />
        <PainPoints customData={publishedData?.painPoints} />
        <CaseStudies />
        <OfferStack />
        <ComparisonTable />
        <UrgencyCTA />
        <FAQ customData={publishedData?.faq} />
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Business Visibility?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join the 500+ UAE businesses that have increased foot traffic and sales with our custom signage solutions.
              </p>
              <button className="cta-button group text-xl">
                GET MY FREE SIGNAGE PROPOSAL
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={24} />
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
