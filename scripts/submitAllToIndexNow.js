/**
 * Script to submit all existing content to IndexNow
 * Run this script after deployment to help search engines discover all your content
 * 
 * Usage: 
 * node scripts/submitAllToIndexNow.js
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Your IndexNow API key
const API_KEY = 'f468ab61f6c644ada744fbdc836a2b60';

// Your website URL (update this with your actual domain when deployed)
const SITE_URL = 'https://www.pawpedia.xyz';

// Maximum number of URLs to submit in a single batch
const BATCH_SIZE = 100;

// Function to submit multiple URLs to IndexNow
async function submitUrlsToIndexNow(urls) {
  const fullUrls = urls.map(url => 
    url.startsWith('http') ? url : `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`
  );
  
  return fetch('https://www.bing.com/indexnow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      host: new URL(SITE_URL).hostname,
      key: API_KEY,
      urlList: fullUrls,
    }),
  });
}

// Function to get all URLs from your sitemap
async function getUrlsFromSitemap() {
  try {
    // Try to fetch the sitemap
    const response = await fetch(`${SITE_URL}/sitemap.xml`);
    const text = await response.text();
    
    // Extract URLs from sitemap
    const urls = [];
    const matches = text.match(/<loc>(.*?)<\/loc>/g) || [];
    
    matches.forEach(match => {
      const url = match.replace('<loc>', '').replace('</loc>', '');
      // Convert full URLs to paths
      if (url.startsWith(SITE_URL)) {
        urls.push(url.replace(SITE_URL, ''));
      } else {
        urls.push(url);
      }
    });
    
    return urls;
  } catch (error) {
    console.error('Error fetching sitemap:', error);
    return [];
  }
}

// Function to get static URLs
function getStaticUrls() {
  return [
    '/',
    '/about',
    '/contact',
    '/blog',
    '/breeds',
    '/quiz',
    '/sitemap.xml'
  ];
}

async function submitUrlsInBatches(urls) {
  console.log(`Preparing to submit ${urls.length} URLs to IndexNow...`);
  
  // Split URLs into batches
  const batches = [];
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
function saveUrlsToFile(urls) {
  const filePath = path.join(process.cwd(), 'indexnow-urls.txt');
  fs.writeFileSync(filePath, urls.join('\n'), 'utf8');
  console.log(`Saved ${urls.length} URLs to ${filePath}`);
}

// Main function
async function main() {
  console.log('Starting IndexNow submission for all content...');
  
  try {
    // Get URLs from sitemap
    const sitemapUrls = await getUrlsFromSitemap();
    console.log(`Found ${sitemapUrls.length} URLs in sitemap.`);
    
    // Get static URLs
    const staticUrls = getStaticUrls();
    console.log(`Added ${staticUrls.length} static URLs.`);
    
    // Combine and deduplicate URLs
    const allUrls = [...new Set([...sitemapUrls, ...staticUrls])];
    console.log(`Total of ${allUrls.length} unique URLs to submit.`);
    
    // Save URLs to file for reference
    saveUrlsToFile(allUrls);
    
    // Submit URLs in batches
    await submitUrlsInBatches(allUrls);
    
    console.log('✅ Completed IndexNow submission process.');
  } catch (error) {
    console.error('❌ Error in IndexNow submission process:', error);
  }
}

// Run the script
main().catch(console.error); 