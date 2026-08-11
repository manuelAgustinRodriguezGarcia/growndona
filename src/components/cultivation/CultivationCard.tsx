import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Sprout } from "lucide-react";
import type { CultivationWithPeriods } from "@/lib/queries/cultivations";
import { currentDayNumber, daysBetween, formatDate } from "@/lib/utils/dates";
import { currentPeriod, periodLabel } from "@/lib/utils/labels";
import styles from "./CultivationCard.module.scss";

type CultivationCardProps = {
  cultivation: CultivationWithPeriods;
  coverUrl: string | null;
  href?: Route;
};

export function CultivationCard({
  cultivation,
  coverUrl,
  href,
}: CultivationCardProps) {
  const period = currentPeriod(cultivation.cultivation_periods);
  const isActive = cultivation.status === "active";
  const day = isActive
    ? currentDayNumber(cultivation.start_date)
    : daysBetween(cultivation.start_date, cultivation.end_date);

  return (
    <Link href={href ?? `/cultivos/${cultivation.id}`} className={styles.card}>
      <div className={styles.image}>
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={`Portada de ${cultivation.name}`}
            fill
            sizes="92px"
          />
        ) : (
          <Sprout size={30} aria-hidden="true" />
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={styles.name}>{cultivation.name}</span>
          <span
            className={`${styles.status} ${isActive ? styles.active : styles.finished}`}
          >
            {isActive ? "Activo" : "Finalizado"}
          </span>
        </div>
        <span className={styles.day}>
          {isActive ? `Día ${day}` : `${day} días`}
          {isActive && period ? ` · ${periodLabel(period)}` : ""}
        </span>
        <div className={styles.meta}>
          <span>Inicio: {formatDate(cultivation.start_date)}</span>
          <span>
            {cultivation.plant_count}{" "}
            {cultivation.plant_count === 1 ? "planta" : "plantas"}
          </span>
        </div>
      </div>
    </Link>
  );
}
