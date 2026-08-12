import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Cultivation,
  CultivationPeriod,
  Database,
  PeriodType,
} from "@/types/database";

type DB = SupabaseClient<Database>;

export type CultivationWithPeriods = Cultivation & {
  cultivation_periods: CultivationPeriod[];
};

export async function getCultivations(
  db: DB
): Promise<CultivationWithPeriods[]> {
  const { data, error } = await db
    .from("cultivations")
    .select("*, cultivation_periods(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getCultivation(
  db: DB,
  id: string
): Promise<CultivationWithPeriods | null> {
  const { data, error } = await db
    .from("cultivations")
    .select("*, cultivation_periods(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createCultivation(
  db: DB,
  values: {
    user_id: string;
    name: string;
    start_date: string;
    plant_count: number;
    description?: string | null;
    genetics?: string | null;
    method?: string | null;
    medium?: string | null;
    environment?: string | null;
  }
): Promise<Cultivation> {
  const { data, error } = await db
    .from("cultivations")
    .insert(values)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCultivation(
  db: DB,
  id: string,
  values: Partial<Cultivation>
): Promise<void> {
  const { error } = await db.from("cultivations").update(values).eq("id", id);
  if (error) throw error;
}

export async function deleteCultivation(db: DB, id: string): Promise<void> {
  const { error } = await db.from("cultivations").delete().eq("id", id);
  if (error) throw error;
}

export async function createPeriod(
  db: DB,
  values: {
    cultivation_id: string;
    type: PeriodType;
    name: string;
    start_date: string;
  }
): Promise<CultivationPeriod> {
  const { data, error } = await db
    .from("cultivation_periods")
    .insert(values)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePeriod(
  db: DB,
  id: string,
  values: Partial<
    Pick<CultivationPeriod, "type" | "name" | "start_date" | "end_date">
  >
): Promise<void> {
  const { error } = await db
    .from("cultivation_periods")
    .update(values)
    .eq("id", id);
  if (error) throw error;
}

export async function deletePeriod(db: DB, id: string): Promise<void> {
  const { error } = await db.from("cultivation_periods").delete().eq("id", id);
  if (error) throw error;
}

export async function closeOpenPeriods(
  db: DB,
  cultivationId: string,
  endDate: string
): Promise<void> {
  const { error } = await db
    .from("cultivation_periods")
    .update({ end_date: endDate })
    .eq("cultivation_id", cultivationId)
    .is("end_date", null);
  if (error) throw error;
}

export async function changePeriod(
  db: DB,
  cultivationId: string,
  values: { type: PeriodType; name: string; start_date: string }
): Promise<CultivationPeriod> {
  await closeOpenPeriods(db, cultivationId, values.start_date);
  return createPeriod(db, { cultivation_id: cultivationId, ...values });
}

export async function finishCultivation(
  db: DB,
  cultivationId: string,
  endDate: string,
  finalNotes?: string | null
): Promise<void> {
  await closeOpenPeriods(db, cultivationId, endDate);
  await updateCultivation(db, cultivationId, {
    status: "finished",
    end_date: endDate,
    final_notes: finalNotes ?? null,
  });
}
