import type { ReactNode } from "react";
import styles from "./Field.module.scss";

type FieldWrapperProps = {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  htmlFor: string;
  children: ReactNode;
};

export function FieldWrapper({
  label,
  required,
  error,
  hint,
  htmlFor,
  children,
}: FieldWrapperProps) {
  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label} htmlFor={htmlFor}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error && <span className={styles.errorText}>{error}</span>}
      {!error && hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
