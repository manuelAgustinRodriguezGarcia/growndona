create table public.cultivation_genetics (
  id uuid primary key default gen_random_uuid(),
  cultivation_id uuid not null references public.cultivations(id) on delete cascade,
  name text not null,
  name_key text not null,
  created_at timestamptz not null default now(),
  unique (cultivation_id, name_key)
);

create index cultivation_genetics_cultivation_id_idx on public.cultivation_genetics (cultivation_id);

alter table public.cultivation_genetics enable row level security;

create policy "cultivation_genetics_select_own" on public.cultivation_genetics
  for select to authenticated using (public.owns_cultivation(cultivation_id));
create policy "cultivation_genetics_insert_own" on public.cultivation_genetics
  for insert to authenticated with check (public.owns_cultivation(cultivation_id));
create policy "cultivation_genetics_update_own" on public.cultivation_genetics
  for update to authenticated using (public.owns_cultivation(cultivation_id)) with check (public.owns_cultivation(cultivation_id));
create policy "cultivation_genetics_delete_own" on public.cultivation_genetics
  for delete to authenticated using (public.owns_cultivation(cultivation_id));

alter table public.measurements
  drop constraint measurements_daily_entry_id_key;

alter table public.measurements
  add column genetic_id uuid references public.cultivation_genetics(id) on delete cascade;

alter table public.measurements
  add constraint measurements_entry_genetic_key unique nulls not distinct (daily_entry_id, genetic_id);

create index measurements_genetic_id_idx on public.measurements (genetic_id);

insert into public.cultivation_genetics (cultivation_id, name, name_key)
select p.cultivation_id,
       min(btrim(p.genetics)),
       lower(btrim(p.genetics))
from public.plants p
where p.genetics is not null and btrim(p.genetics) <> ''
group by p.cultivation_id, lower(btrim(p.genetics))
on conflict (cultivation_id, name_key) do nothing;

update public.measurements m
set genetic_id = g.id
from public.daily_entries e
join public.cultivation_genetics g on g.cultivation_id = e.cultivation_id
where e.id = m.daily_entry_id
  and m.genetic_id is null
  and (
    select count(*)
    from public.cultivation_genetics g2
    where g2.cultivation_id = e.cultivation_id
  ) = 1;
