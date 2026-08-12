"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  AlertTriangle,
  BrushCleaning,
  Cannabis,
  Droplets,
  Dumbbell,
  Ellipsis,
  Leaf,
  RefreshCcw,
  Shovel,
  X,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  replaceActions,
  saveMeasurements,
  setEntryIrrigation,
  upsertDailyEntry,
  type EntryDetails,
} from "@/lib/queries/entries";
import {
  addPhotoRecord,
  buildEntryPhotoPath,
  deletePhoto,
  uploadPhoto,
} from "@/lib/queries/photos";
import { todayISO } from "@/lib/utils/dates";
import {
  ACTION_OPTIONS,
  MEASUREMENT_FIELDS,
  actionLabel,
  type MeasurementKey,
} from "@/lib/utils/labels";
import type { ActionType } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input, Textarea } from "@/components/ui/Field";
import { PhotoPicker } from "@/components/photos/PhotoPicker";
import { useToast } from "@/components/ui/Toast";
import formStyles from "@/styles/form.module.scss";
import styles from "./DailyEntryForm.module.scss";

type ExistingPhoto = {
  id: string;
  url: string;
  storage_path: string;
};

type DailyEntryFormProps = {
  cultivationId: string;
  userId: string;
  date: string;
  existing: EntryDetails | null;
  existingPhotos: ExistingPhoto[];
};

const RANGES: Record<MeasurementKey, { min: number; max: number }> = {
  temperature: { min: -20, max: 70 },
  humidity: { min: 0, max: 100 },
  ph: { min: 0, max: 14 },
  ec: { min: 0, max: 10000 },
  ppm: { min: 0, max: 10000 },
};

const ACTION_ICONS: Record<ActionType, LucideIcon> = {
  pruning: Leaf,
  defoliation: Cannabis,
  transplant: Shovel,
  training: Dumbbell,
  solution_change: RefreshCcw,
  cleaning: BrushCleaning,
  other: Ellipsis,
};

function parseDecimal(raw: string): number | null | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const value = Number(trimmed.replace(",", "."));
  if (!Number.isFinite(value)) return undefined;
  return value;
}

