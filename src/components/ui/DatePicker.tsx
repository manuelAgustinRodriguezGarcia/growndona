"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import fieldStyles from "./Field.module.scss";
import styles from "./DatePicker.module.scss";

type DatePickerProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  max?: string;
  min?: string;
  required?: boolean;
  "aria-label"?: string;
};

const WEEKDAYS = ["lu", "ma", "mi", "ju", "vi", "sá", "do"];

function parseLocalDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function DatePicker({
  label,
  value,
  onChange,
  max,
  min,
  required,
  "aria-label": ariaLabel,
}: DatePickerProps) {
  const autoId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected = parseLocalDate(value);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(selected));

  useEffect(() => {
    setViewMonth(startOfMonth(parseLocalDate(value)));
  }, [value]);

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

  const maxDate = max ? startOfDay(parseLocalDate(max)) : null;
  const minDate = min ? startOfDay(parseLocalDate(min)) : null;

  const monthStart = startOfMonth(viewMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  function isDisabled(day: Date) {
    if (maxDate && isAfter(day, maxDate)) return true;
    if (minDate && isBefore(day, minDate)) return true;
    return false;
  }

  function selectDay(day: Date) {
    if (isDisabled(day)) return;
    onChange(format(day, "yyyy-MM-dd"));
    setOpen(false);
  }

  const accessibleName = ariaLabel ?? label ?? "Fecha";

  return (
    <div className={`${fieldStyles.field} ${styles.root}`} ref={rootRef}>
      {label && (
        <label className={fieldStyles.label} htmlFor={autoId}>
          {label}
          {required && (
            <span className={fieldStyles.required} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <button
        id={autoId}
        type="button"
        className={`${fieldStyles.control} ${styles.trigger}`}
        aria-label={label ? undefined : accessibleName}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{format(selected, "d 'de' MMMM yyyy", { locale: es })}</span>
        <Calendar size={18} aria-hidden="true" />
      </button>
      {open && (
        <div className={styles.popover} role="dialog" aria-label={accessibleName}>
          <div className={styles.monthBar}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => setViewMonth((m) => subMonths(m, 1))}
              aria-label="Mes anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <span className={styles.monthLabel}>
              {format(viewMonth, "MMMM yyyy", { locale: es })}
            </span>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              aria-label="Mes siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className={styles.weekdays}>
            {WEEKDAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className={styles.days}>
            {days.map((day) => {
              const outside = !isSameMonth(day, viewMonth);
              const selectedDay = isSameDay(day, selected);
              const disabled = isDisabled(day);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={disabled}
                  className={[
                    styles.day,
                    outside ? styles.outside : "",
                    selectedDay ? styles.selected : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => selectDay(day)}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
