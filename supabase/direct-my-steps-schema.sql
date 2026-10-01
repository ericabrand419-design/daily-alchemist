-- Direct My Steps: private Agent First faith-memory + membership schema
-- Membership entitlements are server-controlled. Clients may read their own membership row
-- but cannot grant themselves Plus.
create extension if not exists pgcrypto;

create table if not exists public.memberships (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free','plus')),
  status text not null default 'none' check (status in ('none','trialing','active','past_due','canceled','incomplete')),
  billing_interval text check (billing_interval in ('monthly','annual','sponsored')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  sponsor_note text,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create or replace function public.has_plus(target_user uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.memberships m
    where m.user_id = target_user
      and m.plan = 'plus'
      and m.status in ('trialing','active')
      and (m.current_period_end is null or m.current_period_end > now())
  );
$$;

revoke all on function public.has_plus(uuid) from public;
grant execute on function public.has_plus(uuid) to authenticated;

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

create table if not exists public.sponsorships (
  id uuid primary key default gen_random_uuid(),
  purchaser_user_id uuid references auth.users(id) on delete set null,
  purchaser_email text,
  recipient_email text not null,
  recipient_user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','paid','redeemed','canceled','refunded')),
  stripe_checkout_session_id text unique,
  created_at timestamptz not null default now(),
  redeemed_at timestamptz
);

create table if not exists public.household_spaces (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My prayer space',
  created_at timestamptz not null default now()
);

create table if not exists public.household_members (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.household_spaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  invited_email text,
  role text not null default 'member' check (role in ('owner','member')),
  status text not null default 'invited' check (status in ('invited','active','left')),
  created_at timestamptz not null default now(),
  unique(space_id,user_id)
);

create table if not exists public.shared_prayer_requests (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.household_spaces(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  title text not null,
  note text,
  source_thread_id uuid references public.prayer_threads(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.memberships enable row level security;
alter table public.user_state enable row level security;
alter table public.prayer_threads enable row level security;
alter table public.prayer_events enable row level security;
alter table public.faith_memories enable row level security;
alter table public.prayer_circle_people enable row level security;
alter table public.sponsorships enable row level security;
alter table public.household_spaces enable row level security;
alter table public.household_members enable row level security;
alter table public.shared_prayer_requests enable row level security;

-- Membership rows are written only by trusted server-side billing/webhook code.
create policy "user reads own membership" on public.memberships for select using (auth.uid() = user_id);

create policy "user owns state" on public.user_state
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id and public.has_plus(auth.uid()));

create policy "user reads own prayer threads" on public.prayer_threads for select using (auth.uid() = user_id);
create policy "user inserts prayer threads within plan" on public.prayer_threads for insert
with check (
  auth.uid() = user_id
  and (
    public.has_plus(auth.uid())
    or (select count(*) from public.prayer_threads p where p.user_id = auth.uid() and p.status = 'Still carrying') < 10
  )
);
create policy "user updates own prayer threads" on public.prayer_threads for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user deletes own prayer threads" on public.prayer_threads for delete using (auth.uid() = user_id);

create policy "user owns prayer events" on public.prayer_events for all
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "user reads own faith memories" on public.faith_memories for select using (auth.uid() = user_id);
create policy "user inserts memories within plan" on public.faith_memories for insert
with check (
  auth.uid() = user_id
  and (
    public.has_plus(auth.uid())
    or (select count(*) from public.faith_memories f where f.user_id = auth.uid()) < 25
  )
);
create policy "user updates own faith memories" on public.faith_memories for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user deletes own faith memories" on public.faith_memories for delete using (auth.uid() = user_id);

create policy "user reads own circle" on public.prayer_circle_people for select using (auth.uid() = user_id);
create policy "user inserts circle within plan" on public.prayer_circle_people for insert
with check (
  auth.uid() = user_id
  and (
    public.has_plus(auth.uid())
    or (select count(*) from public.prayer_circle_people p where p.user_id = auth.uid()) < 5
  )
);
create policy "user updates own circle" on public.prayer_circle_people for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user deletes own circle" on public.prayer_circle_people for delete using (auth.uid() = user_id);

create policy "sponsor reads own sponsorships" on public.sponsorships for select
using (auth.uid() = purchaser_user_id or auth.uid() = recipient_user_id);

create policy "plus owner manages household" on public.household_spaces for all
using (auth.uid() = owner_user_id)
with check (auth.uid() = owner_user_id and public.has_plus(auth.uid()));

create policy "household members can read spaces" on public.household_spaces for select
using (
  auth.uid() = owner_user_id
  or exists (
    select 1 from public.household_members hm
    where hm.space_id = id and hm.user_id = auth.uid() and hm.status = 'active'
  )
);

create policy "household members visible to household" on public.household_members for select
using (
  user_id = auth.uid()
  or exists (select 1 from public.household_spaces hs where hs.id = space_id and hs.owner_user_id = auth.uid())
);
create policy "plus owner manages household members" on public.household_members for all
using (exists (select 1 from public.household_spaces hs where hs.id = space_id and hs.owner_user_id = auth.uid()))
with check (exists (select 1 from public.household_spaces hs where hs.id = space_id and hs.owner_user_id = auth.uid() and public.has_plus(auth.uid())));

create policy "household members read shared requests" on public.shared_prayer_requests for select
using (
  exists (
    select 1 from public.household_spaces hs
    left join public.household_members hm on hm.space_id = hs.id
    where hs.id = space_id
      and (hs.owner_user_id = auth.uid() or (hm.user_id = auth.uid() and hm.status='active'))
  )
);
create policy "household members create explicit shared requests" on public.shared_prayer_requests for insert
with check (
  created_by = auth.uid()
  and exists (
    select 1 from public.household_spaces hs
    left join public.household_members hm on hm.space_id = hs.id
    where hs.id = space_id
      and (hs.owner_user_id = auth.uid() or (hm.user_id = auth.uid() and hm.status='active'))
  )
);
create policy "creator manages shared request" on public.shared_prayer_requests for update
using (created_by = auth.uid()) with check (created_by = auth.uid());
create policy "creator deletes shared request" on public.shared_prayer_requests for delete using (created_by = auth.uid());

create index if not exists prayer_threads_user_status_idx on public.prayer_threads(user_id,status);
create index if not exists prayer_events_user_created_idx on public.prayer_events(user_id,created_at desc);
create index if not exists faith_memories_user_created_idx on public.faith_memories(user_id,created_at desc);
create index if not exists prayer_circle_user_idx on public.prayer_circle_people(user_id);
create index if not exists household_members_space_idx on public.household_members(space_id);
create index if not exists shared_prayer_requests_space_idx on public.shared_prayer_requests(space_id,created_at desc);
