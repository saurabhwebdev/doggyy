'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { getAllBlogCategories } from '@/services/blogService';
import { BlogPost, BlogCategory } from '@/services/blogService';
import PostEditor from '@/components/admin/PostEditor';
import supabase from '@/utils/supabase';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const postId = parseInt(params.id);

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      router.push('/admin');
      return;
    }

    // Fetch post and categories
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch post by ID
        const { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', postId)
          .single();
        
        if (postError) {
          throw new Error(postError.message);
        }
        
        if (!postData) {
          throw new Error('Post not found');
        }
        
        setPost(postData as BlogPost);
        
        // Fetch categories
        const categoriesData = await getAllBlogCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load post data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, postId]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.push('/admin');
  };

  return (
    <AdminLayout
      title={post ? `Edit Post: ${post.title}` : 'Edit Post'}
      onLogout={handleLogout}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Return to Dashboard
          </button>
        </div>
      ) : post ? (
        <PostEditor 
          post={post}
          categories={categories}
          onCancel={() => router.push('/admin/dashboard')}
        />
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-sm text-yellow-700">Post not found</p>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Return to Dashboard
          </button>
        </div>
      )}
    </AdminLayout>
  );
} 