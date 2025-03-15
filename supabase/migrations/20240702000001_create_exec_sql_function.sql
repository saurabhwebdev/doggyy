-- Create a function to execute arbitrary SQL (with proper security restrictions)
CREATE OR REPLACE FUNCTION exec_sql(sql TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow CREATE TABLE, CREATE INDEX, and ALTER TABLE statements
  IF sql ~* '^(CREATE (TABLE|INDEX)|ALTER TABLE)' THEN
    EXECUTE sql;
    RETURN TRUE;
  ELSE
    RAISE EXCEPTION 'Unauthorized SQL operation. Only CREATE TABLE, CREATE INDEX, and ALTER TABLE are allowed.';
    RETURN FALSE;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error executing SQL: %', SQLERRM;
    RETURN FALSE;
END;
$$; 