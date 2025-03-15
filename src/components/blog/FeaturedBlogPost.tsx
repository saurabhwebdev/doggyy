import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/services/blogService';
import { formatDate } from '@/utils/dateUtils';

interface FeaturedBlogPostProps {
  post: BlogPost;
}

export default function FeaturedBlogPost({ post }: FeaturedBlogPostProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:flex-shrink-0 relative h-64 md:h-auto md:w-1/2">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="p-8 md:w-1/2">
          <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">
            {post.category}
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-gray-800">
            {post.title}
          </h2>
          <p className="mt-2 text-gray-500">
            By {post.author} • {formatDate(post.published_at)}
          </p>
          <p className="mt-4 text-gray-600">
            {post.excerpt}
          </p>
          <div className="mt-6">
            <Link 
              href={`/blog/${post.slug}`} 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition-colors"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 