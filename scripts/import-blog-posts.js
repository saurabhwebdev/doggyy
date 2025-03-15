// Script to import markdown blog posts from the file system into Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

// Debug environment variables
console.log('Environment variables:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set');
console.log('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Path to store the list of published articles
const publishedArticlesPath = path.join(__dirname, 'published-articles.json');

// Function to load the list of published articles
async function loadPublishedArticles() {
  try {
    // Always fetch the current list directly from Supabase
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug');
    
    if (error) {
      console.error('Error fetching published articles:', error);
      return [];
    }
    
    const publishedSlugs = data.map(post => post.slug);
    console.log(`Loaded ${publishedSlugs.length} published article slugs from Supabase`);
    
    // Update the local cache file for reference
    fs.writeFileSync(publishedArticlesPath, JSON.stringify(publishedSlugs, null, 2));
    
    return publishedSlugs;
  } catch (error) {
    console.error('Error loading published articles:', error);
    return [];
  }
}

// Function to update the list of published articles
function updatePublishedArticles(slug) {
  try {
    let publishedSlugs = [];
    if (fs.existsSync(publishedArticlesPath)) {
      const data = fs.readFileSync(publishedArticlesPath, 'utf8');
      publishedSlugs = JSON.parse(data);
    }
    
    if (!publishedSlugs.includes(slug)) {
      publishedSlugs.push(slug);
      fs.writeFileSync(publishedArticlesPath, JSON.stringify(publishedSlugs, null, 2));
    }
  } catch (error) {
    console.error('Error updating published articles list:', error);
  }
}

// Function to ensure category exists in the categories table
async function ensureCategoryExists(category) {
  try {
    // Check if category already exists in the blog_posts table
    const { data: existingPosts, error: queryError } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('category', category);
    
    if (queryError) {
      console.error(`Error checking for existing category ${category} in blog_posts:`, queryError);
      return null;
    }
    
    // If category exists in any blog post, we don't need to do anything else
    if (existingPosts && existingPosts.length > 0) {
      console.log(`Category already exists in blog_posts: ${category}`);
      return category;
    }
    
    // If we're adding a new category, just log it
    console.log(`Adding new category to blog_posts: ${category}`);
    return category;
  } catch (error) {
    console.error(`Error processing category ${category}:`, error);
    return category; // Return the category anyway to continue with the import
  }
}

// Function to get a dog image from the Dog CEO API
async function getDogImage(breed) {
  try {
    // Convert category or breed name to a format that might match the Dog CEO API
    // Remove "Dog " prefix if present and convert to lowercase
    let searchBreed = breed.replace(/dog\s+/i, '').toLowerCase();
    
    // Handle some common categories that might not directly map to Dog CEO breeds
    const breedMappings = {
      'dog legislation': 'husky',
      'dog breeds': 'retriever',
      'dog ownership': 'labrador',
      'dog activities': 'boxer',
      'dog health & safety': 'collie',
      'dog nutrition': 'poodle',
      'seasonal care': 'samoyed',
      'dog grooming': 'maltese',
      'dog safety': 'beagle'
    };
    
    if (breedMappings[searchBreed]) {
      searchBreed = breedMappings[searchBreed];
    }
    
    // Try to get a random image for the specific breed
    try {
      const response = await axios.get(`https://dog.ceo/api/breed/${searchBreed}/images/random`);
      if (response.data.status === 'success') {
        return response.data.message;
      }
    } catch (error) {
      console.log(`No specific breed found for ${searchBreed}, using random dog image instead`);
    }
    
    // Fallback to a random dog image
    const randomResponse = await axios.get('https://dog.ceo/api/breeds/image/random');
    return randomResponse.data.message;
  } catch (error) {
    console.error('Error fetching dog image:', error);
    // Return a default image URL if all else fails
    return 'https://images.dog.ceo/breeds/spaniel-blenheim/n02086646_2641.jpg';
  }
}

// Function to read markdown files from the blog posts directory
async function readMarkdownFiles() {
  const postsDir = path.join(__dirname, '..', 'src', 'app', 'blog', 'posts');
  console.log(`Looking for markdown files in: ${postsDir}`);
  
  try {
    // Check if directory exists
    if (!fs.existsSync(postsDir)) {
      console.error(`Directory not found: ${postsDir}`);
      return [];
    }
    
    // Get all markdown files
    const files = fs.readdirSync(postsDir)
      .filter(file => file.endsWith('.md'));
    
    console.log(`Found ${files.length} markdown files`);
    console.log('Files:', files);
    
    // Read each file and parse frontmatter and content
    const posts = [];
    for (const file of files) {
      const filePath = path.join(postsDir, file);
      console.log(`Processing file: ${filePath}`);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Parse frontmatter - updated regex to handle the actual format
      // This regex matches content between --- markers, including whitespace and quotes
      const frontmatterRegex = /^---\s*\n([\s\S]*?)\n\s*---\s*\n/;
      const match = content.match(frontmatterRegex);
      
      if (match) {
        console.log(`Frontmatter found in ${file}`);
        const frontmatter = match[1];
        const markdownContent = content.slice(match[0].length);
        
        // Parse frontmatter into key-value pairs
        const metadata = {};
        frontmatter.split('\n').forEach(line => {
          // Skip empty lines
          if (!line.trim()) return;
          
          // Handle key-value pairs with quotes
          const keyValueMatch = line.match(/^([^:]+):\s*"?([^"]*)"?\s*$/);
          if (keyValueMatch) {
            const [_, key, value] = keyValueMatch;
            metadata[key.trim()] = value.trim();
          }
        });
        
        console.log(`Metadata for ${file}:`, metadata);
        
        // Check if all required fields are present
        // Adjust field names to match the frontmatter in the markdown files
        const fieldMapping = {
          'title': 'title',
          'slug': 'slug',
          'excerpt': 'excerpt',
          'coverImage': 'coverImage',
          'author': 'author',
          'category': 'category',
          'date': 'date'
        };
        
        const missingFields = [];
        for (const [requiredField, frontmatterField] of Object.entries(fieldMapping)) {
          if (!metadata[frontmatterField]) {
            missingFields.push(requiredField);
          }
        }
        
        if (missingFields.length > 0) {
          console.error(`Missing required fields in ${file}: ${missingFields.join(', ')}`);
          continue;
        }
        
        posts.push({
          title: metadata.title,
          slug: metadata.slug,
          content: markdownContent,
          excerpt: metadata.excerpt,
          featured_image: metadata.coverImage,
          author: metadata.author,
          category: metadata.category,
          published_at: metadata.date
        });
        
        console.log(`Added post: ${metadata.title}`);
      } else {
        console.error(`No frontmatter found in ${file}`);
        // Print the first few characters to debug
        console.error(`File starts with: ${content.substring(0, 100)}`);
      }
    }
    
    console.log(`Parsed ${posts.length} posts`);
    return posts;
  } catch (error) {
    console.error('Error reading markdown files:', error);
    console.error(error.stack);
    return [];
  }
}

