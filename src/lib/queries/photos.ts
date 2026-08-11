import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Photo } from "@/types/database";

type DB = SupabaseClient<Database>;

export const PHOTO_BUCKET = "cultivation-photos";
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const ALLOWED_PHOTO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function validatePhotoFile(file: File): string | null {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return `"${file.name}" no es un formato permitido (JPG, PNG o WEBP).`;
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return `"${file.name}" supera el límite de 5 MB.`;
  }
  return null;
}

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-80);
}

function uniqueName(fileName: string): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${sanitizeFileName(fileName)}`;
}

export function buildEntryPhotoPath(
  userId: string,
  cultivationId: string,
  entryId: string,
  fileName: string
): string {
  return `${userId}/${cultivationId}/${entryId}/${uniqueName(fileName)}`;
}

export function buildProblemPhotoPath(
  userId: string,
  cultivationId: string,
  problemId: string,
  fileName: string
): string {
  return `${userId}/${cultivationId}/problems/${problemId}/${uniqueName(fileName)}`;
}

export function buildCoverPath(
  userId: string,
  cultivationId: string,
  fileName: string
): string {
  return `${userId}/${cultivationId}/cover/${uniqueName(fileName)}`;
}

export function buildAvatarPath(userId: string, fileName: string): string {
  return `${userId}/avatar/${uniqueName(fileName)}`;
}

export async function uploadPhoto(
  db: DB,
  path: string,
  file: File
): Promise<void> {
  const { error } = await db.storage.from(PHOTO_BUCKET).upload(path, file);
  if (error) throw error;
}

export async function removeStorageFiles(
  db: DB,
  paths: string[]
): Promise<void> {
  if (paths.length === 0) return;
  const { error } = await db.storage.from(PHOTO_BUCKET).remove(paths);
  if (error) throw error;
}

export async function getSignedUrl(
  db: DB,
  path: string,
  expiresIn = 3600
): Promise<string | null> {
  const { data, error } = await db.storage
    .from(PHOTO_BUCKET)
    .createSignedUrl(path, expiresIn);
  if (error) return null;
  return data.signedUrl;
}

export async function getSignedUrlMap(
  db: DB,
  paths: string[],
  expiresIn = 3600
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const unique = [...new Set(paths.filter(Boolean))];
  if (unique.length === 0) return map;

  const { data, error } = await db.storage
    .from(PHOTO_BUCKET)
    .createSignedUrls(unique, expiresIn);
  if (error || !data) return map;

  for (const item of data) {
    if (item.signedUrl && item.path) {
      map.set(item.path, item.signedUrl);
    }
  }
  return map;
}

export type CultivationPhoto = Photo & {
  daily_entries: { entry_date: string; cultivation_id: string };
};

export async function getCultivationPhotos(
  db: DB,
  cultivationId: string
): Promise<CultivationPhoto[]> {
  const { data, error } = await db
    .from("photos")
    .select("*, daily_entries!inner(entry_date, cultivation_id)")
    .eq("daily_entries.cultivation_id", cultivationId);
  if (error) throw error;
  return data.sort((a, b) =>
    b.daily_entries.entry_date.localeCompare(a.daily_entries.entry_date)
  );
}

export async function addPhotoRecord(
  db: DB,
  dailyEntryId: string,
  storagePath: string,
  caption?: string | null
): Promise<void> {
  const { error } = await db.from("photos").insert({
    daily_entry_id: dailyEntryId,
    storage_path: storagePath,
    caption: caption ?? null,
  });
  if (error) throw error;
}

export async function deletePhoto(
  db: DB,
  photoId: string,
  storagePath: string
): Promise<void> {
  const { error } = await db.from("photos").delete().eq("id", photoId);
  if (error) throw error;
  await removeStorageFiles(db, [storagePath]);
}
