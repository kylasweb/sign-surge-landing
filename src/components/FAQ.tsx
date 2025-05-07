
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQProps {
  customData?: {
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
}

const FAQ = ({ customData }: FAQProps) => {
  // Use custom data if provided, otherwise use defaults
  const title = customData?.title || "Frequently Asked Questions";
  const items = customData?.items || [
    { 
      question: "What if I hate the design?", 
      answer: "We'll redesign it free until you're thrilled!" 
    },
    {
      question: "How long does production take?",
      answer: "Standard production is 7-10 business days, but our rush service can deliver in as little as 24 hours!"
    },
    {
      question: "Do you help with installation?",
      answer: "Absolutely! Our professional installation team handles everything from permits to final placement."
    },
    {
      question: "What materials do you use?",
      answer: "We use only premium-grade materials that withstand Dubai's harsh climate, backed by our industry-leading warranty."
    },
    {
      question: "Can I see samples before ordering?",
      answer: "Yes! We provide physical material samples and detailed digital mockups before production begins."
    }
  ];
  
  return (
    <section id="faq" className="py-16 md:py-24 bg-white">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title mb-12 text-center">{title}</h2>
          
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-12 text-center">
            <p className="text-lg">Still have questions? Contact our team directly.</p>
            <button className="mt-4 px-8 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
