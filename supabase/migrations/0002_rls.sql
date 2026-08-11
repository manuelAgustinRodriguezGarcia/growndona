alter table public.profiles enable row level security;
alter table public.cultivations enable row level security;
alter table public.cultivation_periods enable row level security;
alter table public.daily_entries enable row level security;
alter table public.measurements enable row level security;
alter table public.irrigations enable row level security;
alter table public.actions enable row level security;
alter table public.photos enable row level security;
alter table public.problems enable row level security;
alter table public.problem_photos enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "cultivations_select_own" on public.cultivations
  for select to authenticated using (user_id = auth.uid());
create policy "cultivations_insert_own" on public.cultivations
  for insert to authenticated with check (user_id = auth.uid());
create policy "cultivations_update_own" on public.cultivations
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "cultivations_delete_own" on public.cultivations
  for delete to authenticated using (user_id = auth.uid());

create or replace function public.owns_cultivation(c_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.cultivations
    where id = c_id and user_id = auth.uid()
  );
$$;

create or replace function public.owns_daily_entry(e_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.daily_entries e
    join public.cultivations c on c.id = e.cultivation_id
    where e.id = e_id and c.user_id = auth.uid()
  );
$$;

create or replace function public.owns_problem(p_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.problems p
    join public.cultivations c on c.id = p.cultivation_id
    where p.id = p_id and c.user_id = auth.uid()
  );
$$;

create policy "cultivation_periods_select_own" on public.cultivation_periods
  for select to authenticated using (public.owns_cultivation(cultivation_id));
create policy "cultivation_periods_insert_own" on public.cultivation_periods
  for insert to authenticated with check (public.owns_cultivation(cultivation_id));
create policy "cultivation_periods_update_own" on public.cultivation_periods
  for update to authenticated using (public.owns_cultivation(cultivation_id)) with check (public.owns_cultivation(cultivation_id));
create policy "cultivation_periods_delete_own" on public.cultivation_periods
  for delete to authenticated using (public.owns_cultivation(cultivation_id));

create policy "daily_entries_select_own" on public.daily_entries
  for select to authenticated using (public.owns_cultivation(cultivation_id));
create policy "daily_entries_insert_own" on public.daily_entries
  for insert to authenticated with check (public.owns_cultivation(cultivation_id));
create policy "daily_entries_update_own" on public.daily_entries
  for update to authenticated using (public.owns_cultivation(cultivation_id)) with check (public.owns_cultivation(cultivation_id));
create policy "daily_entries_delete_own" on public.daily_entries
  for delete to authenticated using (public.owns_cultivation(cultivation_id));

create policy "measurements_select_own" on public.measurements
  for select to authenticated using (public.owns_daily_entry(daily_entry_id));
create policy "measurements_insert_own" on public.measurements
  for insert to authenticated with check (public.owns_daily_entry(daily_entry_id));
create policy "measurements_update_own" on public.measurements
  for update to authenticated using (public.owns_daily_entry(daily_entry_id)) with check (public.owns_daily_entry(daily_entry_id));
create policy "measurements_delete_own" on public.measurements
  for delete to authenticated using (public.owns_daily_entry(daily_entry_id));

create policy "irrigations_select_own" on public.irrigations
  for select to authenticated using (public.owns_daily_entry(daily_entry_id));
create policy "irrigations_insert_own" on public.irrigations
  for insert to authenticated with check (public.owns_daily_entry(daily_entry_id));
create policy "irrigations_update_own" on public.irrigations
  for update to authenticated using (public.owns_daily_entry(daily_entry_id)) with check (public.owns_daily_entry(daily_entry_id));
create policy "irrigations_delete_own" on public.irrigations
  for delete to authenticated using (public.owns_daily_entry(daily_entry_id));

create policy "actions_select_own" on public.actions
  for select to authenticated using (public.owns_daily_entry(daily_entry_id));
create policy "actions_insert_own" on public.actions
  for insert to authenticated with check (public.owns_daily_entry(daily_entry_id));
create policy "actions_update_own" on public.actions
  for update to authenticated using (public.owns_daily_entry(daily_entry_id)) with check (public.owns_daily_entry(daily_entry_id));
create policy "actions_delete_own" on public.actions
  for delete to authenticated using (public.owns_daily_entry(daily_entry_id));

create policy "photos_select_own" on public.photos
  for select to authenticated using (public.owns_daily_entry(daily_entry_id));
create policy "photos_insert_own" on public.photos
  for insert to authenticated with check (public.owns_daily_entry(daily_entry_id));
create policy "photos_update_own" on public.photos
  for update to authenticated using (public.owns_daily_entry(daily_entry_id)) with check (public.owns_daily_entry(daily_entry_id));
create policy "photos_delete_own" on public.photos
  for delete to authenticated using (public.owns_daily_entry(daily_entry_id));

create policy "problems_select_own" on public.problems
  for select to authenticated using (public.owns_cultivation(cultivation_id));
create policy "problems_insert_own" on public.problems
  for insert to authenticated with check (public.owns_cultivation(cultivation_id));
create policy "problems_update_own" on public.problems
  for update to authenticated using (public.owns_cultivation(cultivation_id)) with check (public.owns_cultivation(cultivation_id));
create policy "problems_delete_own" on public.problems
  for delete to authenticated using (public.owns_cultivation(cultivation_id));

create policy "problem_photos_select_own" on public.problem_photos
  for select to authenticated using (public.owns_problem(problem_id));
create policy "problem_photos_insert_own" on public.problem_photos
  for insert to authenticated with check (public.owns_problem(problem_id));
create policy "problem_photos_update_own" on public.problem_photos
  for update to authenticated using (public.owns_problem(problem_id)) with check (public.owns_problem(problem_id));
create policy "problem_photos_delete_own" on public.problem_photos
  for delete to authenticated using (public.owns_problem(problem_id));
