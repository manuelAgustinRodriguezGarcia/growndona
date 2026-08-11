import type { MeasurementPoint } from "@/lib/queries/entries";
import type { MeasurementKey } from "@/lib/utils/labels";
import { MEASUREMENT_FIELDS } from "@/lib/utils/labels";

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
