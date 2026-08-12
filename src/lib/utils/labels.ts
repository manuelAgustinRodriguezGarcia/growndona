import type {
  ActionType,
  CultivationPeriod,
  PeriodType,
} from "@/types/database";

export const PERIOD_OPTIONS: { value: PeriodType; label: string }[] = [
  { value: "germination", label: "Germinación" },
  { value: "seedling", label: "Plántula" },
  { value: "vegetative", label: "Crecimiento" },
  { value: "flowering", label: "Floración" },
  { value: "drying", label: "Secado" },
  { value: "finished", label: "Finalizado" },
  { value: "custom", label: "Personalizado" },
];

export function periodTypeLabel(type: PeriodType): string {
  return PERIOD_OPTIONS.find((p) => p.value === type)?.label ?? type;
}

export function periodLabel(period: Pick<CultivationPeriod, "type" | "name">): string {
  if (period.type === "custom") return period.name;
  return periodTypeLabel(period.type);
}

export function currentPeriod(
  periods: CultivationPeriod[]
): CultivationPeriod | null {
  const open = periods
    .filter((p) => !p.end_date)
    .sort((a, b) => b.start_date.localeCompare(a.start_date));
  if (open.length > 0) return open[0];
  return null;
}

export function sortedPeriods(periods: CultivationPeriod[]): CultivationPeriod[] {
  return [...periods].sort((a, b) => a.start_date.localeCompare(b.start_date));
}

export function periodForDate(
  periods: CultivationPeriod[],
  date: string
): CultivationPeriod | null {
  const candidates = sortedPeriods(periods).filter(
    (p) => p.start_date <= date && (!p.end_date || p.end_date >= date)
  );
  return candidates.length > 0 ? candidates[candidates.length - 1] : null;
}

const PERIOD_STAGE_ORDER: PeriodType[] = [
  "germination",
  "seedling",
  "vegetative",
  "flowering",
  "drying",
  "finished",
];

export function allowedNextPeriodTypes(
  current: PeriodType | null
): PeriodType[] {
  if (!current || current === "custom") {
    return PERIOD_OPTIONS.map((option) => option.value);
  }
  const index = PERIOD_STAGE_ORDER.indexOf(current);
  const allowed: PeriodType[] = [];
  if (index < PERIOD_STAGE_ORDER.length - 1) {
    allowed.push(PERIOD_STAGE_ORDER[index + 1]);
  }
  if (index > 0) {
    allowed.push(PERIOD_STAGE_ORDER[index - 1]);
  }
  allowed.push("custom");
  return allowed;
}

export const ACTION_OPTIONS: { value: ActionType; label: string }[] = [
  { value: "pruning", label: "Poda" },
  { value: "defoliation", label: "Defoliación" },
  { value: "transplant", label: "Trasplante" },
  { value: "training", label: "Entrenamiento" },
  { value: "solution_change", label: "Cambio de solución" },
  { value: "cleaning", label: "Limpieza" },
  { value: "other", label: "Otra" },
];

export function actionLabel(type: ActionType): string {
  return ACTION_OPTIONS.find((a) => a.value === type)?.label ?? type;
}

export const METHOD_OPTIONS = ["Tierra", "Coco", "DWC", "RDWC", "Hidroponía", "Otro"];

export const ENVIRONMENT_OPTIONS = ["Interior", "Exterior", "Invernadero", "Otro"];

const UNSPECIFIED = { value: "", label: "Sin especificar" };

export const METHOD_SELECT_OPTIONS = [
  UNSPECIFIED,
  ...METHOD_OPTIONS.map((option) => ({ value: option, label: option })),
];

export const ENVIRONMENT_SELECT_OPTIONS = [
  UNSPECIFIED,
  ...ENVIRONMENT_OPTIONS.map((option) => ({ value: option, label: option })),
];

export type MeasurementKey = "temperature" | "humidity" | "ph" | "ec" | "ppm";

export const MEASUREMENT_FIELDS: {
  key: MeasurementKey;
  label: string;
  fullLabel: string;
  shortLabel: string;
  unit: string;
  decimals: number;
}[] = [
  { key: "temperature", label: "Temperatura", fullLabel: "Temperatura", shortLabel: "Temp. (°C)", unit: "°C", decimals: 1 },
  { key: "humidity", label: "Humedad", fullLabel: "Humedad", shortLabel: "Hum. (%)", unit: "%", decimals: 0 },
  { key: "ph", label: "pH", fullLabel: "Niveles de pH", shortLabel: "pH", unit: "", decimals: 1 },
  { key: "ec", label: "EC", fullLabel: "Electroconductividad", shortLabel: "EC (µS/cm)", unit: "µS/cm", decimals: 0 },
  { key: "ppm", label: "PPM", fullLabel: "Concentración (PPM)", shortLabel: "PPM", unit: "", decimals: 0 },
];

export function formatMeasurementValue(
  key: MeasurementKey,
  value: number | null | undefined
): string {
  if (value === null || value === undefined) return "—";
  const field = MEASUREMENT_FIELDS.find((f) => f.key === key)!;
  const num = Number(value);
  return Number.isInteger(num) ? String(num) : num.toFixed(field.decimals);
}

export function formatMeasurement(
  key: MeasurementKey,
  value: number | null | undefined
): string {
  const text = formatMeasurementValue(key, value);
  if (text === "—") return text;
  const field = MEASUREMENT_FIELDS.find((f) => f.key === key)!;
  return field.unit ? `${text} ${field.unit}` : text;
}
