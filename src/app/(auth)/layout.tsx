import Image from "next/image";
import type { ReactNode } from "react";
import { comfortaa } from "@/lib/fonts";
import styles from "./auth.module.scss";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={styles.background} />
      <div className={styles.card}>
        <div className={`${styles.brand} ${comfortaa.className}`}>
          <Image
            src="/logo-ligth.png"
            alt=""
            width={52}
            height={52}
            className={styles.logo}
            priority
          />
          <span className={styles.name}>GROWNDONA</span>
        </div>
        {children}
        <a
          href="https://grgsolutions.com.ar"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.developedBy}
        >
          <span>Desarrollado por</span>
          <Image
            src="/logo-grg-negro.svg"
            alt="GRG Solutions"
            width={49}
            height={18}
            className={styles.developedByLogo}
          />
        </a>
      </div>
    </div>
  );
}
