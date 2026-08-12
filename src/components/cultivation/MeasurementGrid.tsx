import { MEASUREMENT_FIELDS, formatMeasurementValue } from "@/lib/utils/labels";
import type { LatestValue } from "@/lib/utils/measurements";
import type { MeasurementKey } from "@/lib/utils/labels";
import { relativeDate } from "@/lib/utils/dates";
import styles from "./MeasurementGrid.module.scss";

type MeasurementGridProps = {
  latest: Record<MeasurementKey, LatestValue>;
};

export function MeasurementGrid({ latest }: MeasurementGridProps) {
  return (
    <div className={styles.grid}>
      {MEASUREMENT_FIELDS.map((field) => {
        const item = latest[field.key];
        return (
          <div key={field.key} className={styles.cell}>
            <span className={styles.label}>{field.fullLabel}</span>
            <span className={styles.value}>
              {item ? formatMeasurementValue(field.key, item.value) : "—"}
            </span>
            {item && (
              <span className={styles.date}>{relativeDate(item.date)}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