// Add this function to notify IndexNow about new blog posts
async function notifyIndexNowAboutNewPost(slug) {
  try {
    const siteUrl = 'https://www.pawpedia.xyz';
    const apiKey = 'f468ab61f6c644ada744fbdc836a2b60';
    const fullUrl = `${siteUrl}/blog/${slug}`;
    
    console.log(`Notifying IndexNow about new blog post: ${fullUrl}`);
    
    const response = await axios.get(`https://www.bing.com/indexnow?url=${encodeURIComponent(fullUrl)}&key=${apiKey}`);
    
    if (response.status === 200) {
      console.log(`✅ Successfully notified IndexNow about: ${slug}`);
    } else {
      console.log(`❌ Failed to notify IndexNow about: ${slug}. Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error notifying IndexNow about ${slug}:`, error);
  }
}

// Function to import posts into Supabase
async function importPostsToSupabase(posts, publishedSlugs) {
  if (posts.length === 0) {
    console.log('No posts to import');
    return;
  }
  
  console.log(`Importing ${posts.length} posts to Supabase...`);
  
  for (const post of posts) {
    try {
      // Check if post is already in the published list
      if (publishedSlugs.includes(post.slug)) {
        console.log(`Skipping already published post: ${post.title} (${post.slug})`);
        continue;
      }
      
      // Double-check directly with the database to ensure we're not duplicating
      const { data: existingPost, error: queryError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', post.slug)
        .single();
      
      if (queryError && queryError.code !== 'PGRST116') {
        console.error(`Error checking for existing post ${post.slug}:`, queryError);
        continue;
      }
      
      if (existingPost) {
        console.log(`Post already exists in database: ${post.title} (${post.slug})`);
        // Add to our local tracking to avoid future checks
        if (!publishedSlugs.includes(post.slug)) {
          updatePublishedArticles(post.slug);
        }
        continue;
      }
      
      // Ensure category exists by checking blog_posts table
      await ensureCategoryExists(post.category);
      
      // Get a dog image from the Dog CEO API
      const dogImage = await getDogImage(post.category);
      console.log(`Using dog image: ${dogImage} for post: ${post.title}`);
      
      // Insert new post
      console.log(`Creating new post: ${post.title} (${post.slug})`);
      const { error } = await supabase
        .from('blog_posts')
        .insert([{
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          featured_image: dogImage, // Use the Dog CEO API image
          author: post.author,
          category: post.category,
          published_at: post.published_at,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.error(`Error creating post ${post.slug}:`, error);
      } else {
        console.log(`✅ Post created: ${post.title}`);
        // Add to published list
        updatePublishedArticles(post.slug);
        
        // Notify IndexNow about the new blog post
        await notifyIndexNowAboutNewPost(post.slug);
      }
    } catch (error) {
      console.error(`Error processing post ${post.slug}:`, error);
      console.error(error.stack);
    }
  }
}

// Main function
async function main() {
  try {
    // Load the list of published articles directly from Supabase
    const publishedSlugs = await loadPublishedArticles();
    
    // Read markdown files
    const posts = await readMarkdownFiles();
    
    // Count how many new posts we'll be importing
    const newPosts = posts.filter(post => !publishedSlugs.includes(post.slug));
    console.log(`Found ${newPosts.length} new posts to import out of ${posts.length} total posts`);
    
    // Import posts to Supabase
    await importPostsToSupabase(posts, publishedSlugs);
    
    // If we imported any new posts, also notify IndexNow about the sitemap update
    if (newPosts.length > 0) {
      console.log('Notifying IndexNow about updated sitemap...');
      await notifyIndexNowAboutNewPost('sitemap.xml');
    }
    
    console.log('Import completed successfully');
  } catch (error) {
    console.error('Error importing posts:', error);
    console.error(error.stack);
  }
}

// Run the script
main().catch(error => {
  console.error('Unhandled error:', error);
  console.error(error.stack);
}); 