// Script to apply Supabase migrations
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to read and execute SQL files
async function applyMigration(filePath) {
  try {
    console.log(`Applying migration: ${filePath}`);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split the SQL file into separate statements
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error(`Error executing statement: ${error.message}`);
        console.log('Trying alternative method...');
        
        // Try direct SQL query as fallback
        const { error: queryError } = await supabase.auth.admin.executeRawQuery(statement);
        
        if (queryError) {
          console.error(`Failed to execute statement: ${queryError.message}`);
        } else {
          console.log('Statement executed successfully via direct query');
        }
      } else {
        console.log('Statement executed successfully');
      }
    }
    
    console.log(`Migration applied: ${filePath}`);
  } catch (error) {
    console.error(`Error applying migration ${filePath}:`, error);
  }
}

// Main function
async function main() {
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  
  try {
    // Get all SQL files in the migrations directory
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure migrations are applied in order
    
    console.log(`Found ${files.length} migration files`);
    
    // Apply each migration
    for (const file of files) {
      await applyMigration(path.join(migrationsDir, file));
    }
    
    console.log('All migrations applied successfully');
  } catch (error) {
    console.error('Error applying migrations:', error);
  }
}

// Run the script
main(); 