import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Droplets, Pencil } from "lucide-react";
import type { EntryDetails } from "@/lib/queries/entries";
import type { CultivationPeriod, Problem } from "@/types/database";
import { dayNumber, formatDate } from "@/lib/utils/dates";
import {
  MEASUREMENT_FIELDS,
  actionLabel,
  formatMeasurement,
  periodForDate,
  periodLabel,
} from "@/lib/utils/labels";
import styles from "./TimelineEntry.module.scss";

type TimelineEntryProps = {
  entry: EntryDetails;
  startDate: string;
  periods: CultivationPeriod[];
  photoUrls: Map<string, string>;
  problems?: Problem[];
  geneticNames?: Record<string, string>;
};

export function TimelineEntry({
  entry,
  startDate,
  periods,
  photoUrls,
  problems = [],
  geneticNames = {},
}: TimelineEntryProps) {
  const day = dayNumber(startDate, entry.entry_date);
  const period = periodForDate(periods, entry.entry_date);
  const measurements = [...entry.measurements].sort((a, b) => {
    const nameA = a.genetic_id ? (geneticNames[a.genetic_id] ?? "") : "\uffff";
    const nameB = b.genetic_id ? (geneticNames[b.genetic_id] ?? "") : "\uffff";
    return nameA.localeCompare(nameB);
  });
  const hasIrrigation = entry.irrigations.length > 0;
  const dayProblems = problems.filter((p) => p.detected_at === entry.entry_date);

  return (
    <article className={styles.entry}>
      <div className={styles.header}>
        <div>
          <p className={styles.day}>Día {day}</p>
          <div className={styles.meta}>
            {period && <span className={styles.period}>{periodLabel(period)}</span>}
            <span>{formatDate(entry.entry_date)}</span>
          </div>
        </div>
        <Link
          href={`/cultivos/${entry.cultivation_id}/registrar?fecha=${entry.entry_date}`}
          className={styles.edit}
          aria-label={`Editar registro del día ${day}`}
        >
          <Pencil size={14} aria-hidden="true" />
          Editar
        </Link>
      </div>

      {measurements.length > 0 && (
        <div className={styles.measurementGroups}>
          {measurements.map((measurement) => {
            const label = measurement.genetic_id
              ? (geneticNames[measurement.genetic_id] ?? "Genética")
              : measurements.length > 1
                ? "Generales"
                : null;
            return (
              <div key={measurement.id}>
                {label && <p className={styles.measurementGenetic}>{label}</p>}
                <div className={styles.measurements}>
                  {MEASUREMENT_FIELDS.map((field) => {
                    const value = measurement[field.key];
                    if (value === null) return null;
                    return (
                      <span key={field.key} className={styles.measurement}>
                        <span>{field.label}</span>
                        {formatMeasurement(field.key, value)}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(hasIrrigation || entry.actions.length > 0) && (
        <div className={styles.badges}>
          {hasIrrigation && (
            <span className={styles.badge}>
              <Droplets size={13} aria-hidden="true" />
              Riego
            </span>
          )}
          {entry.actions.map((action) => (
            <span key={action.id} className={styles.badge}>
              {actionLabel(action.type)}
            </span>
          ))}
        </div>
      )}

      {entry.photos.length > 0 && (
        <div className={styles.photos}>
          {entry.photos.map((photo) => {
            const url = photoUrls.get(photo.storage_path);
            if (!url) return null;
            return (
              <div key={photo.id} className={styles.photo}>
                <Image
                  src={url}
                  alt={photo.caption ?? `Foto del día ${day}`}
                  fill
                  sizes="(max-width: 768px) 30vw, 120px"
                />
              </div>
            );
          })}
        </div>
      )}

      {entry.notes && <p className={styles.notes}>{entry.notes}</p>}

      {dayProblems.length > 0 && (
        <div className={styles.problems}>
          {dayProblems.map((problem) => (
            <Link
              key={problem.id}
              href={`/cultivos/${entry.cultivation_id}/problemas/${problem.id}`}
              className={styles.problem}
            >
              <AlertTriangle size={14} aria-hidden="true" />
              Problema detectado: {problem.title}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
