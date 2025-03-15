import Link from 'next/link';

export default function CategoryNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Category Not Found</h1>
      <p className="text-xl text-gray-600 mb-8">
        Sorry, the blog category you're looking for doesn't exist or has been removed.
      </p>
      <Link 
        href="/blog" 
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition-colors"
      >
        View All Categories
      </Link>
    </div>
  );
} 