"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  createCultivation,
  createPeriod,
  updateCultivation,
} from "@/lib/queries/cultivations";
import { buildCoverPath, uploadPhoto } from "@/lib/queries/photos";
import { todayISO } from "@/lib/utils/dates";
import {
  ENVIRONMENT_SELECT_OPTIONS,
  METHOD_SELECT_OPTIONS,
  PERIOD_OPTIONS,
  periodTypeLabel,
} from "@/lib/utils/labels";
import type { PeriodType } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { PhotoPicker } from "@/components/photos/PhotoPicker";
import { useToast } from "@/components/ui/Toast";
import styles from "@/styles/form.module.scss";

const INITIAL_PERIOD_OPTIONS = [
  { value: "", label: "Sin período" },
  ...PERIOD_OPTIONS.filter((p) => p.value !== "finished" && p.value !== "custom"),
];

export function NewCultivationForm({ userId }: { userId: string }) {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(todayISO());
  const [plantCount, setPlantCount] = useState("1");
  const [genetics, setGenetics] = useState("");
  const [method, setMethod] = useState("");
  const [customMethod, setCustomMethod] = useState("");
  const [medium, setMedium] = useState("");
  const [environment, setEnvironment] = useState("");
  const [customEnvironment, setCustomEnvironment] = useState("");
  const [description, setDescription] = useState("");
  const [initialPeriod, setInitialPeriod] = useState<PeriodType | "">("germination");
  const [coverFiles, setCoverFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    setError(null);

    const plants = parseInt(plantCount, 10);
    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!startDate) {
      setError("La fecha de inicio es obligatoria.");
      return;
    }
    if (!Number.isFinite(plants) || plants < 1) {
      setError("La cantidad de plantas debe ser al menos 1.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    try {
      const resolvedMethod = method === "Otro" ? customMethod.trim() : method;
      const resolvedEnvironment =
        environment === "Otro" ? customEnvironment.trim() : environment;

      const cultivation = await createCultivation(supabase, {
        user_id: userId,
        name: name.trim(),
        start_date: startDate,
        plant_count: plants,
        genetics: genetics.trim() || null,
        method: resolvedMethod || null,
        medium: medium.trim() || null,
        environment: resolvedEnvironment || null,
        description: description.trim() || null,
      });

      if (coverFiles.length > 0) {
        const path = buildCoverPath(userId, cultivation.id, coverFiles[0].name);
        await uploadPhoto(supabase, path, coverFiles[0]);
        await updateCultivation(supabase, cultivation.id, {
          cover_image_url: path,
        });
      }

      if (initialPeriod) {
        await createPeriod(supabase, {
          cultivation_id: cultivation.id,
          type: initialPeriod,
          name: periodTypeLabel(initialPeriod),
          start_date: startDate,
        });
      }

      toast("Cultivo creado");
      router.push(`/cultivos/${cultivation.id}`);
      router.refresh();
    } catch {
      setError("No se pudo crear el cultivo. Intentá de nuevo.");
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && (
        <p role="alert" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      <div className={styles.block}>
        <span className={styles.blockTitle}>Datos principales</span>
        <Input
          label="Nombre"
          placeholder="Ej: Orbiter #1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className={styles.row}>
          <DatePicker
            label="Fecha de inicio"
            value={startDate}
            onChange={setStartDate}
            required
          />
          <Input
            label="Cantidad de plantas"
            type="number"
            inputMode="numeric"
            min={1}
            value={plantCount}
            onChange={(e) => setPlantCount(e.target.value)}
            required
          />
        </div>
        <Select
          label="Período inicial"
          value={initialPeriod}
          onChange={(next) => setInitialPeriod(next as PeriodType | "")}
          options={INITIAL_PERIOD_OPTIONS}
          placeholder="Sin período"
          hint="Se crea automáticamente al guardar el cultivo."
        />
      </div>

      <div className={styles.block}>
        <span className={styles.blockTitle}>Detalles</span>
        <Input
          label="Genética"
          placeholder="Ej: Orbiter"
          value={genetics}
          onChange={(e) => setGenetics(e.target.value)}
        />
        <div className={styles.row}>
          <Select
            label="Método"
            value={method}
            onChange={setMethod}
            options={METHOD_SELECT_OPTIONS}
            placeholder="Sin especificar"
          />
          <Select
            label="Ambiente"
            value={environment}
            onChange={setEnvironment}
            options={ENVIRONMENT_SELECT_OPTIONS}
            placeholder="Sin especificar"
          />
        </div>
        {method === "Otro" && (
          <Input
            label="Método (otro)"
            placeholder="Describí el método"
            value={customMethod}
            onChange={(e) => setCustomMethod(e.target.value)}
          />
        )}
        {environment === "Otro" && (
          <Input
            label="Ambiente (otro)"
            placeholder="Describí el ambiente"
            value={customEnvironment}
            onChange={(e) => setCustomEnvironment(e.target.value)}
          />
        )}
        <Input
          label="Medio / sustrato"
          placeholder="Ej: Tierra + perlita"
          value={medium}
          onChange={(e) => setMedium(e.target.value)}
        />
        <Textarea
          label="Descripción"
          placeholder="Notas generales sobre este cultivo"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className={styles.block}>
        <span className={styles.blockTitle}>Foto de portada</span>
        <PhotoPicker
          files={coverFiles}
          onChange={setCoverFiles}
          multiple={false}
          disabled={saving}
          label="Elegir foto"
        />
      </div>

      <div className={styles.actions}>
        <Button type="submit" loading={saving}>
          Crear cultivo
        </Button>
      </div>
    </form>
  );
}
