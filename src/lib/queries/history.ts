import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActionType, Database } from "@/types/database";
import { actionLabel } from "@/lib/utils/labels";

type DB = SupabaseClient<Database>;

export type ActivityItem = {
  id: string;
  date: string;
  cultivationId: string;
  cultivationName: string;
  kind: "measurements" | "irrigation" | "action" | "photos" | "note" | "problem" | "problem_resolved";
  label: string;
};

export async function getRecentActivity(
  db: DB,
  limit = 40
): Promise<ActivityItem[]> {
  const [entriesResult, problemsResult] = await Promise.all([
    db
      .from("daily_entries")
      .select(
        "id, entry_date, notes, cultivation_id, cultivations!inner(name), measurements(id), irrigations(id), actions(id, type), photos(id)"
      )
      .order("entry_date", { ascending: false })
      .limit(30),
    db
      .from("problems")
      .select("id, title, detected_at, status, resolved_at, cultivation_id, cultivations!inner(name)")
      .order("detected_at", { ascending: false })
      .limit(20),
  ]);

  if (entriesResult.error) throw entriesResult.error;
  if (problemsResult.error) throw problemsResult.error;

  const items: ActivityItem[] = [];

  for (const entry of entriesResult.data) {
    const base = {
      date: entry.entry_date,
      cultivationId: entry.cultivation_id,
      cultivationName: entry.cultivations.name,
    };
    if (entry.measurements) {
      items.push({
        ...base,
        id: `${entry.id}-measurements`,
        kind: "measurements",
        label: "Parámetros registrados",
      });
    }
    if (entry.irrigations.length > 0) {
      items.push({
        ...base,
        id: `${entry.id}-irrigation`,
        kind: "irrigation",
        label: "Riego registrado",
      });
    }
    for (const action of entry.actions) {
      items.push({
        ...base,
        id: `${entry.id}-action-${action.id}`,
        kind: "action",
        label: actionLabel(action.type as ActionType),
      });
    }
    if (entry.photos.length > 0) {
      items.push({
        ...base,
        id: `${entry.id}-photos`,
        kind: "photos",
        label:
          entry.photos.length === 1
            ? "1 fotografía"
            : `${entry.photos.length} fotografías`,
      });
    }
    if (entry.notes) {
      items.push({
        ...base,
        id: `${entry.id}-note`,
        kind: "note",
        label: "Nota agregada",
      });
    }
  }

  for (const problem of problemsResult.data) {
    items.push({
      id: `${problem.id}-detected`,
      date: problem.detected_at,
      cultivationId: problem.cultivation_id,
      cultivationName: problem.cultivations.name,
      kind: "problem",
      label: `Problema detectado: ${problem.title}`,
    });
    if (problem.status === "resolved" && problem.resolved_at) {
      items.push({
        id: `${problem.id}-resolved`,
        date: problem.resolved_at,
        cultivationId: problem.cultivation_id,
        cultivationName: problem.cultivations.name,
        kind: "problem_resolved",
        label: `Problema resuelto: ${problem.title}`,
      });
    }
  }

  return items
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
