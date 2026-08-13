"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import styles from "./LandingMenu.module.scss";

const MENU_LINKS = [
  { href: "#funciones", label: "¿Para qué sirve?" },
  { href: "#como-funciona", label: "¿Cómo funciona?" },
  { href: "#precio", label: "¿Es gratis?" },
];

export function LandingMenu() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

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
      {open && (
        <nav className={styles.panel} aria-label="Menú de la página">
          {MENU_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.link}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
      <button
        type="button"
        className={styles.button}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
        Menú
      </button>
    </div>
  );
}
