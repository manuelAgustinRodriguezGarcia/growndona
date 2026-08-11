"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AlertTriangle, Camera, Droplets, NotebookPen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { addIrrigation, upsertDailyEntry } from "@/lib/queries/entries";
import {
  addPhotoRecord,
  buildEntryPhotoPath,
  uploadPhoto,
  validatePhotoFile,
} from "@/lib/queries/photos";
import { todayISO } from "@/lib/utils/dates";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import styles from "./QuickActions.module.scss";

type QuickActionsProps = {
  cultivationId: string;
  userId: string;
};

export function QuickActions({ cultivationId, userId }: QuickActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [irrigationConfirm, setIrrigationConfirm] = useState(false);
  const [busy, setBusy] = useState<"irrigation" | "photo" | null>(null);

  async function handleIrrigation() {
    if (busy) return;
    setBusy("irrigation");
    try {
      const supabase = createClient();
      const entry = await upsertDailyEntry(supabase, cultivationId, todayISO());
      await addIrrigation(supabase, entry.id);
      toast("Riego registrado");
      setIrrigationConfirm(false);
      router.refresh();
    } catch {
      toast("No se pudo registrar el riego", "error");
    } finally {
      setBusy(null);
    }
  }

  async function handlePhoto(files: FileList | null) {
    if (!files || files.length === 0 || busy) return;
    const file = files[0];
    const validationError = validatePhotoFile(file);
    if (validationError) {
      toast(validationError, "error");
      return;
    }

    setBusy("photo");
    try {
      const supabase = createClient();
      const entry = await upsertDailyEntry(supabase, cultivationId, todayISO());
      const path = buildEntryPhotoPath(userId, cultivationId, entry.id, file.name);
      await uploadPhoto(supabase, path, file);
      await addPhotoRecord(supabase, entry.id, path);
      toast("Foto agregada");
      router.refresh();
    } catch {
      toast("No se pudo subir la foto", "error");
    } finally {
      setBusy(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <>
      <div className={styles.grid}>
        <Link
          href={`/cultivos/${cultivationId}/registrar`}
          className={`${styles.card} ${styles.primary}`}
        >
          <NotebookPen size={20} aria-hidden="true" />
          Registrar día
        </Link>
        <button
          type="button"
          className={styles.card}
          onClick={() => setIrrigationConfirm(true)}
          disabled={busy !== null}
        >
          <Droplets size={20} aria-hidden="true" />
          Riego
        </button>
        <button
          type="button"
          className={styles.card}
          onClick={() => fileRef.current?.click()}
          disabled={busy !== null}
        >
          <Camera size={20} aria-hidden="true" />
          {busy === "photo" ? "Subiendo…" : "Foto"}
        </button>
        <Link
          href={`/cultivos/${cultivationId}/problemas/nuevo`}
          className={styles.card}
        >
          <AlertTriangle size={20} aria-hidden="true" />
          Problema
        </Link>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className={styles.hiddenInput}
        onChange={(e) => handlePhoto(e.target.files)}
        aria-label="Subir foto rápida"
        tabIndex={-1}
      />

      <ConfirmDialog
        open={irrigationConfirm}
        title="Registrar riego"
        message="Se agregará un riego al registro de hoy."
        confirmLabel="Registrar riego"
        loading={busy === "irrigation"}
        onConfirm={handleIrrigation}
        onCancel={() => setIrrigationConfirm(false)}
      />
    </>
  );
}
