import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Profile } from "@/types/database";
import { daysBetween } from "@/lib/utils/dates";

type DB = SupabaseClient<Database>;

export async function getProfile(
  db: DB,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await db
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProfile(
  db: DB,
  userId: string,
  values: { name?: string; avatar_url?: string | null }
): Promise<void> {
  const { error } = await db.from("profiles").update(values).eq("id", userId);
  if (error) throw error;
}

export type ProfileStats = {
  activeCultivations: number;
  finishedCultivations: number;
  totalEntries: number;
  totalPhotos: number;
  totalDays: number;
};

export async function getProfileStats(db: DB): Promise<ProfileStats> {
  const [cultivationsResult, entriesResult, photosResult] = await Promise.all([
    db.from("cultivations").select("status, start_date, end_date"),
    db.from("daily_entries").select("id", { count: "exact", head: true }),
    db.from("photos").select("id", { count: "exact", head: true }),
  ]);

  if (cultivationsResult.error) throw cultivationsResult.error;
  if (entriesResult.error) throw entriesResult.error;
  if (photosResult.error) throw photosResult.error;

  const cultivations = cultivationsResult.data;

  return {
    activeCultivations: cultivations.filter((c) => c.status === "active").length,
    finishedCultivations: cultivations.filter((c) => c.status === "finished").length,
    totalEntries: entriesResult.count ?? 0,
    totalPhotos: photosResult.count ?? 0,
    totalDays: cultivations.reduce(
      (sum, c) => sum + daysBetween(c.start_date, c.end_date),
      0
    ),
  };
}
