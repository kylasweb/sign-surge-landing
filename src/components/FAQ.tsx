
import React from 'react';
import { ArrowRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What if I hate the design?",
      answer: "We'll redesign it free until you're thrilled! Your satisfaction is our top priority, and we won't stop until you love the result. Our design process includes unlimited revisions until you give final approval."
    },
    {
      question: "Can you beat competitors' prices?",
      answer: "We'll match any legitimate offer from a UAE competitor and give you 10% extra value in free services! Simply share their quote with us, and we'll not only match it but add additional value through complimentary services."
    },
    {
      question: "How long does production take?",
      answer: "Standard production is 7-10 business days, but our rush service can deliver in as little as 24 hours! For urgent projects, we offer expedited timelines without compromising on quality."
    },
    {
      question: "Do you handle installation?",
      answer: "Yes! Professional installation is included with every project, and we handle all permits and regulations. Our experienced team will manage the entire process from start to finish, ensuring your signage is properly installed and meets all local requirements."
    },
    {
      question: "What types of signage do you create?",
      answer: "We create every type of signage: storefront, digital, interior, vehicle wraps, trade show displays, and more. Whatever your business needs to stand out, we can design, produce, and install it with premium quality and attention to detail."
    },
    {
      question: "Do you offer warranties?",
      answer: "Absolutely! All our signage comes with a 5-year warranty covering materials, craftsmanship, and even LED lighting components. If anything fails during the warranty period, we'll repair or replace it at no cost to you."
    }
  ];

  return (
    <section id="faq" className="py-16 md:py-24 bg-gray-50">
      <div className="container">
        <h2 className="section-title">
          Frequently Asked
          <span className="text-highlight"> Questions</span>
        </h2>
        
        <div className="max-w-3xl mx-auto mt-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="mb-4 border border-gray-200 rounded-lg bg-white">
                <AccordionTrigger className="px-6 py-4 font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Still have questions? Contact our team for immediate assistance.
          </p>
          <button className="mt-4 inline-flex items-center text-highlight hover:text-highlight/80 font-medium">
            Contact Support
            <ArrowRight className="ml-2" size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
