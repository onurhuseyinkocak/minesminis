-- TTS Audio Cache table
-- Stores ElevenLabs-generated audio URLs so the same text is never generated twice.
-- Saves free tier quota (~10k chars/month on ElevenLabs).
CREATE TABLE IF NOT EXISTS public.tts_cache (
  id SERIAL PRIMARY KEY,
  text_hash VARCHAR(32) UNIQUE NOT NULL,
  text VARCHAR(200) NOT NULL,
  audio_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by hash
CREATE INDEX IF NOT EXISTS idx_tts_cache_hash ON public.tts_cache(text_hash);

-- RLS
ALTER TABLE public.tts_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read tts_cache" ON public.tts_cache FOR SELECT USING (true);
CREATE POLICY "Service role can write tts_cache" ON public.tts_cache FOR ALL USING (true) WITH CHECK (true);

-- NOTE: Create a Supabase Storage bucket named 'audio' (public) via the dashboard:
--   Supabase Dashboard → Storage → New Bucket
--   Name: audio
--   Public bucket: YES
--   No file size limit needed (mp3s are small, typically 20-80 KB each)
