"use client";

import { useState } from "react";
import { Check, ChevronDown, Sprout } from "lucide-react";
import {
  ENVIRONMENT_OPTIONS,
  ENVIRONMENT_SELECT_OPTIONS,
  METHOD_OPTIONS,
  METHOD_SELECT_OPTIONS,
} from "@/lib/utils/labels";
import type { Plant } from "@/types/database";
import type { PlantValues } from "@/lib/queries/plants";
import { Input, Textarea } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import form from "@/styles/form.module.scss";
import styles from "./PlantsSection.module.scss";

export const MAX_PLANTS = 100;

export type PlantDraft = {
  key: string;
  dbId: string | null;
  number: number;
  genetics: string;
  method: string;
  customMethod: string;
  environment: string;
  customEnvironment: string;
  medium: string;
  description: string;
};

export type PlantGeneralMode =
  | "independent"
  | "same_method"
  | "same_genetics"
  | "same_both";

const GENERAL_MODE_OPTIONS: {
  value: PlantGeneralMode;
  title: string;
  description: string;
}[] = [
  {
    value: "independent",
    title: "Diferentes métodos y genéticas",
    description: "Cada planta podrá tener su propia genética y método de cultivo.",
  },
  {
    value: "same_method",
    title: "Mismo Método",
    description:
      "Todas las plantas utilizarán inicialmente el mismo método de cultivo. Podrás modificar plantas individuales después.",
  },
  {
    value: "same_genetics",
    title: "Misma Genética",
    description:
      "Todas las plantas tendrán inicialmente la misma genética. Podrás modificar plantas individuales después.",
  },
  {
    value: "same_both",
    title: "Misma Genética y Método",
    description:
      "Todas las plantas tendrán inicialmente la misma genética y utilizarán el mismo método de cultivo. Podrás modificar plantas individuales después.",
  },
];

export function createPlantDraft(number: number): PlantDraft {
  return {
    key: crypto.randomUUID(),
    dbId: null,
    number,
    genetics: "",
    method: "",
    customMethod: "",
    environment: "",
    customEnvironment: "",
    medium: "",
    description: "",
  };
}

export function plantDraftFromValues(
  values: {
    genetics: string | null;
    method: string | null;
    environment: string | null;
    medium: string | null;
    description: string | null;
  },
  number: number,
  dbId: string | null
): PlantDraft {
  const knownMethod = !values.method || METHOD_OPTIONS.includes(values.method);
  const knownEnvironment =
    !values.environment || ENVIRONMENT_OPTIONS.includes(values.environment);
  return {
    key: dbId ?? crypto.randomUUID(),
    dbId,
    number,
    genetics: values.genetics ?? "",
    method: knownMethod ? (values.method ?? "") : "Otro",
    customMethod: knownMethod ? "" : (values.method ?? ""),
    environment: knownEnvironment ? (values.environment ?? "") : "Otro",
    customEnvironment: knownEnvironment ? "" : (values.environment ?? ""),
    medium: values.medium ?? "",
    description: values.description ?? "",
  };
}

export function plantDraftFromDb(plant: Plant): PlantDraft {
  return plantDraftFromValues(plant, plant.number, plant.id);
}

export function resizePlantDrafts(
  plants: PlantDraft[],
  count: number
): PlantDraft[] {
  const target = Math.max(1, Math.min(count, MAX_PLANTS));
  if (target === plants.length) return plants;
  if (target < plants.length) return plants.slice(0, target);
  const next = [...plants];
  for (let number = plants.length + 1; number <= target; number += 1) {
    next.push(createPlantDraft(number));
  }
  return next;
}

export function resolvePlantDraft(plant: PlantDraft): PlantValues {
  const method =
    plant.method === "Otro" ? plant.customMethod.trim() : plant.method;
  const environment =
    plant.environment === "Otro"
      ? plant.customEnvironment.trim()
      : plant.environment;
  return {
    number: plant.number,
    genetics: plant.genetics.trim() || null,
    method: method || null,
    environment: environment || null,
    medium: plant.medium.trim() || null,
    description: plant.description.trim() || null,
  };
}

export function sharedPlantValue(values: (string | null)[]): string | null {
  const first = values[0] ?? null;
  if (first === null) return null;
  return values.every((value) => value === first) ? first : null;
}

export function plantTitle(genetics: string | null, number: number): string {
  const name = genetics?.trim();
  return name ? `${name} #${number}` : `Planta #${number}`;
}

function plantSummary(plant: PlantDraft): string {
  const resolved = resolvePlantDraft(plant);
  const parts = [resolved.method, resolved.environment].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "Sin configurar";
}

type PlantFieldsProps = {
  plant: PlantDraft;
  onChange: (patch: Partial<PlantDraft>) => void;
};

function PlantFields({ plant, onChange }: PlantFieldsProps) {
  return (
    <>
      <Input
        label="Genética"
        placeholder="Ej: Northern Lights"
        value={plant.genetics}
        onChange={(e) => onChange({ genetics: e.target.value })}
      />
      <div className={form.row}>
        <Select
          label="Método"
          value={plant.method}
          onChange={(value) =>
            onChange({
              method: value,
              customMethod: value === "Otro" ? plant.customMethod : "",
            })
          }
          options={METHOD_SELECT_OPTIONS}
          placeholder="Sin especificar"
        />
        <Select
          label="Ambiente"
          value={plant.environment}
          onChange={(value) =>
            onChange({
              environment: value,
              customEnvironment: value === "Otro" ? plant.customEnvironment : "",
            })
          }
          options={ENVIRONMENT_SELECT_OPTIONS}
          placeholder="Sin especificar"
        />
      </div>
      {plant.method === "Otro" && (
        <Input
          label="Método (otro)"
          placeholder="Describí el método"
          value={plant.customMethod}
          onChange={(e) => onChange({ customMethod: e.target.value })}
        />
      )}
      {plant.environment === "Otro" && (
        <Input
          label="Ambiente (otro)"
          placeholder="Describí el ambiente"
          value={plant.customEnvironment}
          onChange={(e) => onChange({ customEnvironment: e.target.value })}
        />
      )}
      <Input
        label="Medio / sustrato"
        placeholder="Ej: Tierra + perlita"
        value={plant.medium}
        onChange={(e) => onChange({ medium: e.target.value })}
      />
      <Textarea
        label="Descripción"
        placeholder="Notas sobre esta planta"
        value={plant.description}
        onChange={(e) => onChange({ description: e.target.value })}
      />
    </>
  );
}

