import type { SupabaseClient } from "@supabase/supabase-js";
import type { CultivationGenetic, Database } from "@/types/database";
import { normalizeGeneticName } from "@/lib/utils/genetics";

type DB = SupabaseClient<Database>;

export async function getCultivationGenetics(
  db: DB,
  cultivationId: string
): Promise<CultivationGenetic[]> {
  const { data, error } = await db
    .from("cultivation_genetics")
    .select("*")
    .eq("cultivation_id", cultivationId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function ensureCultivationGenetic(
  db: DB,
  cultivationId: string,
  name: string
): Promise<CultivationGenetic> {
  const { data, error } = await db
    .from("cultivation_genetics")
    .upsert(
      {
        cultivation_id: cultivationId,
        name: name.trim(),
        name_key: normalizeGeneticName(name),
      },
      { onConflict: "cultivation_id,name_key" }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}
