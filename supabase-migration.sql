-- MiniMinds v2 tables
-- Run this in Supabase SQL Editor

-- Slides
create table if not exists mm_slides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cover_kind text not null default 'rainbow',
  slide_count int not null default 0,
  level text not null default 'Easy',
  category text not null default '',
  slides_data jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- Videos
create table if not exists mm_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cover_kind text not null default 'abc',
  duration text not null default '',
  category text not null default '',
  youtube_url text not null default '',
  lyrics_en text not null default '',
  lyrics_tr text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- Songs
create table if not exists mm_songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cover_kind text not null default 'star',
  duration text not null default '',
  category text not null default '',
  audio_url text not null default '',
  lyrics jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- RLS: public read for published, admin full access
alter table mm_slides enable row level security;
alter table mm_videos enable row level security;
alter table mm_songs enable row level security;

-- Public can read published content
create policy "Public read published slides" on mm_slides for select using (published = true);
create policy "Public read published videos" on mm_videos for select using (published = true);
create policy "Public read published songs" on mm_songs for select using (published = true);

-- Anon can also insert/update/delete (simple admin via session password, no auth)
create policy "Anon manage slides" on mm_slides for all using (true) with check (true);
create policy "Anon manage videos" on mm_videos for all using (true) with check (true);
create policy "Anon manage songs" on mm_songs for all using (true) with check (true);
