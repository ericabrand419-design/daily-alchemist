-- The Daily Alchemist: run once in Supabase > SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer text,
  member_until timestamptz,
  updated_at timestamptz default now()
);
alter table public.profiles add column if not exists trial_until timestamptz;
-- Friends launch: lifetime access, who joined how, and the opt-in week of sharing taps.
alter table public.profiles add column if not exists lifetime boolean not null default false;
alter table public.profiles add column if not exists cohort text;
alter table public.profiles add column if not exists is_admin boolean not null default false;
alter table public.profiles add column if not exists joined_at timestamptz default now();
alter table public.profiles add column if not exists monitor_answer text;       -- 'yes' or 'no'
alter table public.profiles add column if not exists monitor_started timestamptz;
alter table public.profiles add column if not exists monitor_until timestamptz;
-- Adults only: when this person confirmed they're 18 or older (no birth date is collected).
alter table public.profiles add column if not exists adult_confirmed_at timestamptz;
create table if not exists public.prefs (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
create table if not exists public.entries (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null,
  created_at timestamptz default now()
);
create index if not exists entries_user on public.entries(user_id, created_at desc);
create table if not exists public.chats (
  user_id uuid not null references auth.users(id) on delete cascade,
  guardian text not null,
  msgs jsonb not null default '[]'::jsonb,
  updated_at timestamptz default now(),
  primary key (user_id, guardian)
);
create table if not exists public.usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  read int not null default 0,
  talk int not null default 0,
  memory int not null default 0,
  primary key (user_id, day)
);

alter table public.profiles enable row level security;
alter table public.prefs enable row level security;
alter table public.entries enable row level security;
alter table public.chats enable row level security;
alter table public.usage enable row level security;

-- Members can read their own membership; only the server (service role) can change it.
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles for select using (auth.uid() = id);
-- Each person reads and writes only their own Archive, chats and settings.
drop policy if exists "own prefs" on public.prefs;
create policy "own prefs" on public.prefs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "own entries" on public.entries;
create policy "own entries" on public.entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "own chats" on public.chats;
create policy "own chats" on public.chats for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "read own usage" on public.usage;
create policy "read own usage" on public.usage for select using (auth.uid() = user_id);

-- If you already ran an earlier version of this file:
alter table public.usage add column if not exists memory int not null default 0;
alter table public.usage add column if not exists voice int not null default 0;  -- characters spoken aloud today

-- Notifications (only the server reads or writes these)
create table if not exists public.push_subs (
  endpoint text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  sub jsonb not null,
  created_at timestamptz default now()
);
alter table public.push_subs enable row level security;

-- Which reminders have been sent (keyed by item and due date, so a snoozed promise can notify again)
create table if not exists public.push_sent (
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  sent_at timestamptz default now(),
  primary key (user_id, key)
);
alter table public.push_sent enable row level security;

-- What kind of thing happened and when (never what anyone wrote). Only recorded for people who
-- said yes to sharing for a week, and only the server writes it. Only you can read it.
create table if not exists public.events (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  ev text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);
create index if not exists events_user on public.events(user_id, created_at);
alter table public.events enable row level security;
drop policy if exists "add own events" on public.events;  -- events are written only by the server now

create table if not exists public.feedback (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  email text,
  text text,
  mood text,
  screen text,
  day int,
  created_at timestamptz default now()
);
alter table public.feedback enable row level security;
drop policy if exists "add own feedback" on public.feedback;
create policy "add own feedback" on public.feedback for insert with check (auth.uid() = user_id);

-- Friends Week invitations: one link per friend, used once, expires after 30 days.
-- Only the server reads or writes these (no policies = no direct access from the app).
create table if not exists public.invites (
  code text primary key,
  label text,
  created_at timestamptz default now(),
  expires_at timestamptz,
  revoked boolean not null default false,
  used_by uuid references auth.users(id) on delete set null,
  used_at timestamptz
);
alter table public.invites enable row level security;

-- Share links: each invited friend gets one link they can pass on, good for up to 3 people,
-- who also get lifetime access. Personal invitations stay single-use (max_uses 1).
alter table public.invites add column if not exists max_uses int not null default 1;
alter table public.invites add column if not exists uses int not null default 0;
alter table public.invites add column if not exists owner uuid references auth.users(id) on delete set null;
update public.invites set uses = 1 where used_by is not null and uses = 0;
create table if not exists public.invite_uses (
  code text references public.invites(code) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  used_at timestamptz default now(),
  primary key (code, user_id)
);
alter table public.invite_uses enable row level security;
alter table public.profiles add column if not exists invited_by uuid references auth.users(id) on delete set null;
-- Claims one use of a link in a single step, so a link can never go past its limit.
create or replace function public.claim_invite(p_code text, p_user uuid)
returns setof public.invites language sql security definer set search_path = public as $$
  update public.invites
     set uses = uses + 1, used_by = coalesce(used_by, p_user), used_at = coalesce(used_at, now())
   where code = p_code and not revoked and (expires_at is null or expires_at > now()) and uses < max_uses
     and not exists (select 1 from public.invite_uses u where u.code = p_code and u.user_id = p_user)
  returning *;
$$;
revoke all on function public.claim_invite(text, uuid) from public, anon, authenticated;
grant execute on function public.claim_invite(text, uuid) to service_role;

-- Friends Week: what each person ticked to share (only taps and times, never words).
alter table public.profiles add column if not exists monitor_scope text[];
