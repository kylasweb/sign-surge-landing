
import React from 'react';

interface PainPointsProps {
  customData?: {
    title: string;
    problems: Array<{
      id: number;
      question: string;
      icon: string;
      description: string;
    }>;
  };
}

const PainPoints = ({ customData }: PainPointsProps) => {
  // Use custom data if provided, otherwise use defaults
  const title = customData?.title || "Is Your Business Suffering From These Signage Problems?";
  const problems = customData?.problems || [
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
  ];

  return (
    <section id="problems" className="py-16 md:py-24 bg-white">
      <div className="container">
        <h2 className="section-title">
          {title.split(" ").slice(0, -1).join(" ")}
          <span className="block text-highlight"> {title.split(" ").slice(-1)[0]}</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {problems.map((problem) => (
            <div key={problem.id} className="card-highlight group">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-6">
                {problem.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-highlight transition-colors">
                {problem.question}
              </h3>
              <p className="text-gray-600">
                {problem.description}
              </p>
              <div className="mt-6 flex">
                <input 
                  type="checkbox"
                  className="w-6 h-6 border-2 border-gray-300 rounded-md mr-3"
                />
                <label className="text-sm text-gray-500">I have this problem</label>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-8">
            Our Solutions Have Helped Clients Like You...
          </h3>
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
