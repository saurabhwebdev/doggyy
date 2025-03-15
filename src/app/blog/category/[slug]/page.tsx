import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostsByCategory, getAllBlogCategories } from '@/services/blogService';
import BlogCategoryList from '@/components/blog/BlogCategoryList';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { WebsiteJsonLd } from '@/components/JsonLd';

// Set dynamic rendering to ensure fresh data on each request
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  // Ensure params.slug is properly handled
  const slug = params.slug;
  const categories = await getAllBlogCategories();
  const category = categories.find(cat => cat.slug === slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    };
  }
  
  return {
    title: `${category.name} - Dog Care Blog`,
    description: category.description || `Articles about ${category.name.toLowerCase()} for dog owners and enthusiasts.`,
    alternates: {
      canonical: `https://www.pawpedia.xyz/blog/category/${category.slug}`
    }
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Ensure params.slug is properly handled
  const slug = params.slug;
  const categories = await getAllBlogCategories();
  const category = categories.find(cat => cat.slug === slug);
  
  if (!category) {
    notFound();
  }
  
  const posts = await getBlogPostsByCategory(slug);
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* JSON-LD Structured Data */}
      <WebsiteJsonLd 
        url={`https://www.pawpedia.xyz/blog/category/${category.slug}`}
        name={`${category.name} - PawPedia Dog Care Blog`}
        description={category.description || `Articles about ${category.name.toLowerCase()} for dog owners and enthusiasts.`}
        logoUrl="https://www.pawpedia.xyz/logo.png"
      />
      
      {/* Back to blog link */}
      <div className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to All Posts
        </Link>
      </div>
      
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {category.description}
          </p>
        )}
      </div>
      
      {/* Categories */}
      <div className="mb-12">
        <BlogCategoryList categories={categories} />
      </div>
      
      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">No posts in this category</h2>
            <p className="text-gray-600">Check back soon for new content!</p>
          </div>
        )}
      </div>
    </div>
  );
} 