import supabase from './supabase';

/**
 * Verify that the breed_cache table exists and has the correct structure
 */
export async function verifyBreedCacheTable(): Promise<boolean> {
  try {
    // Try to query the breed_cache table directly
    // If it exists, this will succeed; if not, it will fail with an error
    const { error } = await supabase
      .from('breed_cache')
      .select('count(*)')
      .limit(1)
      .single();
    
    if (!error) {
      console.log('breed_cache table exists');
      return true;
    }
    
    console.log('The breed_cache table does not exist or cannot be accessed:', error.message);
    
    // Try to create the table with a direct SQL query via stored procedure
    try {
      // First attempt: use the create_breed_cache_table function if it exists
      const { error: createError } = await supabase.rpc('create_breed_cache_table');
      
      if (!createError) {
        console.log('Successfully created breed_cache table via RPC');
        return true;
      }
      
      console.error('Error creating breed_cache table via RPC:', createError);
    } catch (rpcError) {
      console.error('RPC method failed:', rpcError);
    }
    
    // If we get here, we couldn't create the table
    console.error('Failed to create breed_cache table. Caching will not work.');
    return false;
  } catch (error) {
    console.error('Error verifying breed_cache table:', error);
    return false;
  }
}

/**
 * Call this function to verify the table structure
 */
export async function ensureBreedCacheTable(): Promise<void> {
  try {
    const tableExists = await verifyBreedCacheTable();
    
    if (!tableExists) {
      console.error('Failed to verify or create the breed_cache table. Caching will not work.');
    }
  } catch (error) {
    console.error('Error ensuring breed_cache table:', error);
  }
} 