import supabase from '@/utils/supabase';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  author: string;
  category: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
}

export interface BlogComment {
  id: number;
  post_id: number;
  author_name: string;
  author_email: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Get all blog posts
 * @param limit Number of posts to return (default: 10)
 * @param page Page number for pagination (default: 1)
 * @returns Array of blog posts
 */
export async function getAllBlogPosts(limit: number = 10, page: number = 1): Promise<BlogPost[]> {
  try {
    const offset = (page - 1) * limit;
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
    
    return data as BlogPost[];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Get a single blog post by slug
 * @param slug The slug of the blog post
 * @returns The blog post or null if not found
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error || !data) {
      console.error('Error fetching blog post:', error?.message);
      return null;
    }
    
    return data as BlogPost;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

/**
 * Get blog posts by category
 * @param category The category slug
 * @param limit Number of posts to return (default: 10)
 * @param page Page number for pagination (default: 1)
 * @returns Array of blog posts
 */
export async function getBlogPostsByCategory(category: string, limit: number = 10, page: number = 1): Promise<BlogPost[]> {
  try {
    const offset = (page - 1) * limit;
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', category)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error fetching blog posts by category:', error);
      return [];
    }
    
    return data as BlogPost[];
  } catch (error) {
    console.error('Error fetching blog posts by category:', error);
    return [];
  }
}

/**
 * Get all blog categories
 * @returns Array of blog categories
 */
export async function getAllBlogCategories(): Promise<BlogCategory[]> {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching blog categories:', error);
      return [];
    }
    
    return data as BlogCategory[];
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
}

/**
 * Get comments for a blog post
 * @param postId The ID of the blog post
 * @returns Array of approved comments
 */
export async function getCommentsForPost(postId: number): Promise<BlogComment[]> {
  try {
    const { data, error } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('post_id', postId)
      .eq('is_approved', true)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
    
    return data as BlogComment[];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

/**
 * Add a comment to a blog post
 * @param comment The comment to add
 * @returns True if the comment was added successfully, false otherwise
 */
export async function addCommentToPost(comment: Omit<BlogComment, 'id' | 'is_approved' | 'created_at' | 'updated_at'>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('blog_comments')
      .insert({
        post_id: comment.post_id,
        author_name: comment.author_name,
        author_email: comment.author_email,
        content: comment.content,
        is_approved: false // Comments require approval by default
      });
    
    if (error) {
      console.error('Error adding comment:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error adding comment:', error);
    return false;
  }
}

/**
 * Search blog posts
 * @param query The search query
 * @param limit Number of posts to return (default: 10)
 * @returns Array of matching blog posts
 */
export async function searchBlogPosts(query: string, limit: number = 10): Promise<BlogPost[]> {
  try {
    // This is a simple search implementation
    // For a more robust search, consider using Supabase's full-text search capabilities
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error searching blog posts:', error);
      return [];
    }
    
    return data as BlogPost[];
  } catch (error) {
    console.error('Error searching blog posts:', error);
    return [];
  }
}

/**
 * Get the total count of blog posts
 * @param category Optional category to filter by
 * @returns The total number of blog posts
 */
export async function getBlogPostCount(category?: string): Promise<number> {
  try {
    let query = supabase
      .from('blog_posts')
      .select('id', { count: 'exact' });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { count, error } = await query;
    
    if (error) {
      console.error('Error counting blog posts:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error counting blog posts:', error);
    return 0;
  }
}

/**
 * Get all blog posts without pagination (for sitemap generation)
 * @returns Array of all blog posts
 */
export async function getAllBlogPostsForSitemap(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all blog posts for sitemap:', error);
      return [];
    }
    
    return data as BlogPost[];
  } catch (error) {
    console.error('Error fetching all blog posts for sitemap:', error);
    return [];
  }
} 