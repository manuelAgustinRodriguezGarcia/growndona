create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cultivations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  start_date date not null,
  end_date date,
  plant_count integer not null default 1,
  genetics text,
  method text,
  medium text,
  environment text,
  cover_image_url text,
  final_notes text,
  status text not null default 'active' check (status in ('active', 'finished')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cultivation_periods (
  id uuid primary key default gen_random_uuid(),
  cultivation_id uuid not null references public.cultivations(id) on delete cascade,
  type text not null check (type in ('germination', 'seedling', 'vegetative', 'flowering', 'drying', 'finished', 'custom')),
  name text not null,
  start_date date not null,
  end_date date,
  created_at timestamptz not null default now()
);

create table public.daily_entries (
  id uuid primary key default gen_random_uuid(),
  cultivation_id uuid not null references public.cultivations(id) on delete cascade,
  entry_date date not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cultivation_id, entry_date)
);

create table public.measurements (
  id uuid primary key default gen_random_uuid(),
  daily_entry_id uuid not null unique references public.daily_entries(id) on delete cascade,
  temperature numeric,
  humidity numeric,
  ph numeric,
  ec numeric,
  ppm numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.irrigations (
  id uuid primary key default gen_random_uuid(),
  daily_entry_id uuid not null references public.daily_entries(id) on delete cascade,
  performed_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);

create table public.actions (
  id uuid primary key default gen_random_uuid(),
  daily_entry_id uuid not null references public.daily_entries(id) on delete cascade,
  type text not null check (type in ('pruning', 'defoliation', 'transplant', 'training', 'solution_change', 'cleaning', 'other')),
  title text,
  notes text,
  performed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  daily_entry_id uuid not null references public.daily_entries(id) on delete cascade,
  storage_path text not null,
  url text,
  caption text,
  created_at timestamptz not null default now()
);

create table public.problems (
  id uuid primary key default gen_random_uuid(),
  cultivation_id uuid not null references public.cultivations(id) on delete cascade,
  title text not null,
  description text,
  detected_at date not null,
  status text not null default 'active' check (status in ('active', 'resolved')),
  solution text,
  resolved_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.problem_photos (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references public.problems(id) on delete cascade,
  storage_path text not null,
  url text,
  created_at timestamptz not null default now()
);

create index cultivations_user_id_idx on public.cultivations (user_id);
create index cultivation_periods_cultivation_id_idx on public.cultivation_periods (cultivation_id);
create index daily_entries_cultivation_date_idx on public.daily_entries (cultivation_id, entry_date desc);
create index measurements_daily_entry_id_idx on public.measurements (daily_entry_id);
create index irrigations_daily_entry_id_idx on public.irrigations (daily_entry_id);
create index actions_daily_entry_id_idx on public.actions (daily_entry_id);
create index photos_daily_entry_id_idx on public.photos (daily_entry_id);
create index problems_cultivation_id_idx on public.problems (cultivation_id);
create index problem_photos_problem_id_idx on public.problem_photos (problem_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger cultivations_updated_at before update on public.cultivations
  for each row execute function public.set_updated_at();
create trigger daily_entries_updated_at before update on public.daily_entries
  for each row execute function public.set_updated_at();
create trigger measurements_updated_at before update on public.measurements
  for each row execute function public.set_updated_at();
create trigger problems_updated_at before update on public.problems
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
