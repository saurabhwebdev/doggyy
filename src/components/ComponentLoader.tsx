import React from 'react';

interface ComponentLoaderProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const ComponentLoader: React.FC<ComponentLoaderProps> = ({ 
  message = 'Loading content...', 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin mb-3`}></div>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
};

export default ComponentLoader; 