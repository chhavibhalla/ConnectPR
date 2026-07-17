-- ============================================================
-- connectPR — database schema (run this in Supabase SQL Editor)
-- Dashboard -> SQL Editor -> New query -> paste all -> Run.
-- Safe to re-run: uses "if not exists" / "or replace" throughout.
-- ============================================================

-- ---------- profiles (1 row per user, mirrors auth.users) ----------
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text,
  full_name     text,
  brand_name    text,
  city          text,
  plan          text not null default 'free',       -- free | pro | team
  searches_used int  not null default 0,
  seeded        bool not null default false,         -- demo data inserted for first-run?
  created_at    timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, brand_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'brand_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- saved_contacts (bookmarked contact ids) ----------
create table if not exists public.saved_contacts (
  user_id    uuid not null references auth.users(id) on delete cascade,
  contact_id text not null,                          -- references the reference dataset id (e.g. 'c1')
  created_at timestamptz not null default now(),
  primary key (user_id, contact_id)
);

-- ---------- lists (a user's shortlists) ----------
create table if not exists public.lists (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  color      text not null default 'brand',
  note       text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.list_contacts (
  list_id    uuid not null references public.lists(id) on delete cascade,
  contact_id text not null,
  added_at   timestamptz not null default now(),
  primary key (list_id, contact_id)
);

-- ---------- competitors (brands a user tracks) ----------
create table if not exists public.competitors (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  brand         text not null,
  handle        text,
  category      text,
  avatar        text,
  tracked_since text,
  metrics       jsonb not null default '{}'::jsonb,  -- {collabs30d, prMentions30d, avgEngagement, share}
  timeline      jsonb not null default '[]'::jsonb,  -- [{date,type,title,detail,tag}]
  created_at    timestamptz not null default now()
);

-- ---------- alerts (notification feed) ----------
create table if not exists public.alerts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  competitor_id uuid references public.competitors(id) on delete cascade,
  brand         text,
  avatar        text,
  type          text,                                -- collab | press | track
  title         text,
  detail        text,
  tag           text,
  date          text,
  read          bool not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists alerts_user_created_idx on public.alerts (user_id, created_at desc);
create index if not exists competitors_user_idx    on public.competitors (user_id);
create index if not exists lists_user_idx           on public.lists (user_id);

-- ============================================================
-- Row-Level Security — every user sees only their own rows.
-- ============================================================
alter table public.profiles       enable row level security;
alter table public.saved_contacts enable row level security;
alter table public.lists          enable row level security;
alter table public.list_contacts  enable row level security;
alter table public.competitors    enable row level security;
alter table public.alerts         enable row level security;

-- profiles: a user reads/updates only their own profile
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- saved_contacts
drop policy if exists "own saved" on public.saved_contacts;
create policy "own saved" on public.saved_contacts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- lists
drop policy if exists "own lists" on public.lists;
create policy "own lists" on public.lists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- list_contacts: allowed when the parent list belongs to the user
drop policy if exists "own list_contacts" on public.list_contacts;
create policy "own list_contacts" on public.list_contacts
  for all using (
    exists (select 1 from public.lists l where l.id = list_id and l.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.lists l where l.id = list_id and l.user_id = auth.uid())
  );

-- competitors
drop policy if exists "own competitors" on public.competitors;
create policy "own competitors" on public.competitors
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- alerts
drop policy if exists "own alerts" on public.alerts;
create policy "own alerts" on public.alerts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Done. Next: Authentication -> Providers -> enable Email.
-- Copy Project URL + anon key into your .env (see SETUP_SUPABASE.md).
-- ============================================================
