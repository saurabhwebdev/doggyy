'use client';

import { useEffect, useState } from 'react';
import { ensureBreedCacheTable } from '@/utils/verifySupabaseTable';

/**
 * Client component that initializes Supabase tables on app load
 */
export default function SupabaseInitializer() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verify Supabase table structure on app initialization
    const initSupabase = async () => {
      try {
        await ensureBreedCacheTable();
        setInitialized(true);
      } catch (err) {
        console.error('Failed to verify Supabase tables:', err);
        setError('Failed to initialize database. Falling back to local storage only.');
        // Still mark as initialized so the app can continue
        setInitialized(true);
      }
    };

    initSupabase();
  }, []);

  // This component doesn't render anything visible
  // But we can use it to show initialization status in development
  if (process.env.NODE_ENV === 'development' && error) {
    return (
      <div className="fixed bottom-0 right-0 bg-yellow-100 text-yellow-800 p-2 text-xs rounded-tl-md z-50">
        {error}
      </div>
    );
  }

  return null;
} 