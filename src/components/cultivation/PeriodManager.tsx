"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { changePeriod } from "@/lib/queries/cultivations";
import { todayISO } from "@/lib/utils/dates";
import { PERIOD_OPTIONS, periodTypeLabel } from "@/lib/utils/labels";
import type { PeriodType } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import styles from "@/styles/form.module.scss";

type PeriodManagerProps = {
  cultivationId: string;
  currentPeriodLabel: string | null;
};

export function PeriodManager({
  cultivationId,
  currentPeriodLabel,
}: PeriodManagerProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<PeriodType>("vegetative");
  const [customName, setCustomName] = useState("");
  const [startDate, setStartDate] = useState(todayISO());
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    setError(null);

    const name = type === "custom" ? customName.trim() : periodTypeLabel(type);
    if (!name) {
      setError("Poné un nombre para el período personalizado.");
      return;
    }
    if (!startDate) {
      setError("La fecha de inicio es obligatoria.");
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      await changePeriod(supabase, cultivationId, {
        type,
        name,
        start_date: startDate,
      });
      toast(`Período cambiado a ${name}`);
      setOpen(false);
      router.refresh();
    } catch {
      setError("No se pudo cambiar el período.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Button variant="secondary" size="small" onClick={() => setOpen(true)}>
        Cambiar período
      </Button>
      <Modal open={open} title="Cambiar período" onClose={() => setOpen(false)}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {currentPeriodLabel && (
            <p className="text-muted" style={{ fontSize: 14 }}>
              Período actual: <strong>{currentPeriodLabel}</strong>. Al
              confirmar, el período actual se cierra y comienza el nuevo.
            </p>
          )}
          {error && (
            <p role="alert" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}
          <Select
            label="Nuevo período"
            value={type}
            onChange={(next) => setType(next as PeriodType)}
            options={PERIOD_OPTIONS}
            required
          />
          {type === "custom" && (
            <Input
              label="Nombre del período"
              placeholder="Ej: Lavado de raíces"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              required
            />
          )}
          <DatePicker
            label="Fecha de inicio"
            value={startDate}
            onChange={setStartDate}
            required
          />
          <div className={styles.actions}>
            <Button type="submit" loading={saving}>
              Confirmar cambio
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
