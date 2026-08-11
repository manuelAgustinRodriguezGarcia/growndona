import { useId } from "react";
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";
import styles from "./Field.module.scss";

type FieldWrapperProps = {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  htmlFor: string;
  children: ReactNode;
};

function FieldWrapper({
  label,
  required,
  error,
  hint,
  htmlFor,
  children,
}: FieldWrapperProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error && <span className={styles.errorText}>{error}</span>}
      {!error && hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, required, id, ...rest }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <FieldWrapper
      label={label}
      required={required}
      error={error}
      hint={hint}
      htmlFor={inputId}
    >
      <input
        id={inputId}
        required={required}
        className={`${styles.control} ${error ? styles.error : ""}`}
        {...rest}
      />
    </FieldWrapper>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function Select({
  label,
  error,
  hint,
  required,
  id,
  children,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <FieldWrapper
      label={label}
      required={required}
      error={error}
      hint={hint}
      htmlFor={selectId}
    >
      <select
        id={selectId}
        required={required}
        className={`${styles.control} ${error ? styles.error : ""}`}
        {...rest}
      >
        {children}
      </select>
    </FieldWrapper>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function Textarea({
  label,
  error,
  hint,
  required,
  id,
  ...rest
}: TextareaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;
  return (
    <FieldWrapper
      label={label}
      required={required}
      error={error}
      hint={hint}
      htmlFor={textareaId}
    >
      <textarea
        id={textareaId}
        required={required}
        className={`${styles.control} ${error ? styles.error : ""}`}
        {...rest}
      />
    </FieldWrapper>
  );
}
