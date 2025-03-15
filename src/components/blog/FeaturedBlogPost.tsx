import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/services/blogService';
import { formatDate } from '@/utils/dateUtils';

interface FeaturedBlogPostProps {
  post: BlogPost;
}

export default function FeaturedBlogPost({ post }: FeaturedBlogPostProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl">
      <div className="md:flex">
        <div className="md:flex-shrink-0 relative h-72 md:h-auto md:w-1/2">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-sm font-bold px-4 py-1 m-4 rounded-full">
            {post.category}
          </div>
        </div>
        <div className="p-8 md:w-1/2 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 hover:text-blue-600 transition-colors">
              <Link href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            <div className="flex items-center text-gray-500 mb-4">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {post.author}
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(post.published_at)}
              </span>
            </div>
            <p className="text-gray-600 text-lg">
              {post.excerpt}
            </p>
          </div>
          <div className="mt-6">
            <Link 
              href={`/blog/${post.slug}`} 
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition-colors"
            >
              Read Full Article
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 