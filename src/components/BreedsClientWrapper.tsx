"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import BreedCardSkeleton from './BreedCardSkeleton';

interface BreedsClientWrapperProps {
  children: React.ReactNode;
}

const BreedsClientWrapper: React.FC<BreedsClientWrapperProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Create a function to handle route change start
    const handleStart = () => {
      setIsLoading(true);
    };

    // Create a function to handle route change complete
    const handleComplete = () => {
      setIsLoading(false);
    };

    // Add event listeners for navigation events
    window.addEventListener('beforeunload', handleStart);
    
    // Create a MutationObserver to detect DOM changes that might indicate navigation
    const observer = new MutationObserver((mutations) => {
      // If we detect significant DOM changes, it might be a navigation
      if (mutations.some(m => m.addedNodes.length > 0 || m.removedNodes.length > 0)) {
        handleStart();
        // Check again after a short delay to see if it was actually a navigation
        setTimeout(() => {
          handleComplete();
        }, 500);
      }
    });
    
    // Start observing the document body for changes
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleStart);
      observer.disconnect();
    };
  }, []);

  // Also track pathname and search params changes to detect navigation
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  // Add click event listeners to pagination links
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLAnchorElement;
      if (target.href && target.href.includes('/breeds?')) {
        setIsLoading(true);
      }
    };

    const paginationLinks = document.querySelectorAll('a[href^="/breeds?"]');
    paginationLinks.forEach(link => {
      link.addEventListener('click', handleLinkClick);
    });

    return () => {
      paginationLinks.forEach(link => {
        link.removeEventListener('click', handleLinkClick);
      });
    };
  }, [pathname, searchParams]);

  return (
    <>
      {/* Show the actual content when not loading */}
      <div className={isLoading ? 'hidden' : 'block'}>
        {children}
      </div>
      
      {/* Show skeleton loading state when loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <BreedCardSkeleton count={20} />
        </div>
      )}
    </>
  );
};

export default BreedsClientWrapper; 