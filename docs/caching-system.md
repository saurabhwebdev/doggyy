# PawPedia Caching System Documentation

## Overview

PawPedia implements a caching system for AI-generated breed information to improve performance and reduce costs associated with API calls to the Gemini AI service. This document explains how the caching system works, how to set it up, and how to maintain it.

## How It Works

1. **Cache Check**: When a user visits a dog breed page, the system first checks if there's a valid (non-expired) cache entry in Supabase for that breed.

2. **Cache Hit**: If a valid cache exists, the data is retrieved from Supabase and displayed to the user. This is much faster than generating new content with the AI API.

3. **Cache Miss**: If no valid cache exists, the system calls the Gemini AI API to generate detailed breed information.

4. **Cache Storage**: After receiving the AI-generated content, it's stored in Supabase with a 6-month expiration date.

5. **Cache Expiration**: After 6 months, the cache entry expires and will be regenerated on the next request for that breed.

6. **Cache Cleanup**: A scheduled task can be run to remove expired cache entries from the database.

## Database Schema

The caching system uses a `breed_cache` table in Supabase with the following structure:

```sql
CREATE TABLE breed_cache (
  id BIGSERIAL PRIMARY KEY,
  breed_name TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);
```

- `id`: Unique identifier for the cache entry
- `breed_name`: The name of the dog breed (used as a lookup key)
- `data`: The cached breed information in JSON format
- `created_at`: When the cache entry was created
- `expires_at`: When the cache entry expires (6 months after creation)

## Implementation Details

### Cache Retrieval

When a user visits a breed page, the `getCachedBreedData` function is called to check for a valid cache entry:

```typescript
export async function getCachedBreedData(breedName: string): Promise<BreedData | null> {
  try {
    const now = new Date().toISOString();
    
    // Query the database for the breed data that hasn't expired
    const { data, error } = await supabase
      .from('breed_cache')
      .select('*')
      .eq('breed_name', breedName)
      .gt('expires_at', now)
      .single();
    
    if (error || !data) {
      console.log(`No valid cache found for ${breedName}:`, error?.message);
      return null;
    }
    
    console.log(`Cache hit for ${breedName}`);
    return data.data as BreedData;
  } catch (error) {
    console.error('Error getting cached breed data:', error);
    return null;
  }
}
```

### Cache Storage

After generating new breed information, the `cacheBreedData` function is called to store it in Supabase:

```typescript
export async function cacheBreedData(
  breedName: string, 
  breedData: BreedData, 
  expirationMonths: number = 6
): Promise<boolean> {
  try {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(now.getMonth() + expirationMonths);
    
    // Check if we already have a record for this breed
    const { data: existingData } = await supabase
      .from('breed_cache')
      .select('id')
      .eq('breed_name', breedName)
      .single();
    
    let result;
    
    if (existingData?.id) {
      // Update existing record
      result = await supabase
        .from('breed_cache')
        .update({
          data: breedData,
          expires_at: expiresAt.toISOString()
        })
        .eq('id', existingData.id);
    } else {
      // Insert new record
      result = await supabase
        .from('breed_cache')
        .insert({
          breed_name: breedName,
          data: breedData,
          expires_at: expiresAt.toISOString()
        });
    }
    
    if (result.error) {
      console.error('Error caching breed data:', result.error);
      return false;
    }
    
    console.log(`Successfully cached data for ${breedName} until ${expiresAt.toISOString()}`);
    return true;
  } catch (error) {
    console.error('Error caching breed data:', error);
    return false;
  }
}
```

### Cache Cleanup

To keep the database clean, a cleanup script is provided to remove expired cache entries:

```typescript
export async function cleanupExpiredCache(): Promise<number> {
  try {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('breed_cache')
      .delete()
      .lt('expires_at', now)
      .select('id');
    
    if (error) {
      console.error('Error cleaning up expired cache:', error);
      return 0;
    }
    
    return data?.length || 0;
  } catch (error) {
    console.error('Error cleaning up expired cache:', error);
    return 0;
  }
}
```

## Setup Instructions

1. **Create Supabase Project**:
   - Sign up for a Supabase account at [supabase.com](https://supabase.com)
   - Create a new project
   - Get your Supabase URL and anon key from the project settings

2. **Set Up Environment Variables**:
   - Create a `.env.local` file in the root directory
   - Add the following variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
     NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
     ```

3. **Create Database Table**:
   - Go to the SQL Editor in your Supabase dashboard
   - Run the SQL script from `supabase/migrations/20240701000000_create_breed_cache_table.sql`

## Maintenance

### Scheduled Cleanup

To keep the database clean, you should run the cleanup script periodically (e.g., weekly):

```bash
npm run cleanup-cache
```

This can be automated using a cron job or a scheduled task in your deployment environment.

### Monitoring

You can monitor the cache hit rate and performance by checking the logs. The system logs when:
- A cache hit occurs: `Cache hit for [breed]`
- A cache miss occurs: `No valid cache found for [breed]`
- A new cache entry is created: `Successfully cached data for [breed] until [date]`
- Cache cleanup occurs: `Successfully cleaned up [count] expired cache entries`

## Benefits

1. **Improved Performance**: AI-generated content is served instantly from the cache instead of waiting for the AI API to generate it.

2. **Reduced Costs**: Fewer API calls to the Gemini AI service means lower costs.

3. **Better User Experience**: Users get faster page loads and consistent content.

4. **Reduced API Rate Limiting**: Helps avoid hitting rate limits on the AI API.

5. **Content Consistency**: Users see the same content for a breed for the 6-month cache period, ensuring consistency.

## Conclusion

The caching system significantly improves the performance and cost-effectiveness of PawPedia by reducing the number of AI API calls while still providing up-to-date breed information to users. 