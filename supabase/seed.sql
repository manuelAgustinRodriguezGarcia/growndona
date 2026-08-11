-- Datos de ejemplo para Growndona.
-- IMPORTANTE: reemplazá REPLACE_WITH_USER_ID por el uuid de un usuario real
-- (Dashboard de Supabase → Authentication → Users → copiar el ID).
-- Ejecutalo después de las migrations, desde el SQL Editor.

do $$
declare
  uid uuid := 'REPLACE_WITH_USER_ID';
  cid uuid;
  eid uuid;
  d date;
  i integer;
begin
  insert into public.cultivations (user_id, name, description, start_date, plant_count, genetics, method, medium, environment, status)
  values (uid, 'Orbiter #1', 'Primer cultivo de prueba en interior.', current_date - 36, 2, 'Orbiter', 'Tierra', 'Tierra + perlita', 'Interior', 'active')
  returning id into cid;

  insert into public.cultivation_periods (cultivation_id, type, name, start_date, end_date)
  values
    (cid, 'germination', 'Germinación', current_date - 36, current_date - 30),
    (cid, 'seedling', 'Plántula', current_date - 30, current_date - 22),
    (cid, 'vegetative', 'Crecimiento', current_date - 22, null);

  for i in 0..13 loop
    d := current_date - i;

    insert into public.daily_entries (cultivation_id, entry_date, notes)
    values (
      cid,
      d,
      case when i % 4 = 0 then 'Todo en orden, plantas con buen color.' else null end
    )
    returning id into eid;

    insert into public.measurements (daily_entry_id, temperature, humidity, ph, ec, ppm)
    values (
      eid,
      23 + (i % 4),
      55 + (i % 8),
      5.8 + (i % 5) * 0.1,
      1.0 + (i % 4) * 0.1,
      560 + (i % 6) * 20
    );

    if i % 2 = 0 then
      insert into public.irrigations (daily_entry_id, performed_at, notes)
      values (eid, d::timestamptz + interval '9 hours', 'Riego con solución nutritiva.');
    end if;

    if i = 3 then
      insert into public.actions (daily_entry_id, type, notes, performed_at)
      values (eid, 'pruning', 'Poda apical de la planta más alta.', d::timestamptz + interval '10 hours');
    end if;

    if i = 7 then
      insert into public.actions (daily_entry_id, type, notes, performed_at)
      values (eid, 'defoliation', 'Se retiraron hojas bajas con poca luz.', d::timestamptz + interval '11 hours');
    end if;
  end loop;

  insert into public.problems (cultivation_id, title, description, detected_at, status, solution, resolved_at)
  values
    (cid, 'Hojas amarillas en la parte baja', 'Algunas hojas inferiores comenzaron a amarillear.', current_date - 6, 'resolved', 'Se ajustó la EC y se defoliaron las hojas afectadas.', current_date - 3),
    (cid, 'Posible carencia de calcio', 'Manchas marrones pequeñas en hojas medias.', current_date - 2, 'active', null, null);
end $$;
