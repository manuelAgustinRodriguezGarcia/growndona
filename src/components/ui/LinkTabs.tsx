import Link from "next/link";
import type { Route } from "next";
import styles from "./LinkTabs.module.scss";

type LinkTab = {
  href: Route;
  label: string;
  active: boolean;
};

export function LinkTabs({ tabs }: { tabs: LinkTab[] }) {
  return (
    <nav className={styles.tabs} aria-label="Secciones">
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href={tab.href}
          className={`${styles.tab} ${tab.active ? styles.active : ""}`}
          aria-current={tab.active ? "page" : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
