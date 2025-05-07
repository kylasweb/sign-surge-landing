
import React, { useState, useEffect } from 'react';

interface AchievementsProps {
  customData?: {
    title: string;
    items: Array<{ number: string; label: string }>;
  };
}

const Achievements = ({ customData }: AchievementsProps) => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  
  // Use custom data if provided, otherwise use defaults
  const title = customData?.title || "Our Achievements";
  const achievementItems = customData?.items || [
    { number: "500+", label: "Completed Projects" },
    { number: "350+", label: "Satisfied Clients" },
    { number: "25+", label: "Industry Awards" }
  ];
  
  // Target counts for animation
  const targetCounts = {
    projects: parseInt(achievementItems[0]?.number) || 500,
    clients: parseInt(achievementItems[1]?.number) || 350,
    awards: parseInt(achievementItems[2]?.number) || 25
  };
  
  useEffect(() => {
    // Animate count up when component is in view
    const animateCount = (setter: React.Dispatch<React.SetStateAction<number>>, target: number) => {
      const duration = 2000; // 2 seconds
      const steps = 50;
      const stepTime = duration / steps;
      const stepValue = target / steps;
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        setter(Math.min(Math.round(stepValue * currentStep), target));
        
        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepTime);
      
      return interval;
    };
    
    const count1Interval = animateCount(setCount1, targetCounts.projects);
    const count2Interval = animateCount(setCount2, targetCounts.clients);
    const count3Interval = animateCount(setCount3, targetCounts.awards);
    
    return () => {
      clearInterval(count1Interval);
      clearInterval(count2Interval);
      clearInterval(count3Interval);
    };
  }, [targetCounts]);

  return (
    <section className="py-12 bg-white border-t border-b border-gray-200">
      <div className="container">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {achievementItems.map((item, index) => (
            <div key={index} className="counter-box">
              <div className="text-center">
                <p className="text-4xl font-bold text-highlight">
                  {index === 0 ? count1 : index === 1 ? count2 : count3}+
                </p>
                <p className="text-gray-500 mt-1">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
