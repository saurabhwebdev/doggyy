import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getCommentsForPost, getAllBlogPosts } from '@/services/blogService';
import { formatDate } from '@/utils/dateUtils';
import { BlogPostJsonLd } from '@/components/JsonLd';
import CommentSection from '@/components/blog/CommentSection';
import ReactMarkdown from 'react-markdown';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }
  
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://www.pawpedia.xyz/blog/${post.slug}`
    }
  };
}

// Generate static params for static generation
export async function generateStaticParams() {
  const posts = await getAllBlogPosts(100); // Get all posts (up to 100)
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  const comments = await getCommentsForPost(post.id);
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* JSON-LD Structured Data */}
      <BlogPostJsonLd 
        title={post.title}
        description={post.excerpt}
        imageUrl={post.featured_image}
        url={`https://www.pawpedia.xyz/blog/${post.slug}`}
        datePublished={post.published_at}
        authorName={post.author}
      />
      
      {/* Back to blog link */}
      <div className="mb-10">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition duration-150 ease-in-out font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Blog
        </Link>
      </div>
      
      {/* Blog post header */}
      <header className="mb-10 text-center">
        <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
          {post.category}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <span className="font-medium">{post.author}</span>
          <span>•</span>
          <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
        </div>
      </header>
      
      {/* Featured image */}
      <figure className="relative w-full h-[500px] mb-12 rounded-xl overflow-hidden shadow-xl">
        <Image
          src={post.featured_image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </figure>
      
      {/* Blog post content */}
      <article className="blog-content prose prose-lg max-w-none mx-auto mb-16">
        <ReactMarkdown>
          {post.content}
        </ReactMarkdown>
      </article>
      
      {/* Author bio */}
      <div className="bg-gray-50 rounded-xl p-8 mb-16 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
            {post.author.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">About {post.author}</h3>
            <p className="text-gray-600 mb-4">
              {post.author} is a passionate writer and dog enthusiast who loves sharing knowledge about canine care, behavior, and training.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-blue-600 hover:text-blue-800">Twitter</a>
              <a href="#" className="text-blue-600 hover:text-blue-800">Instagram</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comment section */}
      <div className="border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Comments</h2>
        <CommentSection postId={post.id} comments={comments} />
      </div>
    </div>
  );
} 