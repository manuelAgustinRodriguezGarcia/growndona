import type { EntryDetails, MeasurementPoint } from "@/lib/queries/entries";
import type { MeasurementKey } from "@/lib/utils/labels";
import { MEASUREMENT_FIELDS } from "@/lib/utils/labels";
import type { CultivationGenetic } from "@/types/database";

export const GENERAL_SERIES_LABEL = "Generales";

export type GeneticSeries = {
  geneticId: string | null;
  label: string;
  series: MeasurementPoint[];
};

export function buildGeneticSeries(
  entries: EntryDetails[],
  genetics: CultivationGenetic[]
): GeneticSeries[] {
  const byId = new Map<string | null, MeasurementPoint[]>();

  const ascending = [...entries].sort((a, b) =>
    a.entry_date.localeCompare(b.entry_date)
  );
  for (const entry of ascending) {
    for (const measurement of entry.measurements) {
      const key = measurement.genetic_id;
      const list = byId.get(key) ?? [];
      list.push({
        entry_date: entry.entry_date,
        temperature: measurement.temperature,
        humidity: measurement.humidity,
        ph: measurement.ph,
        ec: measurement.ec,
        ppm: measurement.ppm,
      });
      byId.set(key, list);
    }
  }

  const result: GeneticSeries[] = [];
  for (const genetic of genetics) {
    const series = byId.get(genetic.id);
    if (series) {
      result.push({ geneticId: genetic.id, label: genetic.name, series });
    }
  }
  const general = byId.get(null);
  if (general) {
    result.push({ geneticId: null, label: GENERAL_SERIES_LABEL, series: general });
  }
  return result;
}

export type LatestValue = { value: number; date: string } | null;

export function latestPerField(
  series: MeasurementPoint[]
): Record<MeasurementKey, LatestValue> {
  const result = {
    temperature: null,
    humidity: null,
    ph: null,
    ec: null,
    ppm: null,
  } as Record<MeasurementKey, LatestValue>;

  for (const point of series) {
    for (const field of MEASUREMENT_FIELDS) {
      const value = point[field.key];
      if (value !== null) {
        result[field.key] = { value: Number(value), date: point.entry_date };
      }
    }
  }
  return result;
}

export type FieldStats = {
  last: number | null;
  min: number | null;
  max: number | null;
  avg: number | null;
};

export function fieldStats(
  series: MeasurementPoint[],
  key: MeasurementKey
): FieldStats {
  const values = series
    .map((p) => p[key])
    .filter((v): v is number => v !== null)
    .map(Number);

  if (values.length === 0) {
    return { last: null, min: null, max: null, avg: null };
  }

  return {
    last: values[values.length - 1],
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((a, b) => a + b, 0) / values.length,
  };
}
