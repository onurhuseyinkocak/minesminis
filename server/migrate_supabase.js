const { Client } = require('pg');

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNibHdxcGxhZ2lyZ2lyb2Vrb3RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTUzNzY3NiwiZXhwIjoyMDc3MTEzNjc2fQ.spZC8YAQ7K42eCpkl17kwQdrfeqVeEC9EgAlpl629v8';
const REF = 'sblwqplagirgiroekotp';
const REGIONS = ['eu-central-1','eu-west-1','eu-west-2','us-east-1','us-west-1','ap-southeast-1','ap-northeast-1'];

async function tryConnect(region) {
  const client = new Client({
    host: `aws-0-${region}.pooler.supabase.com`,
    port: 5432,
    database: 'postgres',
    user: `postgres.${REF}`,
    password: SERVICE_KEY,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });
  try {
    await client.connect();
    const res = await client.query('SELECT 1 as ok');
    await client.end();
    return region;
  } catch(e) {
    try { await client.end(); } catch {}
    return null;
  }
}

async function main() {
  console.log('Trying regions...');
  for (const r of REGIONS) {
    process.stdout.write(`  ${r}... `);
    const ok = await tryConnect(r);
    if (ok) { console.log('CONNECTED'); return ok; }
    else console.log('fail');
  }
  return null;
}

main().then(r => {
  if (r) console.log('SUCCESS region:', r);
  else console.log('All regions failed');
  process.exit(0);
});
