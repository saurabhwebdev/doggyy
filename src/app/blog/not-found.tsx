import Link from 'next/link';
import { Suspense } from 'react';

// Component that uses useSearchParams wrapped in Suspense
const SearchParamsComponent = () => {
  // This component would normally use useSearchParams
  // But we're not actually using it for functionality in the 404 page
  return null;
};

export default function BlogNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Blog Post Not Found</h1>
      <p className="text-xl text-gray-600 mb-8">
        Sorry, the blog post you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      
      {/* Suspense boundary for any components that might use useSearchParams */}
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsComponent />
      </Suspense>
      
      <Link 
        href="/blog" 
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition-colors"
      >
        Return to Blog
      </Link>
    </div>
  );
} 