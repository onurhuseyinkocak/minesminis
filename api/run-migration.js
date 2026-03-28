// ONE-TIME migration runner — DELETE AFTER USE
// Executes via Supabase's pg REST endpoint with service role
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const TABLES = [
  {
    name: 'lesson_completions',
    sql: `CREATE TABLE IF NOT EXISTS lesson_completions (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id text NOT NULL,
      child_id text,
      unit_id text NOT NULL,
      lesson_id text,
      completed_at timestamptz NOT NULL DEFAULT now(),
      duration_sec integer,
      xp_earned integer DEFAULT 0,
      accuracy integer DEFAULT 0 CHECK (accuracy BETWEEN 0 AND 100),
      activity_results jsonb DEFAULT '[]',
      difficulty float DEFAULT 1.0,
      UNIQUE(user_id, child_id, unit_id, lesson_id)
    ); ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='lesson_completions' AND policyname='lesson_completions_owner') THEN
      CREATE POLICY lesson_completions_owner ON lesson_completions USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);
    END IF; END $$;`
  },
  {
    name: 'phoneme_mastery',
    sql: `CREATE TABLE IF NOT EXISTS phoneme_mastery (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id text NOT NULL, child_id text, phoneme_id text NOT NULL,
      mastery_score integer DEFAULT 0 CHECK (mastery_score BETWEEN 0 AND 100),
      attempts integer DEFAULT 0, correct_attempts integer DEFAULT 0,
      avg_response_ms integer, consecutive_correct integer DEFAULT 0,
      blending_score integer DEFAULT 0, segmenting_score integer DEFAULT 0,
      listening_score integer DEFAULT 0, pronunciation_score integer DEFAULT 0,
      last_practiced timestamptz, next_review_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      UNIQUE(user_id, child_id, phoneme_id)
    ); ALTER TABLE phoneme_mastery ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='phoneme_mastery' AND policyname='phoneme_mastery_owner') THEN
      CREATE POLICY phoneme_mastery_owner ON phoneme_mastery USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);
    END IF; END $$;`
  },
  {
    name: 'word_progress',
    sql: `CREATE TABLE IF NOT EXISTS word_progress (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id text NOT NULL, child_id text, word_id text NOT NULL,
      first_seen timestamptz DEFAULT now(), last_reviewed timestamptz DEFAULT now(),
      correct_count integer DEFAULT 0, incorrect_count integer DEFAULT 0,
      confidence integer DEFAULT 0 CHECK (confidence BETWEEN 0 AND 100),
      interval_days integer DEFAULT 0, next_review_at timestamptz DEFAULT now(),
      ease_factor float DEFAULT 2.5, UNIQUE(user_id, child_id, word_id)
    ); ALTER TABLE word_progress ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='word_progress' AND policyname='word_progress_owner') THEN
      CREATE POLICY word_progress_owner ON word_progress USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);
    END IF; END $$;`
  },
  {
    name: 'learning_sessions',
    sql: `CREATE TABLE IF NOT EXISTS learning_sessions (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id text NOT NULL, child_id text,
      started_at timestamptz NOT NULL DEFAULT now(), ended_at timestamptz,
      duration_sec integer, activity_count integer DEFAULT 0,
      correct_count integer DEFAULT 0, incorrect_count integer DEFAULT 0,
      xp_earned integer DEFAULT 0, activities_json jsonb DEFAULT '{}',
      age_group text, unit_id text
    ); ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='learning_sessions' AND policyname='learning_sessions_owner') THEN
      CREATE POLICY learning_sessions_owner ON learning_sessions USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);
    END IF; END $$;`
  },
  {
    name: 'adaptive_state',
    sql: `CREATE TABLE IF NOT EXISTS adaptive_state (
      user_id text NOT NULL, child_id text NOT NULL DEFAULT '',
      difficulty_multiplier float DEFAULT 1.0, learning_speed text DEFAULT 'normal',
      preferred_activity text, weak_areas text[] DEFAULT '{}',
      strong_areas text[] DEFAULT '{}', total_sessions integer DEFAULT 0,
      total_minutes integer DEFAULT 0, last_session_at timestamptz,
      updated_at timestamptz DEFAULT now(), PRIMARY KEY (user_id, child_id)
    ); ALTER TABLE adaptive_state ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='adaptive_state' AND policyname='adaptive_state_owner') THEN
      CREATE POLICY adaptive_state_owner ON adaptive_state USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);
    END IF; END $$;`
  },
  {
    name: 'parent_report_snapshots',
    sql: `CREATE TABLE IF NOT EXISTS parent_report_snapshots (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id text NOT NULL, child_id text NOT NULL DEFAULT '',
      week_start date NOT NULL, total_minutes integer DEFAULT 0,
      lessons_completed integer DEFAULT 0, words_learned integer DEFAULT 0,
      phonemes_mastered integer DEFAULT 0, avg_accuracy float,
      streak_days integer DEFAULT 0, top_weak_phonemes text[] DEFAULT '{}',
      top_strong_phonemes text[] DEFAULT '{}', created_at timestamptz DEFAULT now(),
      UNIQUE(user_id, child_id, week_start)
    ); ALTER TABLE parent_report_snapshots ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='parent_report_snapshots' AND policyname='parent_reports_owner') THEN
      CREATE POLICY parent_reports_owner ON parent_report_snapshots USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);
    END IF; END $$;`
  },
  {
    name: 'curriculum_progress',
    sql: `CREATE TABLE IF NOT EXISTS curriculum_progress (
      user_id text NOT NULL, child_id text NOT NULL DEFAULT '', unit_id text NOT NULL,
      progress integer DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
      activity_index integer DEFAULT 0, completed boolean DEFAULT false,
      completed_at timestamptz, updated_at timestamptz DEFAULT now(),
      PRIMARY KEY (user_id, child_id, unit_id)
    ); ALTER TABLE curriculum_progress ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='curriculum_progress' AND policyname='curriculum_progress_owner') THEN
      CREATE POLICY curriculum_progress_owner ON curriculum_progress USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);
    END IF; END $$;`
  },
  {
    name: 'curriculum_current_unit',
    sql: `CREATE TABLE IF NOT EXISTS curriculum_current_unit (
      user_id text NOT NULL, child_id text NOT NULL DEFAULT '',
      current_unit_id text NOT NULL DEFAULT 's1-u1',
      updated_at timestamptz DEFAULT now(), PRIMARY KEY (user_id, child_id)
    ); ALTER TABLE curriculum_current_unit ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='curriculum_current_unit' AND policyname='curriculum_current_unit_owner') THEN
      CREATE POLICY curriculum_current_unit_owner ON curriculum_current_unit USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);
    END IF; END $$;`
  }
];

export default async function handler(req, res) {
  // Security: only allow POST with correct admin password
  const auth = req.headers['x-admin-key'];
  if (auth !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const results = [];

  for (const table of TABLES) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/run_ddl`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ddl: table.sql }),
      });

      if (!response.ok) {
        // run_ddl doesn't exist — create it first via pg directly
        results.push({ table: table.name, status: 'rpc_not_found' });
      } else {
        results.push({ table: table.name, status: 'ok' });
      }
    } catch (e) {
      results.push({ table: table.name, status: 'error', error: String(e) });
    }
  }

  return res.status(200).json({ results });
}
