"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { changePeriod, updateCultivation } from "@/lib/queries/cultivations";
import { todayISO } from "@/lib/utils/dates";
import {
  PERIOD_OPTIONS,
  allowedNextPeriodTypes,
  periodLabel,
  periodTypeLabel,
} from "@/lib/utils/labels";
import type { CultivationPeriod, PeriodType } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import styles from "@/styles/form.module.scss";

type PeriodManagerProps = {
  cultivationId: string;
  currentPeriod: CultivationPeriod | null;
};

export function PeriodManager({
  cultivationId,
  currentPeriod,
}: PeriodManagerProps) {
  const router = useRouter();
  const { toast } = useToast();

  const allowedTypes = allowedNextPeriodTypes(currentPeriod?.type ?? null);
  const typeOptions = PERIOD_OPTIONS.filter((option) =>
    allowedTypes.includes(option.value)
  );
  const currentPeriodLabel = currentPeriod ? periodLabel(currentPeriod) : null;

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<PeriodType>(allowedTypes[0]);
  const [customName, setCustomName] = useState("");
  const [startDate, setStartDate] = useState(todayISO());
  const [grams, setGrams] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const needsGrams = type === "drying" || type === "finished";
  const gramsLabel =
    type === "drying" ? "Producción en gramos" : "Cantidad en gramos";

  function handleOpen() {
    setType(allowedTypes[0]);
    setCustomName("");
    setStartDate(todayISO());
    setGrams("");
    setError(null);
    setOpen(true);
  }

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
    if (currentPeriod && startDate < currentPeriod.start_date) {
      setError(
        "La fecha de inicio no puede ser anterior al inicio del período actual."
      );
      return;
    }

    let gramsValue: number | null = null;
    if (needsGrams) {
      gramsValue = Number(grams.replace(",", "."));
      if (!grams.trim() || Number.isNaN(gramsValue) || gramsValue <= 0) {
        setError("Ingresá una cantidad de gramos válida.");
        return;
      }
    }

    setSaving(true);
    try {
      const supabase = createClient();
      await changePeriod(supabase, cultivationId, {
        type,
        name,
        start_date: startDate,
      });
      if (type === "drying") {
        await updateCultivation(supabase, cultivationId, {
          harvest_grams: gramsValue,
        });
      }
      if (type === "finished") {
        await updateCultivation(supabase, cultivationId, {
          status: "finished",
          end_date: startDate,
          final_grams: gramsValue,
        });
      }
      toast(
        type === "finished" ? "Cultivo finalizado" : `Período cambiado a ${name}`
      );
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
      <Button variant="secondary" size="small" onClick={handleOpen}>
        Cambiar período
      </Button>
      <Modal open={open} title="Cambiar período" onClose={() => setOpen(false)}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {currentPeriodLabel && (
            <p className="text-muted" style={{ fontSize: 14 }}>
              Período actual: <strong>{currentPeriodLabel}</strong>. Al
              confirmar, el período actual se cierra y comienza el nuevo. Solo
              podés avanzar al período siguiente o volver al anterior.
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
            options={typeOptions}
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
          {needsGrams && (
            <Input
              label={gramsLabel}
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              placeholder="Ej: 120"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              required
            />
          )}
          {type === "finished" && (
            <p className="text-muted" style={{ fontSize: 13 }}>
              Al confirmar, el cultivo se marca como finalizado.
            </p>
          )}
          <div className={styles.actions}>
            <Button type="submit" loading={saving}>
              {type === "finished" ? "Finalizar cultivo" : "Confirmar cambio"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
