import React from 'react';

interface BreedCardSkeletonProps {
  count?: number;
}

const BreedCardSkeleton: React.FC<BreedCardSkeletonProps> = ({ count = 8 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse"
        >
          <div className="h-56 bg-gray-200"></div>
          <div className="p-4">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default BreedCardSkeleton; 