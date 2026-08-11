import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Problem, ProblemPhoto } from "@/types/database";

type DB = SupabaseClient<Database>;

export type ProblemWithPhotos = Problem & {
  problem_photos: ProblemPhoto[];
};

export async function getProblems(
  db: DB,
  cultivationId: string
): Promise<ProblemWithPhotos[]> {
  const { data, error } = await db
    .from("problems")
    .select("*, problem_photos(*)")
    .eq("cultivation_id", cultivationId)
    .order("detected_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getProblem(
  db: DB,
  id: string
): Promise<ProblemWithPhotos | null> {
  const { data, error } = await db
    .from("problems")
    .select("*, problem_photos(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createProblem(
  db: DB,
  values: {
    cultivation_id: string;
    title: string;
    detected_at: string;
    description?: string | null;
  }
): Promise<Problem> {
  const { data, error } = await db
    .from("problems")
    .insert(values)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function resolveProblem(
  db: DB,
  id: string,
  solution: string,
  resolvedAt: string
): Promise<void> {
  const { error } = await db
    .from("problems")
    .update({ status: "resolved", solution, resolved_at: resolvedAt })
    .eq("id", id);
  if (error) throw error;
}

export async function reopenProblem(db: DB, id: string): Promise<void> {
  const { error } = await db
    .from("problems")
    .update({ status: "active", solution: null, resolved_at: null })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteProblem(db: DB, id: string): Promise<void> {
  const { error } = await db.from("problems").delete().eq("id", id);
  if (error) throw error;
}

export async function addProblemPhotoRecord(
  db: DB,
  problemId: string,
  storagePath: string
): Promise<void> {
  const { error } = await db
    .from("problem_photos")
    .insert({ problem_id: problemId, storage_path: storagePath });
  if (error) throw error;
}
