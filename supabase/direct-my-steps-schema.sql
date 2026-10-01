-- Direct My Steps: private Agent First faith-memory schema
create extension if not exists pgcrypto;

create table if not exists public.user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.prayer_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  status text not null default 'Still carrying' check (status in ('Still carrying','Answered','Changed','Released')),
  summary text,
  scripture_reference text,
  follow_up_at timestamptz,
  private boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.prayer_events (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references public.prayer_threads(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null default 'update',
  body text not null,
  scripture_reference text,
  created_at timestamptz not null default now()
);

create table if not exists public.faith_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  memory text not null,
  category text,
  source_thread_id uuid references public.prayer_threads(id) on delete set null,
  private boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.prayer_circle_people (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  note text,
  share_enabled boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.user_state enable row level security;
alter table public.prayer_threads enable row level security;
alter table public.prayer_events enable row level security;
alter table public.faith_memories enable row level security;
alter table public.prayer_circle_people enable row level security;

create policy "user owns state" on public.user_state for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user owns prayer threads" on public.prayer_threads for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user owns prayer events" on public.prayer_events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user owns faith memories" on public.faith_memories for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user owns circle people" on public.prayer_circle_people for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists prayer_threads_user_status_idx on public.prayer_threads(user_id,status);
create index if not exists prayer_events_user_created_idx on public.prayer_events(user_id,created_at desc);
create index if not exists faith_memories_user_created_idx on public.faith_memories(user_id,created_at desc);
