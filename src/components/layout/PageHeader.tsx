import Link from "next/link";
import type { Route } from "next";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./PageHeader.module.scss";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  backHref?: Route;
  backLabel?: string;
};

export function PageHeader({
  title,
  subtitle,
  action,
  backHref,
  backLabel = "Volver",
}: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titles}>
        {backHref ? (
          <div className={styles.withBack}>
            <Link
              href={backHref}
              className={styles.back}
              aria-label={backLabel === "Volver" ? "Volver" : `Volver a ${backLabel}`}
            >
              <ChevronLeft size={28} strokeWidth={2.25} aria-hidden="true" />
            </Link>
            <div className={styles.titleStack}>
              <h1 className={styles.title}>{title}</h1>
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
          </div>
        ) : (
          <>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </>
        )}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </header>
  );
}
