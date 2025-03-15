"use client";

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const LoadingIndicator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [prevSearchParams, setPrevSearchParams] = useState(searchParams);

  // Track navigation changes
  useEffect(() => {
    if (pathname !== prevPathname || searchParams !== prevSearchParams) {
      // Navigation has occurred
      setIsLoading(true);
      
      // Update previous values
      setPrevPathname(pathname);
      setPrevSearchParams(searchParams);
      
      // After a short delay, hide the loading indicator
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [pathname, searchParams, prevPathname, prevSearchParams]);

  // Handle clicks on links to show loading indicator
  useEffect(() => {
    const handleLinkClick = () => {
      setIsLoading(true);
    };

    // Add click event listeners to all anchor tags
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      link.addEventListener('click', handleLinkClick);
    });

    // Cleanup
    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleLinkClick);
      });
    };
  }, []);

  return (
    <>
      {/* Progress bar at the top */}
      <div 
        className={`fixed top-0 left-0 w-full h-1 z-50 transition-opacity duration-300 ${
          isLoading ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="h-full bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 animate-loading-bar"></div>
      </div>
      
      {/* Spinner in the corner */}
      <div 
        className={`fixed bottom-4 right-4 bg-white rounded-full shadow-lg p-3 transition-opacity duration-300 ${
          isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </>
  );
};

export default LoadingIndicator; 