
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const UrgencyCTA = () => {
  const [timer, setTimer] = useState({ hours: 0, minutes: 59, seconds: 59 });
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    const blinkInterval = setInterval(() => {
      setIsBlinking(prev => !prev);
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(blinkInterval);
    };
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-orange-600 to-red-600 text-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Don't Let Your Business Remain Invisible Any Longer
          </h2>
          
          <p className="text-lg md:text-xl mb-8">
            Every day without proper signage costs your business potential customers. 
            Our experts are ready to create your custom solution today.
          </p>
          
          <div className="bg-white/10 p-6 rounded-lg mb-8">
            <div className="text-center mb-4">
              <p className="text-xl font-semibold">Offer Expires In:</p>
            </div>
            
            <div className="flex justify-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg w-20 text-center">
                <span className="block text-3xl font-bold">{String(timer.hours).padStart(2, '0')}</span>
                <span className="text-sm">Hours</span>
              </div>
              <div className="bg-white/20 p-3 rounded-lg w-20 text-center">
                <span className="block text-3xl font-bold">{String(timer.minutes).padStart(2, '0')}</span>
                <span className="text-sm">Minutes</span>
              </div>
              <div className="bg-white/20 p-3 rounded-lg w-20 text-center">
                <span className="block text-3xl font-bold">{String(timer.seconds).padStart(2, '0')}</span>
                <span className="text-sm">Seconds</span>
              </div>
            </div>
          </div>
          
          <button 
            className={`
              cta-button text-xl px-10 py-5 mx-auto
              ${isBlinking ? 'bg-yellow-400 text-black' : 'bg-cta text-white'}
              transition-all duration-300
            `}
          >
            ⚠️ LAST CHANCE: CLAIM 2024 PRICING
            <ArrowRight className="ml-2" size={24} />
          </button>
          
          <p className="mt-6 text-sm text-white/80">
            Lock in today's prices before our scheduled 15% increase on all projects
          </p>
        </div>
      </div>
    </section>
  );
};

export default UrgencyCTA;
