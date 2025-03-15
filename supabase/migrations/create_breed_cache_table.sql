-- Create the breed_cache table if it doesn't exist
CREATE TABLE IF NOT EXISTS breed_cache (
  id SERIAL PRIMARY KEY,
  breed_name TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create an index on breed_name for faster lookups
CREATE INDEX IF NOT EXISTS breed_cache_breed_name_idx ON breed_cache(breed_name);

-- Create an index on expires_at for faster cleanup
CREATE INDEX IF NOT EXISTS breed_cache_expires_at_idx ON breed_cache(expires_at);

-- Create a function to create the table
CREATE OR REPLACE FUNCTION create_breed_cache_table()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create the table if it doesn't exist
  CREATE TABLE IF NOT EXISTS breed_cache (
    id SERIAL PRIMARY KEY,
    breed_name TEXT NOT NULL UNIQUE,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
  );
  
  -- Create indexes
  CREATE INDEX IF NOT EXISTS breed_cache_breed_name_idx ON breed_cache(breed_name);
  CREATE INDEX IF NOT EXISTS breed_cache_expires_at_idx ON breed_cache(expires_at);
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating breed_cache table: %', SQLERRM;
    RETURN FALSE;
END;
$$; 