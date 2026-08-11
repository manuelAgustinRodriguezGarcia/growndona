"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MeasurementPoint } from "@/lib/queries/entries";
import {
  MEASUREMENT_FIELDS,
  formatMeasurement,
  type MeasurementKey,
} from "@/lib/utils/labels";
import { fieldStats } from "@/lib/utils/measurements";
import { formatShortDate } from "@/lib/utils/dates";
import styles from "./MeasurementChart.module.scss";

type MeasurementChartProps = {
  series: MeasurementPoint[];
  keys?: MeasurementKey[];
  height?: number;
  showStats?: boolean;
};

export function MeasurementChart({
  series,
  keys,
  height = 220,
  showStats = false,
}: MeasurementChartProps) {
  const fields = keys
    ? MEASUREMENT_FIELDS.filter((f) => keys.includes(f.key))
    : MEASUREMENT_FIELDS;
  const [selected, setSelected] = useState<MeasurementKey>(fields[0].key);

  const data = useMemo(
    () =>
      series
        .filter((point) => point[selected] !== null)
        .map((point) => ({
          date: point.entry_date,
          value: Number(point[selected]),
        })),
    [series, selected]
  );

  const stats = useMemo(() => fieldStats(series, selected), [series, selected]);
  const selectedField = fields.find((f) => f.key === selected)!;

  return (
    <div className={styles.wrapper}>
      <div className={styles.selector} role="tablist" aria-label="Parámetro">
        {fields.map((field) => (
          <button
            key={field.key}
            type="button"
            role="tab"
            aria-selected={selected === field.key}
            className={`${styles.chip} ${selected === field.key ? styles.chipActive : ""}`}
            onClick={() => setSelected(field.key)}
          >
            {field.label}
          </button>
        ))}
      </div>

      {data.length === 0 ? (
        <p className={styles.empty}>
          Sin datos de {selectedField.label.toLowerCase()} todavía.
        </p>
      ) : (
        <div className={styles.chart} style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -14 }}>
              <CartesianGrid stroke="rgba(0,0,0,0.07)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatShortDate}
                stroke="#5b665d"
                fontSize={11.5}
                tickLine={false}
                axisLine={false}
                minTickGap={28}
              />
              <YAxis
                stroke="#5b665d"
                fontSize={11.5}
                tickLine={false}
                axisLine={false}
                domain={["auto", "auto"]}
                width={46}
              />
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.14)",
                  borderRadius: 10,
                  color: "#171c18",
                  fontSize: 13,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                }}
                labelFormatter={(label) => formatShortDate(String(label))}
                formatter={(value) => [
                  formatMeasurement(selected, Number(value)),
                  selectedField.label,
                ]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#35803c"
                strokeWidth={2}
                dot={{ r: 2.5, fill: "#35803c", strokeWidth: 0 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {showStats && data.length > 0 && (
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Último</span>
            <span className={styles.statValue}>
              {formatMeasurement(selected, stats.last)}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Mínimo</span>
            <span className={styles.statValue}>
              {formatMeasurement(selected, stats.min)}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Máximo</span>
            <span className={styles.statValue}>
              {formatMeasurement(selected, stats.max)}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Promedio</span>
            <span className={styles.statValue}>
              {stats.avg !== null
                ? formatMeasurement(selected, Math.round(stats.avg * 100) / 100)
                : "—"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
