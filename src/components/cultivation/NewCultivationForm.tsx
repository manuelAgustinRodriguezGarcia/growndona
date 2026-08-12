"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  createCultivation,
  createPeriod,
  updateCultivation,
} from "@/lib/queries/cultivations";
import { createPlants } from "@/lib/queries/plants";
import { buildCoverPath, uploadPhoto } from "@/lib/queries/photos";
import { todayISO } from "@/lib/utils/dates";
import { PERIOD_OPTIONS, periodTypeLabel } from "@/lib/utils/labels";
import type { PeriodType } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { PhotoPicker } from "@/components/photos/PhotoPicker";
import { useToast } from "@/components/ui/Toast";
import {
  MAX_PLANTS,
  PlantsSection,
  createPlantDraft,
  resizePlantDrafts,
  resolvePlantDraft,
  sharedPlantValue,
  type PlantDraft,
  type PlantGeneralMode,
} from "@/components/cultivation/PlantsSection";
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
  const [plantDrafts, setPlantDrafts] = useState<PlantDraft[]>(() => [
    createPlantDraft(1),
  ]);
  const [generalMode, setGeneralMode] = useState<PlantGeneralMode | null>(null);
  const [description, setDescription] = useState("");
  const [initialPeriod, setInitialPeriod] = useState<PeriodType | "">("germination");
  const [coverFiles, setCoverFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handlePlantCountChange(raw: string) {
    setPlantCount(raw);
    const parsed = parseInt(raw, 10);
    if (Number.isFinite(parsed) && parsed >= 1) {
      setPlantDrafts((prev) => resizePlantDrafts(prev, parsed));
    }
  }

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
    if (plantDrafts.length > 1 && !generalMode) {
      setError("Seleccioná una opción en Detalles plantas general.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    try {
      const plantValues = plantDrafts.map(resolvePlantDraft);

      const cultivation = await createCultivation(supabase, {
        user_id: userId,
        name: name.trim(),
        start_date: startDate,
        plant_count: plantValues.length,
        genetics: sharedPlantValue(plantValues.map((p) => p.genetics)),
        method: sharedPlantValue(plantValues.map((p) => p.method)),
        medium: sharedPlantValue(plantValues.map((p) => p.medium)),
        environment: sharedPlantValue(plantValues.map((p) => p.environment)),
        description: description.trim() || null,
      });

      await createPlants(supabase, cultivation.id, plantValues);

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
            max={MAX_PLANTS}
            value={plantCount}
            onChange={(e) => handlePlantCountChange(e.target.value)}
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
        <Textarea
          label="Descripción"
          placeholder="Notas generales sobre este cultivo"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <PlantsSection
        plants={plantDrafts}
        onPlantsChange={setPlantDrafts}
        mode={generalMode}
        onModeChange={setGeneralMode}
      />

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
