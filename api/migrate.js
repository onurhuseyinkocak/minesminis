// Vercel Serverless Function — Database Migration Endpoint
// POST /api/migrate  (requires X-Admin-Password header)
// Checks which tables exist and provides status + SQL to run.
// If DATABASE_URL is set, runs the migration SQL directly via pg.

import { checkAdmin, getSupabase, getSupabaseUnavailableResponse } from './_lib/admin.js';

const REQUIRED_TABLES = [
  'activity_logs',
  'phonics_mastery',
  'classrooms',
  'classroom_students',
  'parent_children',
  'garden_plants',
];

const MIGRATION_SQL = `
-- Activity logs (replaces localStorage mimi_activity_log)
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

-- Phonics mastery (replaces localStorage mimi_phonics_mastery)
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

-- Classrooms (replaces localStorage mimi_classrooms_*)
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

-- Classroom students (junction table)
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

-- Parent-child links (replaces localStorage mimi_children_*)
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

-- Garden state (replaces localStorage mimi_garden_state)
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

export default async function handler(req, res) {
  // CORS — admin endpoint, restrict origin
  const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5000').split(',');
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  if (!checkAdmin(req)) return res.status(401).json({ error: 'Unauthorized. Provide X-Admin-Password header.' });

  const sb = getSupabase();
  if (!sb) return res.status(503).json(getSupabaseUnavailableResponse());

  const results = {};
  const dryRun = req.query.dry === '1' || req.body?.dryRun === true;

  try {
    // Step 1: Check which tables already exist via Supabase REST
    for (const table of REQUIRED_TABLES) {
      const { error } = await sb.from(table).select('id').limit(1);
      if (error && (error.code === 'PGRST204' || error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('relation'))) {
        results[table] = { exists: false, status: 'MISSING' };
      } else if (error) {
        // Table exists but some other error (e.g., column issue) — still exists
        results[table] = { exists: true, status: 'EXISTS (query error: ' + error.message + ')' };
      } else {
        results[table] = { exists: true, status: 'OK' };
      }
    }

    const missingTables = Object.entries(results).filter(([, v]) => !v.exists).map(([k]) => k);

    if (missingTables.length === 0) {
      return res.status(200).json({
        ok: true,
        message: 'All tables already exist. No migration needed.',
        tables: results,
      });
    }

    if (dryRun) {
      return res.status(200).json({
        ok: true,
        dryRun: true,
        message: `${missingTables.length} table(s) missing. Run without dryRun to apply migration.`,
        missingTables,
        tables: results,
        sql: MIGRATION_SQL.trim(),
      });
    }

    // Step 2: Try to run migration via DATABASE_URL (pg connection)
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      // Dynamic import pg — works if pg is in node_modules
      let pg;
      try {
        pg = await import('pg');
      } catch {
        return res.status(200).json({
          ok: false,
          message: 'DATABASE_URL is set but pg module is not available in this environment. Use the local script instead: npm run db:migrate',
          missingTables,
          tables: results,
          sql: MIGRATION_SQL.trim(),
        });
      }

      const Pool = pg.default?.Pool || pg.Pool;
      const pool = new Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
      try {
        await pool.query(MIGRATION_SQL);
        await pool.end();

        // Re-check tables
        const afterResults = {};
        for (const table of REQUIRED_TABLES) {
          const { error } = await sb.from(table).select('id').limit(1);
          afterResults[table] = {
            exists: !(error && (error.code === 'PGRST204' || error.code === '42P01' || error.message?.includes('does not exist'))),
            status: error ? 'ERROR: ' + error.message : 'OK',
          };
        }

        return res.status(200).json({
          ok: true,
          message: 'Migration executed successfully via DATABASE_URL.',
          tables: afterResults,
        });
      } catch (pgErr) {
        await pool.end().catch(() => {});
        return res.status(500).json({
          ok: false,
          message: 'Migration SQL failed: ' + pgErr.message,
          missingTables,
          tables: results,
        });
      }
    }

    // Step 3: No DATABASE_URL — return SQL for manual execution
    return res.status(200).json({
      ok: false,
      message: `${missingTables.length} table(s) need creation but DATABASE_URL is not set. Either set DATABASE_URL env var or run the SQL manually.`,
      missingTables,
      tables: results,
      sql: MIGRATION_SQL.trim(),
      instructions: [
        '1. Copy the SQL from the "sql" field above',
        '2. Go to the Supabase Dashboard SQL Editor for your project',
        '3. Paste and run in the SQL Editor',
        'Or: set DATABASE_URL env var and POST again',
        'Or: run locally with npm run db:migrate',
      ],
    });
  } catch (err) {
    return res.status(500).json({ error: 'Migration failed' });
  }
}
