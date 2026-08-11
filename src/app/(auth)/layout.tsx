import { Sprout } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./auth.module.scss";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.logo}>
            <Sprout size={26} aria-hidden="true" />
          </span>
          <span className={styles.name}>Growndona</span>
        </div>
        {children}
      </div>
    </div>
  );
}
