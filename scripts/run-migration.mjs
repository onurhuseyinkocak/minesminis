#!/usr/bin/env node
// Local migration script — runs DDL against the Supabase database via pg.
//
// Usage:
//   npm run db:migrate                          # uses DATABASE_URL from .env
//   DATABASE_URL=postgres://... node scripts/run-migration.mjs
//   node scripts/run-migration.mjs --dry        # only check table status
//
// The script reads DATABASE_URL from process.env or from the root .env file.

import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Load .env from project root
function loadEnv() {
  try {
    const envPath = resolve(ROOT, '.env');
    const content = readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env not found — rely on environment
  }
}
loadEnv();

// Import pg from server/node_modules
const require = createRequire(resolve(ROOT, 'server', 'node_modules', '.package-lock.json'));
let pg;
try {
  pg = require('pg');
} catch {
  // Fallback: try global pg
  try {
    pg = (await import('pg')).default;
  } catch {
    console.error('ERROR: pg module not found. Run: cd server && npm install');
    process.exit(1);
  }
}

const REQUIRED_TABLES = [
  'activity_logs',
  'phonics_mastery',
  'classrooms',
  'classroom_students',
  'parent_children',
  'garden_plants',
];

const MIGRATION_SQL = `
-- Activity logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type text NOT NULL,
    title text NOT NULL,
    duration integer DEFAULT 0,
    accuracy integer,
    xp_earned integer DEFAULT 0,
    sound_id text,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='activity_logs' AND policyname='Users can read own logs') THEN
    CREATE POLICY "Users can read own logs" ON activity_logs FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='activity_logs' AND policyname='Users can insert own logs') THEN
    CREATE POLICY "Users can insert own logs" ON activity_logs FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Phonics mastery
CREATE TABLE IF NOT EXISTS phonics_mastery (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sound_id text NOT NULL,
    mastery integer DEFAULT 0,
    attempts integer DEFAULT 0,
    correct_attempts integer DEFAULT 0,
    last_practiced timestamptz DEFAULT now(),
    next_review timestamptz,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, sound_id)
);
CREATE INDEX IF NOT EXISTS idx_phonics_mastery_user ON phonics_mastery(user_id);
ALTER TABLE phonics_mastery ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='phonics_mastery' AND policyname='Allow all phonics_mastery') THEN
    CREATE POLICY "Allow all phonics_mastery" ON phonics_mastery FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Classrooms
CREATE TABLE IF NOT EXISTS classrooms (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name text NOT NULL,
    grade_level text,
    join_code text UNIQUE NOT NULL,
    phonics_group_assigned integer DEFAULT 1,
    created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_classrooms_teacher ON classrooms(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classrooms_code ON classrooms(join_code);
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='classrooms' AND policyname='Allow all classrooms') THEN
    CREATE POLICY "Allow all classrooms" ON classrooms FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Classroom students
CREATE TABLE IF NOT EXISTS classroom_students (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    classroom_id uuid NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    student_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at timestamptz DEFAULT now(),
    UNIQUE(classroom_id, student_id)
);
CREATE INDEX IF NOT EXISTS idx_cs_classroom ON classroom_students(classroom_id);
CREATE INDEX IF NOT EXISTS idx_cs_student ON classroom_students(student_id);
ALTER TABLE classroom_students ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='classroom_students' AND policyname='Allow all classroom_students') THEN
    CREATE POLICY "Allow all classroom_students" ON classroom_students FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Parent-child links
CREATE TABLE IF NOT EXISTS parent_children (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    child_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    relationship text DEFAULT 'parent',
    created_at timestamptz DEFAULT now(),
    UNIQUE(parent_id, child_id)
);
CREATE INDEX IF NOT EXISTS idx_pc_parent ON parent_children(parent_id);
ALTER TABLE parent_children ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='parent_children' AND policyname='Allow all parent_children') THEN
    CREATE POLICY "Allow all parent_children" ON parent_children FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Garden plants
CREATE TABLE IF NOT EXISTS garden_plants (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sound_id text NOT NULL,
    stage text DEFAULT 'seed',
    mastery integer DEFAULT 0,
    water_drops integer DEFAULT 0,
    last_watered timestamptz,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, sound_id)
);
CREATE INDEX IF NOT EXISTS idx_garden_user ON garden_plants(user_id);
ALTER TABLE garden_plants ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='garden_plants' AND policyname='Allow all garden_plants') THEN
    CREATE POLICY "Allow all garden_plants" ON garden_plants FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
`;

async function main() {
  const isDry = process.argv.includes('--dry');
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('ERROR: DATABASE_URL is not set.');
    console.error('');
    console.error('Set it in your .env file or pass it as an environment variable:');
    console.error('  DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres');
    console.error('');
    console.error('You can find the connection string in Supabase Dashboard > Project Settings > Database.');
    console.error('');
    console.error('Alternatively, copy the SQL below and run it in the Supabase SQL Editor:');
    console.error('  https://supabase.com/dashboard/project/sblwqplagirgiroekotp/sql');
    console.error('');
    console.log('--- MIGRATION SQL ---');
    console.log(MIGRATION_SQL.trim());
    console.log('--- END SQL ---');
    process.exit(1);
  }

  const { Pool } = pg;
  const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // Check existing tables
    console.log('Checking existing tables...\n');
    const { rows } = await pool.query(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = ANY($1)`,
      [REQUIRED_TABLES]
    );
    const existing = new Set(rows.map(r => r.tablename));

    for (const t of REQUIRED_TABLES) {
      const status = existing.has(t) ? 'EXISTS' : 'MISSING';
      console.log(`  ${status.padEnd(8)} ${t}`);
    }

    const missing = REQUIRED_TABLES.filter(t => !existing.has(t));

    if (missing.length === 0) {
      console.log('\nAll tables already exist. No migration needed.');
      await pool.end();
      return;
    }

    console.log(`\n${missing.length} table(s) need creation: ${missing.join(', ')}`);

    if (isDry) {
      console.log('\n--dry mode: not executing SQL. Remove --dry to apply.');
      await pool.end();
      return;
    }

    console.log('\nRunning migration SQL...');
    await pool.query(MIGRATION_SQL);
    console.log('Migration SQL executed successfully.');

    // Verify
    const { rows: afterRows } = await pool.query(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = ANY($1)`,
      [REQUIRED_TABLES]
    );
    const afterExisting = new Set(afterRows.map(r => r.tablename));

    console.log('\nVerification:');
    let allGood = true;
    for (const t of REQUIRED_TABLES) {
      const ok = afterExisting.has(t);
      if (!ok) allGood = false;
      console.log(`  ${ok ? 'OK    ' : 'FAIL  '} ${t}`);
    }

    if (allGood) {
      console.log('\nAll tables created successfully!');
    } else {
      console.error('\nSome tables failed to create. Check errors above.');
      process.exitCode = 1;
    }

    await pool.end();
  } catch (err) {
    console.error('Migration failed:', err.message);
    await pool.end().catch(() => {});
    process.exit(1);
  }
}

main();
