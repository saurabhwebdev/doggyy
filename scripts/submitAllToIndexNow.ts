/**
 * Script to submit all existing content to IndexNow
 * Run this script after deployment to help search engines discover all your content
 * 
 * Usage: 
 * npx ts-node scripts/submitAllToIndexNow.ts
 */

import { submitUrlsToIndexNow } from '../src/utils/indexNow';
import fs from 'fs';
import path from 'path';
import { getAllBlogPosts } from '../src/services/blogService';
import breeds from '../breeds.json';

// Maximum number of URLs to submit in a single batch
const BATCH_SIZE = 100;

async function getAllUrls(): Promise<string[]> {
  const urls: string[] = [];
  
  // Add static pages
  urls.push('/');
  urls.push('/about');
  urls.push('/contact');
  urls.push('/blog');
  urls.push('/breeds');
  urls.push('/quiz');
  urls.push('/sitemap.xml');
  
  // Add all breed pages
  const breedList = Array.isArray(breeds) ? breeds : [];
  breedList.forEach((breed: any) => {
    if (breed.name) {
      const slug = breed.name.toLowerCase().replace(/\s+/g, '-');
      urls.push(`/breeds/${slug}`);
    }
  });
  
  try {
    // Add all blog posts
    const blogPosts = await getAllBlogPosts();
    blogPosts.forEach(post => {
      if (post.slug) {
        urls.push(`/blog/${post.slug}`);
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
  }
  
  return urls;
}

async function submitUrlsInBatches(urls: string[]): Promise<void> {
  console.log(`Preparing to submit ${urls.length} URLs to IndexNow...`);
  
  // Split URLs into batches
  const batches: string[][] = [];
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    batches.push(urls.slice(i, i + BATCH_SIZE));
  }
  
  console.log(`Split into ${batches.length} batches of up to ${BATCH_SIZE} URLs each.`);
  
  // Submit each batch
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Submitting batch ${i + 1}/${batches.length} (${batch.length} URLs)...`);
    
    try {
      const response = await submitUrlsToIndexNow(batch);
      
      if (response.ok) {
        console.log(`✅ Successfully submitted batch ${i + 1}/${batches.length}`);
      } else {
        console.error(`❌ Failed to submit batch ${i + 1}/${batches.length}:`, await response.text());
      }
      
      // Add a small delay between batches to avoid rate limiting
      if (i < batches.length - 1) {
        console.log('Waiting 2 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`Error submitting batch ${i + 1}/${batches.length}:`, error);
    }
  }
}

// Save URLs to a file for reference
function saveUrlsToFile(urls: string[]): void {
  const filePath = path.join(process.cwd(), 'indexnow-urls.txt');
  fs.writeFileSync(filePath, urls.join('\n'), 'utf8');
  console.log(`Saved ${urls.length} URLs to ${filePath}`);
}

// Main function
async function main(): Promise<void> {
  console.log('Starting IndexNow submission for all content...');
  
  try {
    // Get all URLs
    const urls = await getAllUrls();
    console.log(`Found ${urls.length} URLs to submit.`);
    
    // Save URLs to file for reference
    saveUrlsToFile(urls);
    
    // Submit URLs in batches
    await submitUrlsInBatches(urls);
    
    console.log('✅ Completed IndexNow submission process.');
  } catch (error) {
    console.error('❌ Error in IndexNow submission process:', error);
  }
}

// Run the script
main().catch(console.error); 