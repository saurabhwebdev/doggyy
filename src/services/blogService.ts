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
    
    // Use fresh data with dynamic rendering set at the page level
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
 * Get the total count of blog posts
 * @returns Total number of blog posts
 */
export async function getBlogPostCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error fetching blog post count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error fetching blog post count:', error);
    return 0;
  }
}

/**
 * Get a single blog post by slug
 * @param slug The slug of the blog post
 * @returns The blog post or null if not found
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Use fresh data with dynamic rendering set at the page level
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
 * @param categorySlug The category slug
 * @param limit Number of posts to return (default: 10)
 * @param page Page number for pagination (default: 1)
 * @returns Array of blog posts
 */
export async function getBlogPostsByCategory(categorySlug: string, limit: number = 10, page: number = 1): Promise<BlogPost[]> {
  try {
    const offset = (page - 1) * limit;
    
    // First, convert the slug back to a category name
    // Get all categories
    const categories = await getAllBlogCategories();
    
    // Normalize the input slug for comparison
    const normalizedSlug = categorySlug.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    
    // Find the category with a case-insensitive comparison
    const category = categories.find(cat => 
      cat.slug.toLowerCase() === normalizedSlug || 
      cat.name.toLowerCase() === categorySlug.toLowerCase().replace(/-/g, ' ')
    );
    
    if (!category) {
      console.error(`Category with slug "${categorySlug}" not found`);
      return [];
    }
    
    // Use fresh data with dynamic rendering set at the page level
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', category.name)
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
    // Fetch unique categories from blog_posts table instead of blog_categories
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .order('category', { ascending: true });
    
    if (error) {
      console.error('Error fetching blog categories:', error);
      return [];
    }
    
    // Transform the data to match the BlogCategory interface
    // Create unique categories based on the category field
    const uniqueCategories = new Map();
    
    data.forEach(post => {
      if (post.category && !uniqueCategories.has(post.category)) {
        // Create a slug from the category name - handle spaces and special characters
        const slug = post.category.toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-')     // Replace spaces with hyphens
          .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
        
        uniqueCategories.set(post.category, {
          id: uniqueCategories.size + 1, // Generate a sequential ID
          name: post.category,
          slug: slug,
          description: `Posts about ${post.category}`,
          created_at: new Date().toISOString()
        });
      }
    });
    
    return Array.from(uniqueCategories.values()) as BlogCategory[];
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
    // Use fresh data with dynamic rendering set at the page level
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
 * Get related blog posts
 * @param postId The ID of the current blog post
 * @param category The category of the current blog post
 * @param limit Number of related posts to return (default: 3)
 * @returns Array of related blog posts
 */
export async function getRelatedBlogPosts(postId: number, category: string, limit: number = 3): Promise<BlogPost[]> {
  try {
    // Use fresh data with dynamic rendering set at the page level
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', category)
      .neq('id', postId)
      .order('published_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching related blog posts:', error);
      return [];
    }
    
    return data as BlogPost[];
  } catch (error) {
    console.error('Error fetching related blog posts:', error);
    return [];
  }
}

/**
 * Get all blog posts for sitemap generation
 * @returns Array of all blog posts
 */
export async function getAllBlogPostsForSitemap(): Promise<BlogPost[]> {
  try {
    // Use fresh data with dynamic rendering set at the page level
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