/**
 * This script cleans up expired cache entries from the Supabase database.
 * It can be run as a scheduled task (e.g., daily or weekly) to keep the database clean.
 * 
 * Usage:
 * npx ts-node src/scripts/cleanup-cache.ts
 */

import { cleanupExpiredCache } from '../services/breedService';

async function main() {
  console.log('Starting cache cleanup...');
  
  try {
    const deletedCount = await cleanupExpiredCache();
    console.log(`Successfully cleaned up ${deletedCount} expired cache entries.`);
  } catch (error) {
    console.error('Error cleaning up cache:', error);
    process.exit(1);
  }
  
  console.log('Cache cleanup completed.');
}

main(); 