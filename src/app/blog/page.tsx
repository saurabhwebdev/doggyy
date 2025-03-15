import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { WebsiteJsonLd, BlogPostJsonLd } from '@/components/JsonLd';
import { getAllBlogPosts, getAllBlogCategories, getBlogPostCount } from '@/services/blogService';
import BlogCategoryList from '@/components/blog/BlogCategoryList';
import BlogPostCard from '@/components/blog/BlogPostCard';
import FeaturedBlogPost from '@/components/blog/FeaturedBlogPost';
import NewsletterSignup from '@/components/blog/NewsletterSignup';
import BlogPostGrid from '@/components/blog/BlogPostGrid';

// Set dynamic rendering to ensure fresh data on each request
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Dog Care Blog',
  description: 'Read expert advice on dog care, training, nutrition, health, and more. Our blog provides valuable information for dog owners and enthusiasts.',
  alternates: {
    canonical: 'https://www.pawpedia.xyz/blog'
  }
};

export default async function BlogPage() {
  const postsPerPage = 12; // Number of posts to load initially
  
  // Fetch blog posts and categories from Supabase
  const blogPosts = await getAllBlogPosts(postsPerPage, 1);
  const categories = await getAllBlogCategories();
  const totalPosts = await getBlogPostCount();
  
  // If no posts are found, use the mock data
  const hasPosts = blogPosts.length > 0;
  
  // Featured post is the first post
  const featuredPost = hasPosts ? blogPosts[0] : null;
  
  // Regular posts (exclude featured post)
  const regularPosts = featuredPost ? blogPosts.slice(1) : blogPosts;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Dog Care Blog
            </h1>
            <p className="text-xl opacity-90">
              Expert advice and tips on dog care, training, nutrition, health, and more.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {/* JSON-LD Structured Data */}
        <WebsiteJsonLd 
          url="https://www.pawpedia.xyz/blog"
          name="PawPedia Dog Care Blog"
          description="Expert advice and tips on dog care, training, nutrition, health, and more."
          logoUrl="https://www.pawpedia.xyz/logo.png"
        />
        {featuredPost && (
          <BlogPostJsonLd 
            title={featuredPost.title}
            description={featuredPost.excerpt}
            imageUrl={featuredPost.featured_image}
            url={`https://www.pawpedia.xyz/blog/${featuredPost.slug}`}
            datePublished={featuredPost.published_at}
            authorName={featuredPost.author}
          />
        )}
        
        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Categories</h2>
          <BlogCategoryList categories={categories} />
        </div>
        
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Post</h2>
            <FeaturedBlogPost post={featuredPost} />
          </div>
        )}
        
        {/* Blog Posts Grid with Lazy Loading */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Latest Articles</h2>
          {hasPosts ? (
            <BlogPostGrid 
              initialPosts={regularPosts} 
              totalPosts={totalPosts - (featuredPost ? 1 : 0)} 
              postsPerPage={postsPerPage - (featuredPost ? 1 : 0)}
              currentPage={1}
            />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">No blog posts found</h2>
              <p className="text-gray-600">Check back soon for new content!</p>
            </div>
          )}
        </div>
        
        {/* Newsletter Signup */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <NewsletterSignup />
        </div>
      </div>
    </div>
  );
} 