"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateCultivation } from "@/lib/queries/cultivations";
import {
  createPlants,
  deletePlants,
  updatePlant,
} from "@/lib/queries/plants";
import {
  buildCoverPath,
  removeStorageFiles,
  uploadPhoto,
} from "@/lib/queries/photos";
import type { Cultivation, Plant } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { DatePicker } from "@/components/ui/DatePicker";
import { PhotoPicker } from "@/components/photos/PhotoPicker";
import { useToast } from "@/components/ui/Toast";
import {
  MAX_PLANTS,
  PlantsSection,
  plantDraftFromDb,
  plantDraftFromValues,
  resizePlantDrafts,
  resolvePlantDraft,
  sharedPlantValue,
  type PlantDraft,
  type PlantGeneralMode,
} from "@/components/cultivation/PlantsSection";
import styles from "@/styles/form.module.scss";

type EditCultivationFormProps = {
  cultivation: Cultivation;
  plants: Plant[];
  userId: string;
};

function initialDrafts(cultivation: Cultivation, plants: Plant[]): PlantDraft[] {
  if (plants.length > 0) return plants.map(plantDraftFromDb);
  const count = Math.max(1, Math.min(cultivation.plant_count, MAX_PLANTS));
  return Array.from({ length: count }, (_, index) =>
    plantDraftFromValues(cultivation, index + 1, null)
  );
}

export function EditCultivationForm({
  cultivation,
  plants,
  userId,
}: EditCultivationFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState(cultivation.name);
  const [startDate, setStartDate] = useState(cultivation.start_date);
  const [plantCount, setPlantCount] = useState(String(cultivation.plant_count));
  const [plantDrafts, setPlantDrafts] = useState<PlantDraft[]>(() =>
    initialDrafts(cultivation, plants)
  );
  const [generalMode, setGeneralMode] = useState<PlantGeneralMode | null>(
    "independent"
  );
  const [description, setDescription] = useState(cultivation.description ?? "");
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

    const parsedCount = parseInt(plantCount, 10);
    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!startDate) {
      setError("La fecha de inicio es obligatoria.");
      return;
    }
    if (!Number.isFinite(parsedCount) || parsedCount < 1) {
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
      let coverPath = cultivation.cover_image_url;
      if (coverFiles.length > 0) {
        const newPath = buildCoverPath(userId, cultivation.id, coverFiles[0].name);
        await uploadPhoto(supabase, newPath, coverFiles[0]);
        if (coverPath) {
          await removeStorageFiles(supabase, [coverPath]).catch(() => {});
        }
        coverPath = newPath;
      }

      const plantValues = plantDrafts.map(resolvePlantDraft);

      await updateCultivation(supabase, cultivation.id, {
        name: name.trim(),
        start_date: startDate,
        plant_count: plantValues.length,
        genetics: sharedPlantValue(plantValues.map((p) => p.genetics)),
        method: sharedPlantValue(plantValues.map((p) => p.method)),
        medium: sharedPlantValue(plantValues.map((p) => p.medium)),
        environment: sharedPlantValue(plantValues.map((p) => p.environment)),
        description: description.trim() || null,
        cover_image_url: coverPath,
      });

      const keptIds = new Set(
        plantDrafts.map((draft) => draft.dbId).filter(Boolean)
      );
      const removedIds = plants
        .filter((plant) => !keptIds.has(plant.id))
        .map((plant) => plant.id);

      await deletePlants(supabase, removedIds);
      await Promise.all(
        plantDrafts
          .filter((draft) => draft.dbId)
          .map((draft) =>
            updatePlant(supabase, draft.dbId!, resolvePlantDraft(draft))
          )
      );
      await createPlants(
        supabase,
        cultivation.id,
        plantDrafts.filter((draft) => !draft.dbId).map(resolvePlantDraft)
      );

      toast("Cultivo actualizado");
      router.push(`/cultivos/${cultivation.id}?tab=info`);
      router.refresh();
    } catch {
      setError("No se pudo guardar los cambios. Intentá de nuevo.");
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
        <Textarea
          label="Descripción"
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
          label={cultivation.cover_image_url ? "Reemplazar foto" : "Elegir foto"}
        />
      </div>

      <div className={styles.actions}>
        <Button type="submit" loading={saving}>
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
