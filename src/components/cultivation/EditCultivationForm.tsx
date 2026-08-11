"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateCultivation } from "@/lib/queries/cultivations";
import {
  buildCoverPath,
  removeStorageFiles,
  uploadPhoto,
} from "@/lib/queries/photos";
import { ENVIRONMENT_OPTIONS, METHOD_OPTIONS } from "@/lib/utils/labels";
import type { Cultivation } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { PhotoPicker } from "@/components/photos/PhotoPicker";
import { useToast } from "@/components/ui/Toast";
import styles from "@/styles/form.module.scss";

type EditCultivationFormProps = {
  cultivation: Cultivation;
  userId: string;
};

export function EditCultivationForm({
  cultivation,
  userId,
}: EditCultivationFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const knownMethod =
    !cultivation.method || METHOD_OPTIONS.includes(cultivation.method);
  const knownEnvironment =
    !cultivation.environment ||
    ENVIRONMENT_OPTIONS.includes(cultivation.environment);

  const [name, setName] = useState(cultivation.name);
  const [startDate, setStartDate] = useState(cultivation.start_date);
  const [plantCount, setPlantCount] = useState(String(cultivation.plant_count));
  const [genetics, setGenetics] = useState(cultivation.genetics ?? "");
  const [method, setMethod] = useState(
    knownMethod ? (cultivation.method ?? "") : "Otro"
  );
  const [customMethod, setCustomMethod] = useState(
    knownMethod ? "" : (cultivation.method ?? "")
  );
  const [medium, setMedium] = useState(cultivation.medium ?? "");
  const [environment, setEnvironment] = useState(
    knownEnvironment ? (cultivation.environment ?? "") : "Otro"
  );
  const [customEnvironment, setCustomEnvironment] = useState(
    knownEnvironment ? "" : (cultivation.environment ?? "")
  );
  const [description, setDescription] = useState(cultivation.description ?? "");
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
      let coverPath = cultivation.cover_image_url;
      if (coverFiles.length > 0) {
        const newPath = buildCoverPath(userId, cultivation.id, coverFiles[0].name);
        await uploadPhoto(supabase, newPath, coverFiles[0]);
        if (coverPath) {
          await removeStorageFiles(supabase, [coverPath]).catch(() => {});
        }
        coverPath = newPath;
      }

      const resolvedMethod = method === "Otro" ? customMethod.trim() : method;
      const resolvedEnvironment =
        environment === "Otro" ? customEnvironment.trim() : environment;

      await updateCultivation(supabase, cultivation.id, {
        name: name.trim(),
        start_date: startDate,
        plant_count: plants,
        genetics: genetics.trim() || null,
        method: resolvedMethod || null,
        medium: medium.trim() || null,
        environment: resolvedEnvironment || null,
        description: description.trim() || null,
        cover_image_url: coverPath,
      });

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
          <Input
            label="Fecha de inicio"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
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
      </div>

      <div className={styles.block}>
        <span className={styles.blockTitle}>Detalles</span>
        <Input
          label="Genética"
          value={genetics}
          onChange={(e) => setGenetics(e.target.value)}
        />
        <div className={styles.row}>
          <Select
            label="Método"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="">Sin especificar</option>
            {METHOD_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <Select
            label="Ambiente"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
          >
            <option value="">Sin especificar</option>
            {ENVIRONMENT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
        {method === "Otro" && (
          <Input
            label="Método (otro)"
            value={customMethod}
            onChange={(e) => setCustomMethod(e.target.value)}
          />
        )}
        {environment === "Otro" && (
          <Input
            label="Ambiente (otro)"
            value={customEnvironment}
            onChange={(e) => setCustomEnvironment(e.target.value)}
          />
        )}
        <Input
          label="Medio / sustrato"
          value={medium}
          onChange={(e) => setMedium(e.target.value)}
        />
        <Textarea
          label="Descripción"
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
