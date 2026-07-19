import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

// Password is from .env (Garankfc@#1397445)
// Supabase host pattern: aws-0-ap-southeast-1.pooler.supabase.com
const dbUrl = "postgresql://postgres.yrrfkdnwjwbwhecgkzps:Garankfc%40%231397445@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres";

async function runSQL() {
  const client = new Client({
    connectionString: dbUrl,
  });

  try {
    await client.connect();
    console.log('Connected to Supabase DB');
    
    // Đọc nội dung file api_optimization.sql
    const sqlPath = path.resolve('C:/Users/09125/.gemini/antigravity/brain/d01f10e9-d835-459a-ad23-af38b3e4dddb/api_optimization.sql');
    const sqlStr = fs.readFileSync(sqlPath, 'utf8');

    await client.query(sqlStr);
    console.log('API Optimization RPCs created successfully!');

  } catch (err) {
    console.error('Failed to run sql query:', err.message);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

runSQL();
