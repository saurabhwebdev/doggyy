import { MetadataRoute } from 'next';
import { getAllBlogPostsForSitemap, getAllBlogCategories } from '@/services/blogService';

// Get all breeds for sitemap
async function getAllBreeds() {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/list/all', { 
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    if (!response.ok) {
      console.error('Failed to fetch breeds for sitemap, using empty object');
      return {};
    }
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error fetching breeds for sitemap:', error);
    return {};
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Get all breeds
    const breedsObj = await getAllBreeds();
    
    // Convert the breeds object to a flat array of breed names
    let allBreeds: string[] = [];
    
    for (const [breed, subBreeds] of Object.entries(breedsObj)) {
      // Add the main breed
      allBreeds.push(breed);
      
      // Add sub-breeds if they exist
      if (Array.isArray(subBreeds) && subBreeds.length > 0) {
        subBreeds.forEach((subBreed: string) => {
          allBreeds.push(`${breed}-${subBreed}`);
        });
      }
    }
    
    // Create breed URLs for sitemap (limit to 1000 to avoid excessive size)
    const breedUrls = allBreeds.slice(0, 1000).map(breed => ({
      url: `https://www.pawpedia.xyz/breeds/${breed}`,
      lastModified: new Date().toISOString().split('T')[0], // Use YYYY-MM-DD format
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
    
    // Fetch all blog posts from the database
    const blogPosts = await getAllBlogPostsForSitemap();
    
    // Create blog post URLs for sitemap
    const blogUrls = blogPosts.map(post => ({
      url: `https://www.pawpedia.xyz/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at).toISOString().split('T')[0],
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
    
    // Fetch all blog categories from the database
    const blogCategories = await getAllBlogCategories();
    
    // Create blog category URLs for sitemap
    const categoryUrls = blogCategories.map(category => ({
      url: `https://www.pawpedia.xyz/blog/category/${category.slug}`,
      lastModified: new Date(category.created_at).toISOString().split('T')[0],
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
    
    // Static pages
    const staticPages = [
      {
        url: 'https://www.pawpedia.xyz',
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: 'https://www.pawpedia.xyz/breeds',
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: 'https://www.pawpedia.xyz/breed-finder',
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      {
        url: 'https://www.pawpedia.xyz/blog',
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: 'https://www.pawpedia.xyz/about',
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
      {
        url: 'https://www.pawpedia.xyz/contact',
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
    ];
    
    // Combine all URLs
    return [...staticPages, ...breedUrls, ...blogUrls, ...categoryUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return at least the static pages if there's an error
    return [
      {
        url: 'https://www.pawpedia.xyz',
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: 'https://www.pawpedia.xyz/breeds',
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: 'https://www.pawpedia.xyz/blog',
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
    ];
  }
} 