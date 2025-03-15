import React, { Suspense } from 'react';
import Link from 'next/link';

// Component that uses useSearchParams wrapped in Suspense
const SearchParamsComponent = () => {
  // This component would normally use useSearchParams
  // But we're not actually using it for functionality in the 404 page
  return null;
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
        </p>
        
        {/* Suspense boundary for any components that might use useSearchParams */}
        <Suspense fallback={<div>Loading...</div>}>
          <SearchParamsComponent />
        </Suspense>
        
        <div className="mt-6">
          <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
} 