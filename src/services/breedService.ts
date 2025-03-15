import supabase from '@/utils/supabase';

// Define the breed data interface
export interface BreedData {
  description: string;
  temperament: string;
  lifeSpan: string;
  weight: string;
  height: string;
  group: string;
  origin: string;
  history: string;
  funFacts: string[];
  trainingTips: string[];
  characteristics: {
    name: string;
    value: number;
  }[];
  careInfo: {
    title: string;
    content: string;
  }[];
}

// Define the cache record interface
interface BreedCacheRecord {
  id?: number;
  breed_name: string;
  data: BreedData;
  created_at?: string;
  expires_at: string;
}

/**
 * Cache breed data in local storage as a fallback
 * @param breedName The name of the breed
 * @param breedData The breed data to cache
 * @param expirationMonths Number of months until the cache expires
 */
function cacheBreedDataLocally(
  breedName: string,
  breedData: BreedData,
  expirationMonths: number = 6
): void {
  try {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(now.getMonth() + expirationMonths);
    
    const cacheItem = {
      data: breedData,
      expires_at: expiresAt.toISOString()
    };
    
    localStorage.setItem(`breed_cache_${breedName}`, JSON.stringify(cacheItem));
    console.log(`Cached data for ${breedName} in local storage until ${expiresAt.toISOString()}`);
  } catch (error) {
    console.error('Error caching breed data locally:', error);
  }
}

/**
 * Get cached breed data from local storage
 * @param breedName The name of the breed
 * @returns The cached breed data or null if not found or expired
 */
function getCachedBreedDataLocally(breedName: string): BreedData | null {
  try {
    const cacheItem = localStorage.getItem(`breed_cache_${breedName}`);
    
    if (!cacheItem) {
      return null;
    }
    
    const { data, expires_at } = JSON.parse(cacheItem);
    const now = new Date();
    const expiresAt = new Date(expires_at);
    
    if (now > expiresAt) {
      // Cache has expired, remove it
      localStorage.removeItem(`breed_cache_${breedName}`);
      return null;
    }
    
    return data as BreedData;
  } catch (error) {
    console.error('Error getting cached breed data from local storage:', error);
    return null;
  }
}

/**
 * Get cached breed data from Supabase
 * @param breedName The name of the breed
 * @returns The cached breed data or null if not found or expired
 */
export async function getCachedBreedData(breedName: string): Promise<BreedData | null> {
  try {
    // First try to get from local storage (faster)
    const localData = typeof window !== 'undefined' ? getCachedBreedDataLocally(breedName) : null;
    
    if (localData) {
      console.log(`Local storage cache hit for ${breedName}`);
      return localData;
    }
    
    // Then try Supabase, but handle connection issues gracefully
    try {
      const now = new Date().toISOString();
      
      // Query the database for the breed data that hasn't expired
      const { data, error } = await supabase
        .from('breed_cache')
        .select('*')
        .eq('breed_name', breedName)
        .gt('expires_at', now)
        .single();
      
      if (error) {
        // If it's a connection error or table doesn't exist, log it but don't throw
        console.log(`Supabase cache error for ${breedName}:`, error.message);
        return null;
      }
      
      if (!data) {
        console.log(`No valid cache found for ${breedName}`);
        return null;
      }
      
      console.log(`Supabase cache hit for ${breedName}`);
      
      // Also cache in local storage for faster access next time
      if (typeof window !== 'undefined') {
        cacheBreedDataLocally(breedName, data.data as BreedData);
      }
      
      return data.data as BreedData;
    } catch (supabaseError) {
      // If Supabase is completely unavailable, just log and return null
      console.error('Supabase unavailable:', supabaseError);
      return null;
    }
  } catch (error) {
    console.error('Error getting cached breed data:', error);
    return null;
  }
}

/**
 * Cache breed data in Supabase
 * @param breedName The name of the breed
 * @param breedData The breed data to cache
 * @param expirationMonths Number of months until the cache expires (default: 6)
 * @returns True if caching was successful, false otherwise
 */
export async function cacheBreedData(
  breedName: string, 
  breedData: BreedData, 
  expirationMonths: number = 6
): Promise<boolean> {
  // Always cache locally as a fallback
  if (typeof window !== 'undefined') {
    cacheBreedDataLocally(breedName, breedData, expirationMonths);
  }
  
  try {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(now.getMonth() + expirationMonths);
    
    // Try to cache in Supabase, but don't fail if Supabase is unavailable
    try {
      // Check if we already have a record for this breed
      const { data: existingData, error: queryError } = await supabase
        .from('breed_cache')
        .select('id')
        .eq('breed_name', breedName)
        .single();
      
      if (queryError && queryError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.warn('Error checking for existing breed data:', queryError.message);
        // Continue with insert as fallback
      }
      
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
        console.warn('Error caching breed data in Supabase:', result.error.message);
        console.log('Data is still cached locally');
        return true; // Return true because we have local cache
      }
      
      console.log(`Successfully cached data for ${breedName} until ${expiresAt.toISOString()}`);
      return true;
    } catch (supabaseError) {
      // If Supabase is completely unavailable, just log and return true (we have local cache)
      console.warn('Supabase unavailable for caching, using local storage only:', supabaseError);
      return true;
    }
  } catch (error) {
    // Properly log the error with more details
    if (error instanceof Error) {
      console.error('Error caching breed data:', error.message, error.stack);
    } else {
      console.error('Error caching breed data:', error);
    }
    return false;
  }
}

/**
 * Clean up expired cache entries
 * @returns Number of deleted entries
 */
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