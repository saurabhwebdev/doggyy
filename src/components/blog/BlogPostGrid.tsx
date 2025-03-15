'use client';

import { useState, useEffect } from 'react';
import { BlogPost } from '@/services/blogService';
import BlogPostCard from './BlogPostCard';
import { useInView } from 'react-intersection-observer';

interface BlogPostGridProps {
  initialPosts: BlogPost[];
  totalPosts: number;
  postsPerPage: number;
  currentPage: number;
}

export default function BlogPostGrid({ 
  initialPosts, 
  totalPosts, 
  postsPerPage, 
  currentPage 
}: BlogPostGridProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [page, setPage] = useState(currentPage);
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(
    initialPosts.length >= totalPosts || initialPosts.length < postsPerPage
  );
  
  // Set up intersection observer for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });
  
  // Load more posts when the load more element comes into view
  useEffect(() => {
    const loadMorePosts = async () => {
      if (inView && !loading && !allLoaded) {
        setLoading(true);
        
        try {
          const nextPage = page + 1;
          const response = await fetch(`/api/blog/posts?page=${nextPage}&limit=${postsPerPage}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch more posts');
          }
          
          const newPosts = await response.json();
          
          if (newPosts.length > 0) {
            // Filter out any posts that might already exist in the current posts array
            const existingPostIds = new Set(posts.map(post => post.id));
            const uniqueNewPosts = newPosts.filter(post => !existingPostIds.has(post.id));
            
            if (uniqueNewPosts.length > 0) {
              setPosts(prevPosts => [...prevPosts, ...uniqueNewPosts]);
            }
            setPage(nextPage);
          }
          
          // Check if we've loaded all posts
          if (newPosts.length < postsPerPage) {
            setAllLoaded(true);
          }
        } catch (error) {
          console.error('Error loading more posts:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadMorePosts();
  }, [inView, loading, allLoaded, page, postsPerPage, posts]);
  
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <BlogPostCard 
            key={`${post.id}-${index}`} 
            post={post} 
          />
        ))}
      </div>
      
      {!allLoaded && (
        <div 
          ref={ref} 
          className="flex justify-center items-center py-8"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse"></div>
              <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse delay-75"></div>
              <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse delay-150"></div>
              <span className="text-gray-600 ml-2">Loading more posts...</span>
            </div>
          ) : (
            <button 
              onClick={() => {}} 
              className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Scroll for more posts
            </button>
          )}
        </div>
      )}
      
      {allLoaded && posts.length > postsPerPage && (
        <div className="text-center py-4">
          <p className="text-gray-600">You've reached the end of the blog posts!</p>
        </div>
      )}
    </div>
  );
} 