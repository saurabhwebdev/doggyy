import React from 'react';

interface SkeletonLoaderProps {
  type: 'text' | 'image' | 'card' | 'profile';
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type, 
  count = 1,
  className = ''
}) => {
  const baseClass = "animate-pulse bg-gray-200 rounded";
  
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return <div className={`${baseClass} h-4 w-full mb-2 ${className}`}></div>;
      
      case 'image':
        return <div className={`${baseClass} h-48 w-full ${className}`}></div>;
      
      case 'card':
        return (
          <div className={`${baseClass} p-4 rounded-lg ${className}`}>
            <div className={`${baseClass} h-48 w-full mb-4`}></div>
            <div className={`${baseClass} h-6 w-3/4 mb-3`}></div>
            <div className={`${baseClass} h-4 w-full mb-2`}></div>
            <div className={`${baseClass} h-4 w-full mb-2`}></div>
            <div className={`${baseClass} h-4 w-2/3`}></div>
          </div>
        );
      
      case 'profile':
        return (
          <div className={`flex items-center ${className}`}>
            <div className={`${baseClass} h-12 w-12 rounded-full mr-3`}></div>
            <div className="flex-1">
              <div className={`${baseClass} h-4 w-1/3 mb-2`}></div>
              <div className={`${baseClass} h-3 w-1/2`}></div>
            </div>
          </div>
        );
      
      default:
        return <div className={`${baseClass} h-4 w-full ${className}`}></div>;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="mb-4">
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader; 