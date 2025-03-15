-- Create breed_cache table
CREATE TABLE IF NOT EXISTS breed_cache (
  id BIGSERIAL PRIMARY KEY,
  breed_name TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create index on breed_name for faster lookups
CREATE INDEX IF NOT EXISTS breed_cache_breed_name_idx ON breed_cache (breed_name);

-- Create index on expires_at for cleanup operations
CREATE INDEX IF NOT EXISTS breed_cache_expires_at_idx ON breed_cache (expires_at);

-- Add comment to table
COMMENT ON TABLE breed_cache IS 'Cached AI-generated breed information with 6-month expiration'; 