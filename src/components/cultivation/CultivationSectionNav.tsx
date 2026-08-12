"use client";

import { useEffect, useRef, useState, useTransition, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
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
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const current = SECTIONS.find((s) => s.key === active) ?? SECTIONS[0];
  const CurrentIcon = current.icon;

  function navigate(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    setOpen(false);
    startTransition(() => {
      router.push(href);
    });
  }

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: globalThis.MouseEvent) {
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
            const href = `/cultivos/${cultivationId}?tab=${section.key}`;
            return (
              <li key={section.key} role="option" aria-selected={selected}>
                <Link
                  href={href}
                  className={`${styles.option} ${selected ? styles.optionActive : ""}`}
                  onClick={(event) => navigate(event, href)}
                >
                  <Icon size={18} aria-hidden="true" />
                  {section.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {isPending && <LoadingScreen />}
    </div>
  );
}
