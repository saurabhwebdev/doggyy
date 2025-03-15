import { MetadataRoute } from 'next';
import { getAllBlogPostsForSitemap, getAllBlogCategories } from '@/services/blogService';

// Set dynamic rendering to ensure fresh data on each request
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Get all breeds for sitemap
async function getAllBreeds() {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/list/all', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to fetch breeds');
    }
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error fetching breeds:', error);
    return {};
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
  
  // Create breed URLs for sitemap
  const breedUrls = allBreeds.map(breed => ({
    url: `https://www.pawpedia.xyz/breeds/${breed}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  // Fetch all blog posts from the database
  const blogPosts = await getAllBlogPostsForSitemap();
  
  // Create blog post URLs for sitemap
  const blogUrls = blogPosts.map(post => ({
    url: `https://www.pawpedia.xyz/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  
  // Fetch all blog categories from the database
  const blogCategories = await getAllBlogCategories();
  
  // Create blog category URLs for sitemap
  const categoryUrls = blogCategories.map(category => ({
    url: `https://www.pawpedia.xyz/blog/category/${category.slug}`,
    lastModified: new Date(category.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  
  // Static pages
  const staticPages = [
    {
      url: 'https://www.pawpedia.xyz',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: 'https://www.pawpedia.xyz/breeds',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: 'https://www.pawpedia.xyz/breed-finder',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: 'https://www.pawpedia.xyz/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: 'https://www.pawpedia.xyz/about',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: 'https://www.pawpedia.xyz/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];
  
  // Combine all URLs
  return [...staticPages, ...breedUrls, ...blogUrls, ...categoryUrls];
} 