"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Flag, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  deleteCultivation,
  finishCultivation,
} from "@/lib/queries/cultivations";
import { todayISO } from "@/lib/utils/dates";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { DatePicker } from "@/components/ui/DatePicker";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import styles from "@/styles/form.module.scss";

type CultivationDangerZoneProps = {
  cultivationId: string;
  cultivationName: string;
  isActive: boolean;
};

export function CultivationDangerZone({
  cultivationId,
  cultivationName,
  isActive,
}: CultivationDangerZoneProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [finishOpen, setFinishOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [endDate, setEndDate] = useState(todayISO());
  const [finalNotes, setFinalNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFinish(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError(null);
    if (!endDate) {
      setError("La fecha final es obligatoria.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      await finishCultivation(
        supabase,
        cultivationId,
        endDate,
        finalNotes.trim() || null
      );
      toast("Cultivo finalizado");
      setFinishOpen(false);
      router.refresh();
    } catch {
      setError("No se pudo finalizar el cultivo.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (busy) return;
    setBusy(true);
    try {
      const supabase = createClient();
      await deleteCultivation(supabase, cultivationId);
      toast("Cultivo eliminado");
      router.push("/cultivos");
      router.refresh();
    } catch {
      toast("No se pudo eliminar el cultivo", "error");
      setBusy(false);
    }
  }

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isActive ? "1fr 1fr" : "1fr",
          gap: 10,
        }}
      >
        {isActive && (
          <Button variant="secondary" full onClick={() => setFinishOpen(true)}>
            <Flag size={16} aria-hidden="true" />
            Finalizar cultivo
          </Button>
        )}
        <Button variant="danger" full onClick={() => setDeleteConfirm(true)}>
          <Trash2 size={16} aria-hidden="true" />
          Eliminar
        </Button>
      </div>

      <Modal
        open={finishOpen}
        title="Finalizar cultivo"
        onClose={() => setFinishOpen(false)}
      >
        <form className={styles.form} onSubmit={handleFinish}>
          <p className="text-muted" style={{ fontSize: 14 }}>
            El cultivo pasará a estado finalizado y se cerrará el período
            actual. El historial se conserva completo.
          </p>
          {error && (
            <p role="alert" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}
          <DatePicker
            label="Fecha final"
            value={endDate}
            onChange={setEndDate}
            required
          />
          <Textarea
            label="Nota final (opcional)"
            placeholder="Resultado, aprendizajes, rendimiento…"
            value={finalNotes}
            onChange={(e) => setFinalNotes(e.target.value)}
          />
          <div className={styles.actions}>
            <Button type="submit" loading={busy}>
              Finalizar cultivo
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteConfirm}
        title="Eliminar cultivo"
        message={`Se eliminará "${cultivationName}" con todos sus registros, fotos y problemas. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar definitivamente"
        danger
        loading={busy}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
      />
    </>
  );
}
