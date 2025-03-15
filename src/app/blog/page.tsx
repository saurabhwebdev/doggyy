import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { WebsiteJsonLd, BlogPostJsonLd } from '@/components/JsonLd';
import { getAllBlogPosts, getAllBlogCategories } from '@/services/blogService';
import BlogCategoryList from '@/components/blog/BlogCategoryList';
import BlogPostCard from '@/components/blog/BlogPostCard';
import FeaturedBlogPost from '@/components/blog/FeaturedBlogPost';
import NewsletterSignup from '@/components/blog/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Dog Care Blog',
  description: 'Read expert advice on dog care, training, nutrition, health, and more. Our blog provides valuable information for dog owners and enthusiasts.',
  alternates: {
    canonical: 'https://www.pawpedia.xyz/blog'
  }
};

export default async function BlogPage() {
  // Fetch blog posts and categories from Supabase
  const blogPosts = await getAllBlogPosts(10, 1);
  const categories = await getAllBlogCategories();
  
  // If no posts are found, use the mock data
  const hasPosts = blogPosts.length > 0;
  
  // Featured post is the first post
  const featuredPost = hasPosts ? blogPosts[0] : null;
  
  return (
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
      
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          Dog Care Blog
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Expert advice and tips on dog care, training, nutrition, health, and more.
        </p>
      </div>
      
      {/* Categories */}
      <div className="mb-12">
        <BlogCategoryList categories={categories} />
      </div>
      
      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-16">
          <FeaturedBlogPost post={featuredPost} />
        </div>
      )}
      
      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hasPosts && blogPosts.slice(1).map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
        
        {!hasPosts && (
          <div className="col-span-3 text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">No blog posts found</h2>
            <p className="text-gray-600">Check back soon for new content!</p>
          </div>
        )}
      </div>
      
      {/* Newsletter Signup */}
      <div className="mt-16">
        <NewsletterSignup />
      </div>
    </div>
  );
} 