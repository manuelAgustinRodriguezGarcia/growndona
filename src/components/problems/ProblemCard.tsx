import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Problem } from "@/types/database";
import { dayNumber, formatDate } from "@/lib/utils/dates";
import styles from "./ProblemCard.module.scss";

type ProblemCardProps = {
  problem: Problem;
  cultivationStartDate: string;
};

export function ProblemCard({ problem, cultivationStartDate }: ProblemCardProps) {
  const isActive = problem.status === "active";
  const day = dayNumber(cultivationStartDate, problem.detected_at);

  return (
    <Link
      href={`/cultivos/${problem.cultivation_id}/problemas/${problem.id}`}
      className={styles.card}
    >
      <div className={styles.header}>
        <span className={styles.title}>
          {isActive ? (
            <AlertTriangle size={16} className={styles.warning} aria-hidden="true" />
          ) : (
            <CheckCircle2 size={16} className={styles.resolvedIcon} aria-hidden="true" />
          )}
          {problem.title}
        </span>
        <span
          className={`${styles.status} ${isActive ? styles.active : styles.resolved}`}
        >
          {isActive ? "Activo" : "Resuelto"}
        </span>
      </div>
      <span className={styles.meta}>
        Detectado el día {day} · {formatDate(problem.detected_at)}
        {problem.resolved_at ? ` · Resuelto: ${formatDate(problem.resolved_at)}` : ""}
      </span>
      {problem.description && (
        <p className={styles.description}>{problem.description}</p>
      )}
    </Link>
  );
}
