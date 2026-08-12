import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Action,
  ActionType,
  DailyEntry,
  Database,
  Irrigation,
  Measurement,
  Photo,
} from "@/types/database";

type DB = SupabaseClient<Database>;

export type EntryDetails = DailyEntry & {
  measurements: Measurement[];
  irrigations: Irrigation[];
  actions: Action[];
  photos: Photo[];
};

const ENTRY_SELECT = "*, measurements(*), irrigations(*), actions(*), photos(*)";

export async function getEntries(
  db: DB,
  cultivationId: string
): Promise<EntryDetails[]> {
  const { data, error } = await db
    .from("daily_entries")
    .select(ENTRY_SELECT)
    .eq("cultivation_id", cultivationId)
    .order("entry_date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getEntryByDate(
  db: DB,
  cultivationId: string,
  date: string
): Promise<EntryDetails | null> {
  const { data, error } = await db
    .from("daily_entries")
    .select(ENTRY_SELECT)
    .eq("cultivation_id", cultivationId)
    .eq("entry_date", date)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getLatestEntry(
  db: DB,
  cultivationId: string
): Promise<EntryDetails | null> {
  const { data, error } = await db
    .from("daily_entries")
    .select(ENTRY_SELECT)
    .eq("cultivation_id", cultivationId)
    .order("entry_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertDailyEntry(
  db: DB,
  cultivationId: string,
  date: string,
  notes?: string | null
): Promise<DailyEntry> {
  const payload: {
    cultivation_id: string;
    entry_date: string;
    notes?: string | null;
  } = { cultivation_id: cultivationId, entry_date: date };
  if (notes !== undefined) payload.notes = notes;

  const { data, error } = await db
    .from("daily_entries")
    .upsert(payload, { onConflict: "cultivation_id,entry_date" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function saveMeasurements(
  db: DB,
  dailyEntryId: string,
  geneticId: string | null,
  values: {
    temperature: number | null;
    humidity: number | null;
    ph: number | null;
    ec: number | null;
    ppm: number | null;
  }
): Promise<void> {
  const empty = Object.values(values).every((v) => v === null);
  if (empty) {
    let query = db
      .from("measurements")
      .delete()
      .eq("daily_entry_id", dailyEntryId);
    query =
      geneticId === null
        ? query.is("genetic_id", null)
        : query.eq("genetic_id", geneticId);
    const { error } = await query;
    if (error) throw error;
    return;
  }
  const { error } = await db
    .from("measurements")
    .upsert(
      { daily_entry_id: dailyEntryId, genetic_id: geneticId, ...values },
      { onConflict: "daily_entry_id,genetic_id" }
    );
  if (error) throw error;
}

export async function replaceActions(
  db: DB,
  dailyEntryId: string,
  actions: { type: ActionType; notes: string | null }[]
): Promise<void> {
  const { error: deleteError } = await db
    .from("actions")
    .delete()
    .eq("daily_entry_id", dailyEntryId);
  if (deleteError) throw deleteError;

  if (actions.length === 0) return;

  const { error } = await db.from("actions").insert(
    actions.map((a) => ({
      daily_entry_id: dailyEntryId,
      type: a.type,
      notes: a.notes,
    }))
  );
  if (error) throw error;
}

export async function addIrrigation(
  db: DB,
  dailyEntryId: string,
  notes?: string | null
): Promise<void> {
  const { error } = await db
    .from("irrigations")
    .insert({ daily_entry_id: dailyEntryId, notes: notes ?? null });
  if (error) throw error;
}

export async function setEntryIrrigation(
  db: DB,
  dailyEntryId: string,
  hasIrrigation: boolean,
  notes?: string | null
): Promise<void> {
  const { data, error } = await db
    .from("irrigations")
    .select("id")
    .eq("daily_entry_id", dailyEntryId);
  if (error) throw error;

  if (hasIrrigation && data.length === 0) {
    await addIrrigation(db, dailyEntryId, notes);
  } else if (hasIrrigation && data.length > 0 && notes !== undefined) {
    const { error: updateError } = await db
      .from("irrigations")
      .update({ notes })
      .eq("id", data[0].id);
    if (updateError) throw updateError;
  } else if (!hasIrrigation && data.length > 0) {
    const { error: deleteError } = await db
      .from("irrigations")
      .delete()
      .eq("daily_entry_id", dailyEntryId);
    if (deleteError) throw deleteError;
  }
}

export async function deleteEntry(db: DB, entryId: string): Promise<void> {
  const { error } = await db.from("daily_entries").delete().eq("id", entryId);
  if (error) throw error;
}

export type MeasurementPoint = {
  entry_date: string;
  temperature: number | null;
  humidity: number | null;
  ph: number | null;
  ec: number | null;
  ppm: number | null;
};
