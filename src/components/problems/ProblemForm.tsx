"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { createProblem, addProblemPhotoRecord } from "@/lib/queries/problems";
import { buildProblemPhotoPath, uploadPhoto } from "@/lib/queries/photos";
import { todayISO } from "@/lib/utils/dates";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { DatePicker } from "@/components/ui/DatePicker";
import { PhotoPicker } from "@/components/photos/PhotoPicker";
import { useToast } from "@/components/ui/Toast";
import styles from "@/styles/form.module.scss";

type ProblemFormProps = {
  cultivationId: string;
  userId: string;
};

export function ProblemForm({ cultivationId, userId }: ProblemFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [detectedAt, setDetectedAt] = useState(todayISO());
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    setError(null);

    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    if (!detectedAt) {
      setError("La fecha es obligatoria.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    try {
      const problem = await createProblem(supabase, {
        cultivation_id: cultivationId,
        title: title.trim(),
        detected_at: detectedAt,
        description: description.trim() || null,
      });

      for (const file of files) {
        const path = buildProblemPhotoPath(
          userId,
          cultivationId,
          problem.id,
          file.name
        );
        await uploadPhoto(supabase, path, file);
        await addProblemPhotoRecord(supabase, problem.id, path);
      }

      toast("Problema registrado");
      router.push(`/cultivos/${cultivationId}/problemas/${problem.id}`);
      router.refresh();
    } catch {
      setError("No se pudo registrar el problema. Intentá de nuevo.");
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
        <Input
          label="Título"
          placeholder="Ej: Hojas amarillas en la parte baja"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <DatePicker
          label="Fecha de detección"
          value={detectedAt}
          onChange={setDetectedAt}
          required
        />
        <Textarea
          label="Descripción"
          placeholder="Describí lo que observaste"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className={styles.block}>
        <span className={styles.blockTitle}>Fotos</span>
        <PhotoPicker files={files} onChange={setFiles} disabled={saving} />
      </div>
      <div className={styles.actions}>
        <Button type="submit" loading={saving}>
          Registrar problema
        </Button>
      </div>
    </form>
  );
}
