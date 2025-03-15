"use client";

import { useState } from 'react';

interface FAQQuestion {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqQuestions: FAQQuestion[];
}

const FAQAccordion = ({ faqQuestions }: FAQAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqQuestions.map((faq, index) => (
        <div 
          key={index} 
          className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
            openIndex === index ? 'shadow-lg' : 'shadow-sm hover:shadow-md'
          }`}
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
            aria-expanded={openIndex === index}
          >
            <div className="flex items-center">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4 font-semibold">
                Q
              </span>
              <h3 className="text-xl font-bold text-gray-900">{faq.question}</h3>
            </div>
            <svg 
              className={`w-6 h-6 text-indigo-600 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div 
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-6 pb-5 pt-2">
              <div className="flex">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4 font-semibold">
                  A
                </span>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion; 