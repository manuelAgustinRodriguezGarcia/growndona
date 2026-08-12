"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  deletePeriod,
  updateCultivation,
  updatePeriod,
} from "@/lib/queries/cultivations";
import { daysBetween, formatShortDate } from "@/lib/utils/dates";
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
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import form from "@/styles/form.module.scss";
import styles from "./PeriodList.module.scss";

type PeriodListProps = {
  cultivationId: string;
  periods: CultivationPeriod[];
  isActive: boolean;
  cultivationEndDate: string | null;
  harvestGrams: number | null;
};

export function PeriodList({
  cultivationId,
  periods,
  isActive,
  cultivationEndDate,
  harvestGrams,
}: PeriodListProps) {
  const router = useRouter();
  const { toast } = useToast();

  const last = periods.length > 0 ? periods[periods.length - 1] : null;
  const previous = periods.length > 1 ? periods[periods.length - 2] : null;

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [type, setType] = useState<PeriodType>("vegetative");
  const [customName, setCustomName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [grams, setGrams] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (periods.length === 0) {
    return (
      <p className="text-muted" style={{ fontSize: 14 }}>
        Este cultivo todavía no tiene períodos.
      </p>
    );
  }

  const allowedEditTypes = new Set<PeriodType>(
    allowedNextPeriodTypes(previous?.type ?? null).filter(
      (value) => value !== "finished"
    )
  );
  if (last) allowedEditTypes.add(last.type);
  const editTypeOptions = PERIOD_OPTIONS.filter((option) =>
    allowedEditTypes.has(option.value)
  );

  function openEdit() {
    if (!last) return;
    setType(last.type);
    setCustomName(last.type === "custom" ? last.name : "");
    setStartDate(last.start_date);
    setGrams(
      last.type === "drying" && harvestGrams !== null ? String(harvestGrams) : ""
    );
    setError(null);
    setEditOpen(true);
  }

  async function handleEdit(event: FormEvent) {
    event.preventDefault();
    if (saving || !last) return;
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
    if (previous && startDate < previous.start_date) {
      setError(
        "La fecha de inicio no puede ser anterior al inicio del período previo."
      );
      return;
    }

    let gramsValue: number | null = null;
    if (type === "drying") {
      gramsValue = Number(grams.replace(",", "."));
      if (!grams.trim() || Number.isNaN(gramsValue) || gramsValue <= 0) {
        setError("Ingresá una cantidad de gramos válida.");
        return;
      }
    }

    setSaving(true);
    try {
      const supabase = createClient();
      await updatePeriod(supabase, last.id, {
        type,
        name,
        start_date: startDate,
      });
      if (previous) {
        await updatePeriod(supabase, previous.id, { end_date: startDate });
      }
      if (type === "drying") {
        await updateCultivation(supabase, cultivationId, {
          harvest_grams: gramsValue,
        });
      } else if (last.type === "drying") {
        await updateCultivation(supabase, cultivationId, {
          harvest_grams: null,
        });
      }
      toast("Período actualizado");
      setEditOpen(false);
      router.refresh();
    } catch {
      setError("No se pudo actualizar el período.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (deleting || !last) return;
    setDeleting(true);
    try {
      const supabase = createClient();
      await deletePeriod(supabase, last.id);
      if (previous) {
        await updatePeriod(supabase, previous.id, { end_date: null });
      }
      if (last.type === "drying") {
        await updateCultivation(supabase, cultivationId, {
          harvest_grams: null,
        });
      }
      toast("Período eliminado");
      setDeleteOpen(false);
      router.refresh();
    } catch {
      toast("No se pudo eliminar el período");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {periods.map((period, index) => {
        const isLast = index === periods.length - 1;
        const isOpen = !period.end_date;
        const duration = daysBetween(
          period.start_date,
          period.end_date ?? (isActive ? null : cultivationEndDate)
        );
        return (
          <div key={period.id} className={styles.row}>
            <div>
              <p className={styles.name}>{periodLabel(period)}</p>
              <p className={styles.dates}>
                {formatShortDate(period.start_date)}
                {period.end_date
                  ? ` → ${formatShortDate(period.end_date)}`
                  : " → actual"}
              </p>
            </div>
            <div className={styles.meta}>
              <span className={styles.duration}>
                {isOpen && isActive
                  ? `${duration} días · actual`
                  : `${duration} días`}
              </span>
              {isLast && isActive && (
                <div className={styles.rowActions}>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={openEdit}
                    aria-label="Editar período"
                  >
                    <Pencil size={14} aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => setDeleteOpen(true)}
                    aria-label="Eliminar período"
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <Modal
        open={editOpen}
        title="Editar período"
        onClose={() => setEditOpen(false)}
      >
        <form className={form.form} onSubmit={handleEdit}>
          <p className="text-muted" style={{ fontSize: 14 }}>
            Solo se puede editar el último período del cultivo.
          </p>
          {error && (
            <p role="alert" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}
          <Select
            label="Período"
            value={type}
            onChange={(next) => setType(next as PeriodType)}
            options={editTypeOptions}
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
          {type === "drying" && (
            <Input
              label="Producción en gramos"
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
          <div className={form.actions}>
            <Button type="submit" loading={saving}>
              Guardar cambios
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        title="Eliminar período"
        message={
          last
            ? `¿Eliminar el período "${periodLabel(last)}"? ${
                previous
                  ? `El período anterior (${periodLabel(previous)}) vuelve a quedar como actual.`
                  : "El cultivo queda sin períodos."
              }`
            : ""
        }
        confirmLabel="Eliminar"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
