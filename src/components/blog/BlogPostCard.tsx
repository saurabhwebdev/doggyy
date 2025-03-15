import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/services/blogService';
import { formatDate } from '@/utils/dateUtils';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image
          src={post.featured_image}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">
          {post.category}
        </div>
        <h2 className="mt-2 text-xl font-semibold text-gray-800 line-clamp-2">
          {post.title}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          By {post.author} • {formatDate(post.published_at)}
        </p>
        <p className="mt-3 text-gray-600 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="mt-4">
          <Link 
            href={`/blog/${post.slug}`} 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
} 