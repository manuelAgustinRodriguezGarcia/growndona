import Image from "next/image";
import Link from "next/link";
import { comfortaa } from "@/lib/fonts";
import styles from "./TopNav.module.scss";

export function TopNav() {
  return (
    <header className={`${styles.nav} ${comfortaa.className}`}>
      <Link
        href="/dashboard"
        className={styles.logoLink}
        aria-hidden="true"
        tabIndex={-1}
      >
        <Image
          src="/logo.png"
          alt=""
          width={64}
          height={64}
          className={styles.logo}
          priority
        />
      </Link>
      <div className={styles.text}>
        <Link href="/dashboard" className={styles.name}>
          GROWNDONA
        </Link>
        <a
          href="https://www.grgsolutions.com.ar/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.credit}
        >
          desarrollado por
          <Image
            src="/logo-grg.svg"
            alt="GRG Solutions"
            width={38}
            height={14}
            className={styles.creditLogo}
          />
        </a>
      </div>
    </header>
  );
}
