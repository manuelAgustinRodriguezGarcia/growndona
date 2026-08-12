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
import { ensureCultivationGenetic } from "@/lib/queries/genetics";
import {
  addPhotoRecord,
  buildEntryPhotoPath,
  deletePhoto,
  uploadPhoto,
} from "@/lib/queries/photos";
import { todayISO } from "@/lib/utils/dates";
import { getGeneticGroups } from "@/lib/utils/genetics";
import {
  ACTION_OPTIONS,
  MEASUREMENT_FIELDS,
  actionLabel,
  type MeasurementKey,
} from "@/lib/utils/labels";
import type {
  ActionType,
  CultivationGenetic,
  Measurement,
  Plant,
} from "@/types/database";
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
  plants: Plant[];
  genetics: CultivationGenetic[];
};

const GENERAL_KEY = "__general__";

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
  plants,
  genetics,
}: DailyEntryFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const { groups, unassignedCount } = getGeneticGroups(plants);
  const paramKeys = groups.length > 0 ? groups.map((g) => g.key) : [GENERAL_KEY];
  const geneticByKey = new Map(genetics.map((g) => [g.name_key, g]));
  const isToday = date === todayISO();

  function findExistingMeasurement(key: string): Measurement | undefined {
    if (!existing) return undefined;
    if (key === GENERAL_KEY) {
      return existing.measurements.find((m) => m.genetic_id === null);
    }
    const genetic = geneticByKey.get(key);
    if (!genetic) return undefined;
    return existing.measurements.find((m) => m.genetic_id === genetic.id);
  }

  const [values, setValues] = useState<
    Record<string, Record<MeasurementKey, string>>
  >(() => {
    const initial: Record<string, Record<MeasurementKey, string>> = {};
    for (const key of paramKeys) {
      const row = findExistingMeasurement(key);
      const fields = {} as Record<MeasurementKey, string>;
      for (const field of MEASUREMENT_FIELDS) {
        const value = row?.[field.key];
        fields[field.key] =
          value !== null && value !== undefined ? String(value) : "";
      }
      initial[key] = fields;
    }
    return initial;
  });
  const [selectedKey, setSelectedKey] = useState(paramKeys[0]);

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

    const parsedByKey: Record<string, Record<MeasurementKey, number | null>> =
      {};
    for (const key of paramKeys) {
      const group = groups.find((g) => g.key === key);
      const suffix = groups.length > 1 && group ? ` (${group.name})` : "";
      const parsed = {} as Record<MeasurementKey, number | null>;
      for (const field of MEASUREMENT_FIELDS) {
        const result = parseDecimal(values[key][field.key]);
        if (result === undefined) {
          setError(`El valor de ${field.label}${suffix} no es un número válido.`);
          return;
        }
        if (result !== null) {
          const range = RANGES[field.key];
          if (result < range.min || result > range.max) {
            setError(
              `${field.label}${suffix} debe estar entre ${range.min} y ${range.max}.`
            );
            return;
          }
        }
        parsed[field.key] = result;
      }
      parsedByKey[key] = parsed;
    }

    const hasMeasurement = paramKeys.some((key) =>
      MEASUREMENT_FIELDS.some((field) => parsedByKey[key][field.key] !== null)
    );
    const hasContent =
      hasMeasurement ||
      irrigation ||
      selectedActions.length > 0 ||
      notes.trim().length > 0 ||
      newFiles.length > 0 ||
      visiblePhotos.length > 0;
    if (!hasContent) {
      setError(
        "Cargá al menos un dato para guardar el registro: un parámetro, riego, acción, foto o nota."
      );
      return;
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

      for (const key of paramKeys) {
        const parsed = parsedByKey[key];
        const hasValues = MEASUREMENT_FIELDS.some(
          (field) => parsed[field.key] !== null
        );
        const existingRow = findExistingMeasurement(key);
        if (!hasValues && !existingRow) continue;

        if (key === GENERAL_KEY) {
          await saveMeasurements(supabase, entry.id, null, parsed);
          continue;
        }

        const group = groups.find((g) => g.key === key)!;
        let geneticId =
          geneticByKey.get(key)?.id ?? existingRow?.genetic_id ?? null;
        if (!geneticId) {
          const genetic = await ensureCultivationGenetic(
            supabase,
            cultivationId,
            group.name
          );
          geneticId = genetic.id;
        }
        await saveMeasurements(supabase, entry.id, geneticId, parsed);
      }

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

        {unassignedCount > 0 && groups.length > 0 && (
          <p className={styles.geneticWarning}>
            {unassignedCount === 1
              ? "Hay 1 planta sin genética asignada. Asignale una genética para poder registrar sus parámetros correctamente."
              : `Hay ${unassignedCount} plantas sin genética asignada. Asignales una genética para poder registrar sus parámetros correctamente.`}
          </p>
        )}

        {groups.length > 1 && (
          <>
            <p className={styles.geneticPrompt}>¿Qué genética querés registrar?</p>
            <div
              className={styles.geneticGrid}
              role="radiogroup"
              aria-label="Genética"
            >
              {groups.map((group) => {
                const active = selectedKey === group.key;
                const registered = Boolean(findExistingMeasurement(group.key));
                return (
                  <button
                    key={group.key}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    className={`${styles.geneticCard} ${active ? styles.geneticCardActive : ""}`}
                    onClick={() => setSelectedKey(group.key)}
                  >
                    <span className={styles.geneticName}>{group.name}</span>
                    <span className={styles.geneticCount}>
                      {group.plantCount}{" "}
                      {group.plantCount === 1 ? "planta" : "plantas"}
                    </span>
                    <span
                      className={
                        registered
                          ? styles.geneticRegistered
                          : styles.geneticPending
                      }
                    >
                      {registered
                        ? isToday
                          ? "✓ Registrado hoy"
                          : "✓ Registrado"
                        : isToday
                          ? "Sin registro hoy"
                          : "Sin registro"}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {groups.length === 1 && (
          <div className={styles.geneticSingle}>
            <span className={styles.geneticName}>
              {groups[0].name} · {groups[0].plantCount}{" "}
              {groups[0].plantCount === 1 ? "planta" : "plantas"}
            </span>
            <span className={styles.geneticHint}>
              Estos parámetros se aplicarán al grupo completo de plantas{" "}
              {groups[0].name}.
            </span>
          </div>
        )}

        {groups.length === 0 && (
          <p className={styles.geneticHint}>
            Las plantas de este cultivo no tienen genética asignada, así que los
            parámetros se guardan como generales del cultivo. Asignales una
            genética para hacer seguimiento por genética.
          </p>
        )}

        <div className={styles.paramsGrid}>
          {MEASUREMENT_FIELDS.map((field) => (
            <Input
              key={`${selectedKey}-${field.key}`}
              label={field.shortLabel}
              inputMode="decimal"
              placeholder="—"
              value={values[selectedKey][field.key]}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  [selectedKey]: {
                    ...prev[selectedKey],
                    [field.key]: e.target.value,
                  },
                }))
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
