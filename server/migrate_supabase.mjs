import pg from 'pg';
const { Client } = pg;

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNibHdxcGxhZ2lyZ2lyb2Vrb3RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTUzNzY3NiwiZXhwIjoyMDc3MTEzNjc2fQ.spZC8YAQ7K42eCpkl17kwQdrfeqVeEC9EgAlpl629v8';
const REF = 'sblwqplagirgiroekotp';

// Try direct DB connection
const client = new Client({
  host: `db.${REF}.supabase.co`,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: SERVICE_KEY,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 8000,
});

try {
  await client.connect();
  console.log('Direct DB connection SUCCESS!');
  const r = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name");
  console.log('Tables:', r.rows.map(x => x.table_name));
  await client.end();
} catch(e) {
  console.log('Direct DB fail:', e.message);
}
