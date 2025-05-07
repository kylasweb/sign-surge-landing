
import React from 'react';

const ComparisonTable = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        <h2 className="section-title">
          Why Choose
          <span className="text-highlight"> IDesign Ads?</span>
        </h2>
        
        <div className="overflow-x-auto mt-12">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left text-lg font-bold">Our Promises</th>
                <th className="p-4 text-center bg-highlight text-white font-bold rounded-t-lg">IDesign Ads</th>
                <th className="p-4 text-center bg-gray-200 font-bold rounded-t-lg">Competitors</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium">Warranty Coverage</td>
                <td className="p-4 text-center bg-blue-50">
                  <span className="text-green-500 text-xl">✅</span> 
                  <span className="ml-2 font-semibold">5-Year Warranty</span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-red-500 text-xl">❌</span> 
                  <span className="ml-2 text-gray-500">1 Year at Most</span>
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium">Rush Service</td>
                <td className="p-4 text-center bg-blue-50">
                  <span className="text-green-500 text-xl">✅</span> 
                  <span className="ml-2 font-semibold">Free Rush Service</span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-red-500 text-xl">❌</span> 
                  <span className="ml-2 text-gray-500">$500 Extra Fee</span>
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium">Design Revisions</td>
                <td className="p-4 text-center bg-blue-50">
                  <span className="text-green-500 text-xl">✅</span> 
                  <span className="ml-2 font-semibold">3 Free Revisions</span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-red-500 text-xl">❌</span> 
                  <span className="ml-2 text-gray-500">Pay Per Change</span>
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-4 font-medium">Installation</td>
                <td className="p-4 text-center bg-blue-50">
                  <span className="text-green-500 text-xl">✅</span> 
                  <span className="ml-2 font-semibold">Professional Install Included</span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-red-500 text-xl">❌</span> 
                  <span className="ml-2 text-gray-500">Extra Cost</span>
                </td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Satisfaction Guarantee</td>
                <td className="p-4 text-center bg-blue-50 rounded-b-lg">
                  <span className="text-green-500 text-xl">✅</span> 
                  <span className="ml-2 font-semibold">100% Money-Back</span>
                </td>
                <td className="p-4 text-center rounded-b-lg">
                  <span className="text-red-500 text-xl">❌</span> 
                  <span className="ml-2 text-gray-500">No Guarantees</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
