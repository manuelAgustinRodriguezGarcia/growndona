"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import styles from "./PhotoGrid.module.scss";

export type GalleryPhoto = {
  id: string;
  url: string;
  caption: string | null;
  day: number;
  date: string;
};

export function PhotoGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);
  const next = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (openIndex === null) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, prev, next]);

  const current = openIndex !== null ? photos[openIndex] : null;

  return (
    <>
      <div className={styles.grid}>
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            className={styles.item}
            onClick={() => setOpenIndex(index)}
            aria-label={`Ver foto del día ${photo.day}`}
          >
            <Image
              src={photo.url}
              alt={photo.caption ?? `Foto del día ${photo.day}`}
              fill
              sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 190px"
            />
            <span className={styles.caption}>
              Día {photo.day} · {photo.date}
            </span>
          </button>
        ))}
      </div>

      {current && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label="Foto ampliada">
          <div className={styles.lightboxHeader}>
            <span>
              Día {current.day} · {current.date}
            </span>
            <button
              type="button"
              className={styles.lightboxClose}
              onClick={close}
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>
          <div className={styles.lightboxBody}>
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  className={`${styles.navButton} ${styles.prev}`}
                  onClick={prev}
                  aria-label="Foto anterior"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  className={`${styles.navButton} ${styles.next}`}
                  onClick={next}
                  aria-label="Foto siguiente"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
            <Image
              src={current.url}
              alt={current.caption ?? `Foto del día ${current.day}`}
              fill
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
