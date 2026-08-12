"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isActivePath } from "./navItems";
import styles from "./BottomNav.module.scss";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Navegación principal">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActivePath(pathname, item.href);
        const classes = [
          styles.item,
          active ? styles.active : "",
          item.highlight ? styles.highlight : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={classes}
            aria-current={active ? "page" : undefined}
          >
            <span>
              <Icon size={21} aria-hidden="true" />
            </span>
            {item.shortLabel}
          </Link>
        );
      })}
    </nav>
  );
}
