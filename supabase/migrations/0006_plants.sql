create table public.plants (
  id uuid primary key default gen_random_uuid(),
  cultivation_id uuid not null references public.cultivations(id) on delete cascade,
  number integer not null,
  genetics text,
  method text,
  environment text,
  medium text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cultivation_id, number)
);

create index plants_cultivation_id_idx on public.plants (cultivation_id);

create trigger plants_updated_at before update on public.plants
  for each row execute function public.set_updated_at();

alter table public.plants enable row level security;

create policy "plants_select_own" on public.plants
  for select to authenticated using (public.owns_cultivation(cultivation_id));
create policy "plants_insert_own" on public.plants
  for insert to authenticated with check (public.owns_cultivation(cultivation_id));
create policy "plants_update_own" on public.plants
  for update to authenticated using (public.owns_cultivation(cultivation_id)) with check (public.owns_cultivation(cultivation_id));
create policy "plants_delete_own" on public.plants
  for delete to authenticated using (public.owns_cultivation(cultivation_id));

insert into public.plants (cultivation_id, number, genetics, method, environment, medium)
select c.id, gs.n, c.genetics, c.method, c.environment, c.medium
from public.cultivations c
cross join lateral generate_series(1, greatest(c.plant_count, 1)) as gs(n);