export function DailyEntryForm({
  cultivationId,
  userId,
  date,
  existing,
  existingPhotos,
}: DailyEntryFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [values, setValues] = useState<Record<MeasurementKey, string>>(() => {
    const initial = {} as Record<MeasurementKey, string>;
    for (const field of MEASUREMENT_FIELDS) {
      const value = existing?.measurements?.[field.key];
      initial[field.key] = value !== null && value !== undefined ? String(value) : "";
    }
    return initial;
  });

  const [irrigation, setIrrigation] = useState(
    (existing?.irrigations.length ?? 0) > 0
  );
  const [irrigationNote, setIrrigationNote] = useState(
    existing?.irrigations[0]?.notes ?? ""
  );
  const [selectedActions, setSelectedActions] = useState<ActionType[]>(
    existing?.actions.map((a) => a.type) ?? []
  );
  const [actionNotes, setActionNotes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const action of existing?.actions ?? []) {
      if (action.notes) initial[action.type] = action.notes;
    }
    return initial;
  });

  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [removedPhotoIds, setRemovedPhotoIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const visiblePhotos = existingPhotos.filter(
    (p) => !removedPhotoIds.includes(p.id)
  );

  function handleDateChange(newDate: string) {
    if (!newDate) return;
    router.replace(`/cultivos/${cultivationId}/registrar?fecha=${newDate}`);
  }

  function toggleAction(type: ActionType) {
    setSelectedActions((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    setError(null);

    const parsed = {} as Record<MeasurementKey, number | null>;
    for (const field of MEASUREMENT_FIELDS) {
      const result = parseDecimal(values[field.key]);
      if (result === undefined) {
        setError(`El valor de ${field.label} no es un número válido.`);
        return;
      }
      if (result !== null) {
        const range = RANGES[field.key];
        if (result < range.min || result > range.max) {
          setError(
            `${field.label} debe estar entre ${range.min} y ${range.max}.`
          );
          return;
        }
      }
      parsed[field.key] = result;
    }

    setSaving(true);
    const supabase = createClient();

    try {
      const entry = await upsertDailyEntry(
        supabase,
        cultivationId,
        date,
        notes.trim() || null
      );

      await saveMeasurements(supabase, entry.id, parsed);

      await replaceActions(
        supabase,
        entry.id,
        selectedActions.map((type) => ({
          type,
          notes: actionNotes[type]?.trim() || null,
        }))
      );

      await setEntryIrrigation(
        supabase,
        entry.id,
        irrigation,
        irrigation ? irrigationNote.trim() || null : undefined
      );

      for (const photoId of removedPhotoIds) {
        const photo = existingPhotos.find((p) => p.id === photoId);
        if (photo) {
          await deletePhoto(supabase, photo.id, photo.storage_path);
        }
      }

      for (const file of newFiles) {
        const path = buildEntryPhotoPath(userId, cultivationId, entry.id, file.name);
        await uploadPhoto(supabase, path, file);
        await addPhotoRecord(supabase, entry.id, path);
      }

      toast("Registro guardado");
      router.push(`/cultivos/${cultivationId}?tab=timeline`);
      router.refresh();
    } catch {
      setError("No se pudo guardar el registro. Intentá de nuevo.");
      setSaving(false);
    }
  }

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
      <div className={styles.section}>
        <span className={formStyles.blockTitle}>Fecha del registro</span>
        <DatePicker
          aria-label="Fecha del registro"
          value={date}
          max={todayISO()}
          onChange={handleDateChange}
          required
        />
        {existing && (
          <p className="text-muted" style={{ fontSize: 13 }}>
            Ya existe un registro para este día. Estás editándolo.
          </p>
        )}
      </div>

      {error && (
        <p role="alert" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      <div className={styles.section}>
        <span className={formStyles.blockTitle}>Parámetros</span>
        <div className={styles.paramsGrid}>
          {MEASUREMENT_FIELDS.map((field) => (
            <Input
              key={field.key}
              label={field.shortLabel}
              inputMode="decimal"
              placeholder="—"
              value={values[field.key]}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
            />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <span className={formStyles.blockTitle}>Acciones del día</span>
        <div className={styles.actionsGrid}>
          <button
            type="button"
            className={`${styles.actionCard} ${irrigation ? styles.actionSelected : ""}`}
            onClick={() => setIrrigation((v) => !v)}
            aria-pressed={irrigation}
          >
            <Droplets size={18} aria-hidden="true" />
            Riego
          </button>
          {ACTION_OPTIONS.map((option) => {
            const selected = selectedActions.includes(option.value);
            const Icon = ACTION_ICONS[option.value];
            return (
              <button
                key={option.value}
                type="button"
                className={`${styles.actionCard} ${selected ? styles.actionSelected : ""}`}
                onClick={() => toggleAction(option.value)}
                aria-pressed={selected}
              >
                <Icon size={18} aria-hidden="true" />
                {option.label}
              </button>
            );
          })}
          <Link
            href={`/cultivos/${cultivationId}/problemas/nuevo`}
            className={`${styles.actionCard} ${styles.actionProblem}`}
          >
            <AlertTriangle size={18} aria-hidden="true" />
            Problema
          </Link>
        </div>

        {(irrigation || selectedActions.length > 0) && (
          <div className={styles.actionNotes}>
            {irrigation && (
              <Input
                label="Nota del riego (opcional)"
                placeholder="Ej: 2 L por planta con nutrientes"
                value={irrigationNote}
                onChange={(e) => setIrrigationNote(e.target.value)}
              />
            )}
            {selectedActions.map((type) => (
              <Input
                key={type}
                label={`Nota de ${actionLabel(type).toLowerCase()} (opcional)`}
                placeholder="Detalle opcional"
                value={actionNotes[type] ?? ""}
                onChange={(e) =>
                  setActionNotes((prev) => ({ ...prev, [type]: e.target.value }))
                }
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <span className={formStyles.blockTitle}>Fotos</span>
        {visiblePhotos.length > 0 && (
          <div className={styles.existingPhotos}>
            {visiblePhotos.map((photo) => (
              <div key={photo.id} className={styles.existingPhoto}>
                <img src={photo.url} alt="Foto del registro" />
                <button
                  type="button"
                  className={styles.removePhoto}
                  onClick={() =>
                    setRemovedPhotoIds((prev) => [...prev, photo.id])
                  }
                  disabled={saving}
                  aria-label="Quitar esta foto al guardar"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        <PhotoPicker files={newFiles} onChange={setNewFiles} disabled={saving} />
      </div>

      <div className={styles.section}>
        <span className={formStyles.blockTitle}>Notas del día</span>
        <Textarea
          aria-label="Notas del día"
          placeholder="¿Qué pasó hoy en el cultivo?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className={styles.saveBar}>
        <Button type="submit" loading={saving} full>
          Guardar registro
        </Button>
      </div>
    </form>
  );
}
