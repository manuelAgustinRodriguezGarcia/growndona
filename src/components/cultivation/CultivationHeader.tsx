import Image from "next/image";
import { Sprout } from "lucide-react";
import type { CultivationWithPeriods } from "@/lib/queries/cultivations";
import { currentDayNumber, daysBetween, formatDate, todayISO } from "@/lib/utils/dates";
import { currentPeriod, periodLabel } from "@/lib/utils/labels";
import styles from "./CultivationHeader.module.scss";

type CultivationHeaderProps = {
  cultivation: CultivationWithPeriods;
  coverUrl: string | null;
};

export function CultivationHeader({
  cultivation,
  coverUrl,
}: CultivationHeaderProps) {
  const isActive = cultivation.status === "active";
  const period = currentPeriod(cultivation.cultivation_periods);
  const day = isActive
    ? currentDayNumber(cultivation.start_date)
    : daysBetween(cultivation.start_date, cultivation.end_date);
  const periodDay =
    isActive && period
      ? currentDayNumber(period.start_date, todayISO())
      : null;

  return (
    <div className={styles.header}>
      <div className={styles.image}>
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={`Portada de ${cultivation.name}`}
            fill
            sizes="96px"
            priority
          />
        ) : (
          <Sprout size={30} aria-hidden="true" />
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.nameRow}>
          <h1 className={styles.name}>{cultivation.name}</h1>
          <span
            className={`${styles.status} ${isActive ? styles.active : styles.finished}`}
          >
            {isActive ? "Activo" : "Finalizado"}
          </span>
        </div>
        <span className={styles.day}>
          {isActive ? `Día ${day}` : `${day} días en total`}
          {isActive && period ? ` · ${periodLabel(period)}` : ""}
        </span>
        <span className={styles.meta}>
          {isActive && period && periodDay
            ? `Día ${periodDay} del período · `
            : ""}
          Inicio: {formatDate(cultivation.start_date)}
          {cultivation.end_date ? ` · Fin: ${formatDate(cultivation.end_date)}` : ""}
        </span>
      </div>
    </div>
  );
}
