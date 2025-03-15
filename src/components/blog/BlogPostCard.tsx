import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/services/blogService';
import { formatDate } from '@/utils/dateUtils';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-52">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
            {post.category}
          </div>
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {post.author}
          </span>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(post.published_at)}
          </span>
        </div>
        <Link href={`/blog/${post.slug}`} className="block">
          <h2 className="text-xl font-bold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
        </Link>
        <p className="mt-3 text-gray-600 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link 
            href={`/blog/${post.slug}`} 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            Read More
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
} 