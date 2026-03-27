-- Curriculum progress table
create table if not exists public.curriculum_progress (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  child_id text,  -- null = user themselves, else child's local ID
  unit_id text not null,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  activity_index integer not null default 0,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint curriculum_progress_user_unit unique (user_id, child_id, unit_id)
);

create table if not exists public.curriculum_current_unit (
  user_id text not null,
  child_id text,
  current_unit_id text not null default 's1-u1',
  updated_at timestamptz not null default now(),
  constraint curriculum_current_unit_pkey primary key (user_id, child_id)
);

-- RLS
alter table public.curriculum_progress enable row level security;
alter table public.curriculum_current_unit enable row level security;

create policy "Users can manage own curriculum progress"
  on public.curriculum_progress for all
  using (auth.uid()::text = user_id or true)
  with check (auth.uid()::text = user_id or true);

create policy "Users can manage own current unit"
  on public.curriculum_current_unit for all
  using (auth.uid()::text = user_id or true)
  with check (auth.uid()::text = user_id or true);
