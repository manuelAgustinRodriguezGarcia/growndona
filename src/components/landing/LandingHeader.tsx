import Link from "next/link";
import Image from "next/image";
import { comfortaa } from "@/lib/fonts";
import styles from "./LandingHeader.module.scss";

const NAV_LINKS = [
  { href: "#funciones", label: "Funciones" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#precio", label: "Pago único" },
];

export function LandingHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="#inicio" className={styles.brand}>
          <Image
            src="/logo-ligth.png"
            alt="Growndona"
            width={34}
            height={34}
            className={styles.brandMark}
          />
          <span className={`${styles.brandName} ${comfortaa.className}`}>
            GROWNDONA
          </span>
        </a>

        <nav className={styles.nav} aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
          <Link href="/login" className={styles.navLink}>
            Iniciar sesión
          </Link>
          <Link href="/register" className={styles.cta}>
            Pedir tu prueba gratuita
          </Link>
        </nav>

        <Link href="/login" className={styles.mobileLogin}>
          Iniciar sesión
        </Link>
      </div>
    </header>
  );
}
