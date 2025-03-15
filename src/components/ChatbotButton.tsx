"use client";

import { useEffect } from 'react';

interface ChatbotButtonProps {
  className?: string;
}

const ChatbotButton = ({ className = "" }: ChatbotButtonProps) => {
  const handleClick = () => {
    // Find and click the chatbot button
    const chatButton = document.querySelector('[aria-label="Open chat"]') as HTMLButtonElement;
    if (chatButton) chatButton.click();
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-lg ${className}`}
    >
      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
      </svg>
      Chat with PawPal
    </button>
  );
};

export default ChatbotButton; 