/**
 * Example implementation of IndexNow in your application
 * This file shows how you might integrate IndexNow with your app's functionality
 */

import { submitUrlToIndexNow, submitUrlsToIndexNow } from './indexNow';

/**
 * Example function that might be called after publishing a new blog post
 */
export async function notifySearchEnginesAboutNewBlogPost(slug: string): Promise<void> {
  try {
    const response = await submitUrlToIndexNow(`/blog/${slug}`);
    
    if (response.ok) {
      console.log(`Successfully notified search engines about new blog post: ${slug}`);
    } else {
      console.error(`Failed to notify search engines about new blog post: ${slug}`, await response.text());
    }
  } catch (error) {
    console.error('Error notifying search engines:', error);
  }
}

/**
 * Example function that might be called after updating multiple dog breed pages
 */
export async function notifySearchEnginesAboutUpdatedBreeds(breedSlugs: string[]): Promise<void> {
  try {
    const breedUrls = breedSlugs.map(slug => `/breeds/${slug}`);
    const response = await submitUrlsToIndexNow(breedUrls);
    
    if (response.ok) {
      console.log(`Successfully notified search engines about ${breedSlugs.length} updated breed pages`);
    } else {
      console.error(`Failed to notify search engines about updated breed pages`, await response.text());
    }
  } catch (error) {
    console.error('Error notifying search engines:', error);
  }
}

/**
 * Example function that might be called after your sitemap is updated
 * This is useful for notifying search engines about all your content at once
 */
export async function submitSitemapToIndexNow(): Promise<void> {
  try {
    // You can submit your sitemap URL to IndexNow
    const response = await submitUrlToIndexNow('/sitemap.xml');
    
    if (response.ok) {
      console.log('Successfully notified search engines about updated sitemap');
    } else {
      console.error('Failed to notify search engines about updated sitemap', await response.text());
    }
  } catch (error) {
    console.error('Error notifying search engines about sitemap:', error);
  }
} 