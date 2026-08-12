alter table public.profiles add column username text;

create unique index profiles_username_unique_idx on public.profiles (lower(username));

do $$
declare
  r record;
  base text;
  candidate text;
  n int;
begin
  for r in
    select p.id, u.email
    from public.profiles p
    join auth.users u on u.id = p.id
    where p.username is null
  loop
    base := regexp_replace(lower(split_part(r.email, '@', 1)), '[^a-z0-9_]', '', 'g');
    if length(base) < 3 then
      base := base || 'user';
    end if;
    base := left(base, 20);
    candidate := base;
    n := 1;
    while exists (select 1 from public.profiles where lower(username) = lower(candidate)) loop
      candidate := left(base, 20 - length(n::text)) || n::text;
      n := n + 1;
    end loop;
    update public.profiles set username = candidate where id = r.id;
  end loop;
end $$;

alter table public.profiles
  add constraint profiles_username_format
  check (username is null or username ~ '^[a-z0-9_]{3,20}$');

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    nullif(lower(trim(new.raw_user_meta_data ->> 'username')), '')
  );
  return new;
end;
$$;

create or replace function public.get_email_for_username(p_username text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select u.email
  from public.profiles p
  join auth.users u on u.id = p.id
  where lower(p.username) = lower(trim(p_username))
  limit 1;
$$;

revoke all on function public.get_email_for_username(text) from public;
grant execute on function public.get_email_for_username(text) to anon, authenticated;
