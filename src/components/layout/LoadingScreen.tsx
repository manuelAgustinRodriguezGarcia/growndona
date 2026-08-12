import Image from "next/image";
import { comfortaa } from "@/lib/fonts";
import styles from "./LoadingScreen.module.scss";

export function LoadingScreen() {
  return (
    <div className={styles.screen} role="status" aria-live="polite">
      <div className={`${styles.brand} ${comfortaa.className}`}>
        <Image
          src="/logo-ligth.png"
          alt=""
          width={120}
          height={120}
          className={styles.logo}
          priority
        />
        <span className={styles.name}>GROWNDONA</span>
      </div>
    </div>
  );
}
