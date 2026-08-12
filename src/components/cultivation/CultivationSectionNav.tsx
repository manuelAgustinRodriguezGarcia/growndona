"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  History,
  Images,
  Info,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import styles from "./CultivationSectionNav.module.scss";

const SECTIONS: {
  key: string;
  label: string;
  icon: LucideIcon;
}[] = [
  { key: "resumen", label: "Resumen", icon: LayoutDashboard },
  { key: "timeline", label: "Timeline", icon: History },
  { key: "parametros", label: "Parámetros", icon: Activity },
  { key: "galeria", label: "Galería", icon: Images },
  { key: "problemas", label: "Problemas", icon: AlertTriangle },
  { key: "info", label: "Información", icon: Info },
];

type CultivationSectionNavProps = {
  cultivationId: string;
  active: string;
};

export function CultivationSectionNav({
  cultivationId,
  active,
}: CultivationSectionNavProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const current = SECTIONS.find((s) => s.key === active) ?? SECTIONS[0];
  const CurrentIcon = current.icon;

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Secciones"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.triggerMain}>
          <CurrentIcon size={18} aria-hidden="true" />
          {current.label}
        </span>
        <ChevronDown
          size={18}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <ul className={styles.menu} role="listbox" aria-label="Secciones">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const selected = section.key === current.key;
            return (
              <li key={section.key} role="option" aria-selected={selected}>
                <Link
                  href={`/cultivos/${cultivationId}?tab=${section.key}`}
                  className={`${styles.option} ${selected ? styles.optionActive : ""}`}
                  onClick={() => setOpen(false)}
                >
                  <Icon size={18} aria-hidden="true" />
                  {section.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
