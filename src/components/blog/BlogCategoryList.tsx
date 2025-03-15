'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BlogCategory } from '@/services/blogService';

interface BlogCategoryListProps {
  categories: BlogCategory[];
}

export default function BlogCategoryList({ categories }: BlogCategoryListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Show only 5 categories initially, then expand to show all
  const displayCategories = isExpanded ? categories : categories.slice(0, 5);
  const hasMoreCategories = categories.length > 5;
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Categories</h2>
      <div className="flex flex-wrap gap-2">
        <Link 
          href="/blog"
          className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          All
        </Link>
        
        {displayCategories.map((category) => (
          <Link 
            key={category.id}
            href={`/blog/category/${category.slug}`}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            {category.name}
          </Link>
        ))}
        
        {hasMoreCategories && !isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            + More
          </button>
        )}
        
        {isExpanded && hasMoreCategories && (
          <button
            onClick={() => setIsExpanded(false)}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            - Less
          </button>
        )}
      </div>
    </div>
  );
} 