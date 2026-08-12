"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { FieldWrapper } from "./FieldWrapper";
import styles from "./Select.module.scss";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  id?: string;
};

export function Select({
  label,
  value,
  options,
  onChange,
  placeholder = "Seleccionar",
  required,
  disabled,
  error,
  hint,
  id,
}: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const listId = `${selectId}-list`;
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  function commit(index: number) {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        break;
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(activeIndex);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <FieldWrapper
      label={label}
      required={required}
      error={error}
      hint={hint}
      htmlFor={selectId}
    >
      <div className={styles.wrapper} ref={containerRef}>
        <button
          type="button"
          id={selectId}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
          aria-required={required}
          className={`${styles.trigger} ${error ? styles.triggerError : ""} ${
            selected ? "" : styles.empty
          }`}
          onClick={() => setOpen((isOpen) => !isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        >
          <span className={styles.triggerText}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown size={17} aria-hidden="true" className={styles.chevron} />
        </button>

        {open && (
          <>
            <div
              className={styles.scrim}
              onClick={() => setOpen(false)}
              role="presentation"
            />
            <div
              ref={listRef}
              id={listId}
              role="listbox"
              aria-label={label}
              className={styles.list}
            >
              <span className={styles.grab} aria-hidden="true" />
              <span className={styles.sheetTitle}>{label}</span>
              <div className={styles.options}>
                {options.map((option, index) => {
                  const isSelected = option.value === value;
                  return (
                    <div
                      key={option.value}
                      id={`${listId}-${index}`}
                      data-index={index}
                      role="option"
                      aria-selected={isSelected}
                      className={`${styles.option} ${
                        index === activeIndex ? styles.active : ""
                      } ${isSelected ? styles.selected : ""}`}
                      onPointerEnter={() => setActiveIndex(index)}
                      onClick={() => commit(index)}
                    >
                      <span>{option.label}</span>
                      {isSelected && <Check size={16} aria-hidden="true" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </FieldWrapper>
  );
}
