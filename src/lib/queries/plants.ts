import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Plant } from "@/types/database";

type DB = SupabaseClient<Database>;

export type PlantValues = {
  number: number;
  genetics: string | null;
  method: string | null;
  environment: string | null;
  medium: string | null;
  description: string | null;
};

export async function getPlants(db: DB, cultivationId: string): Promise<Plant[]> {
  const { data, error } = await db
    .from("plants")
    .select("*")
    .eq("cultivation_id", cultivationId)
    .order("number", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createPlants(
  db: DB,
  cultivationId: string,
  values: PlantValues[]
): Promise<void> {
  if (values.length === 0) return;
  const { error } = await db
    .from("plants")
    .insert(values.map((plant) => ({ cultivation_id: cultivationId, ...plant })));
  if (error) throw error;
}

export async function updatePlant(
  db: DB,
  id: string,
  values: Partial<PlantValues>
): Promise<void> {
  const { error } = await db.from("plants").update(values).eq("id", id);
  if (error) throw error;
}

export async function deletePlants(db: DB, ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const { error } = await db.from("plants").delete().in("id", ids);
  if (error) throw error;
}