type PlantCardProps = {
  plant: PlantDraft;
  open: boolean;
  onToggle: () => void;
  onChange: (patch: Partial<PlantDraft>) => void;
};

function PlantCard({ plant, open, onToggle, onChange }: PlantCardProps) {
  return (
    <div className={styles.plantCard}>
      <button
        type="button"
        className={styles.plantHeader}
        onClick={onToggle}
        aria-expanded={open}
      >
        <Sprout size={18} className={styles.plantIcon} aria-hidden="true" />
        <span className={styles.plantHeaderText}>
          <span className={styles.plantName}>
            {plantTitle(plant.genetics, plant.number)}
          </span>
          <span className={styles.plantSummary}>{plantSummary(plant)}</span>
        </span>
        <ChevronDown
          size={18}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className={styles.plantBody}>
          <PlantFields plant={plant} onChange={onChange} />
        </div>
      )}
    </div>
  );
}

type PlantsSectionProps = {
  plants: PlantDraft[];
  onPlantsChange: (plants: PlantDraft[]) => void;
  mode: PlantGeneralMode | null;
  onModeChange: (mode: PlantGeneralMode) => void;
};

export function PlantsSection({
  plants,
  onPlantsChange,
  mode,
  onModeChange,
}: PlantsSectionProps) {
  const [generalGenetics, setGeneralGenetics] = useState("");
  const [generalMethod, setGeneralMethod] = useState("");
  const [generalCustomMethod, setGeneralCustomMethod] = useState("");
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

  function patchPlant(key: string, patch: Partial<PlantDraft>) {
    onPlantsChange(
      plants.map((plant) => (plant.key === key ? { ...plant, ...patch } : plant))
    );
  }

  function patchAll(patch: Partial<PlantDraft>) {
    onPlantsChange(plants.map((plant) => ({ ...plant, ...patch })));
  }

  function toggleOpen(key: string) {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  if (plants.length === 0) return null;

  if (plants.length === 1) {
    return (
      <div className={form.block}>
        <span className={form.blockTitle}>Planta 1</span>
        <PlantFields
          plant={plants[0]}
          onChange={(patch) => patchPlant(plants[0].key, patch)}
        />
      </div>
    );
  }

  const showGeneralGenetics = mode === "same_genetics" || mode === "same_both";
  const showGeneralMethod = mode === "same_method" || mode === "same_both";

  return (
    <>
      <div className={form.block}>
        <span className={form.blockTitle}>Detalles plantas general</span>
        <div
          className={styles.options}
          role="radiogroup"
          aria-label="Detalles plantas general"
        >
          {GENERAL_MODE_OPTIONS.map((option) => {
            const active = mode === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                className={`${styles.option} ${active ? styles.optionActive : ""}`}
                onClick={() => onModeChange(option.value)}
              >
                <span
                  className={`${styles.optionIndicator} ${
                    active ? styles.optionIndicatorActive : ""
                  }`}
                  aria-hidden="true"
                >
                  {active && <Check size={12} strokeWidth={3} />}
                </span>
                <span className={styles.optionContent}>
                  <span className={styles.optionTitle}>{option.title}</span>
                  <span className={styles.optionText}>{option.description}</span>
                </span>
              </button>
            );
          })}
        </div>
        {showGeneralGenetics && (
          <Input
            label="Genética general"
            placeholder="Ej: Northern Lights"
            value={generalGenetics}
            onChange={(e) => {
              setGeneralGenetics(e.target.value);
              patchAll({ genetics: e.target.value });
            }}
            hint="Se copia a todas las plantas. Después podés modificar cada planta individualmente."
          />
        )}
        {showGeneralMethod && (
          <>
            <Select
              label="Método general"
              value={generalMethod}
              onChange={(value) => {
                setGeneralMethod(value);
                if (value !== "Otro") setGeneralCustomMethod("");
                patchAll({
                  method: value,
                  customMethod: value === "Otro" ? generalCustomMethod : "",
                });
              }}
              options={METHOD_SELECT_OPTIONS}
              placeholder="Sin especificar"
              hint="Se copia a todas las plantas. Después podés modificar cada planta individualmente."
            />
            {generalMethod === "Otro" && (
              <Input
                label="Método general (otro)"
                placeholder="Describí el método"
                value={generalCustomMethod}
                onChange={(e) => {
                  setGeneralCustomMethod(e.target.value);
                  patchAll({ customMethod: e.target.value });
                }}
              />
            )}
          </>
        )}
      </div>

      <div className={form.block}>
        <span className={form.blockTitle}>Plantas</span>
        <div className={styles.plantList}>
          {plants.map((plant) => (
            <PlantCard
              key={plant.key}
              plant={plant}
              open={openKeys.has(plant.key)}
              onToggle={() => toggleOpen(plant.key)}
              onChange={(patch) => patchPlant(plant.key, patch)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
