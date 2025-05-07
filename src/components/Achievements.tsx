
import React, { useState, useEffect } from 'react';

const Achievements = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  
  const targetCounts = {
    projects: 500,
    clients: 350,
    awards: 25
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
  }, []);

  return (
    <section className="py-12 bg-white border-t border-b border-gray-200">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="counter-box">
            <div className="text-center">
              <p className="text-4xl font-bold text-highlight">{count1}+</p>
              <p className="text-gray-500 mt-1">Completed Projects</p>
            </div>
          </div>
          
          <div className="counter-box">
            <div className="text-center">
              <p className="text-4xl font-bold text-highlight">{count2}+</p>
              <p className="text-gray-500 mt-1">Satisfied Clients</p>
            </div>
          </div>
          
          <div className="counter-box">
            <div className="text-center">
              <p className="text-4xl font-bold text-highlight">{count3}+</p>
              <p className="text-gray-500 mt-1">Industry Awards</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
