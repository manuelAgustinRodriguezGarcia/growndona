"use client";

import { useId, useState } from "react";
import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { Eye, EyeOff } from "lucide-react";
import { FieldWrapper } from "./FieldWrapper";
import styles from "./Field.module.scss";

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

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  error?: string;
  hint?: string;
};

export function PasswordInput({
  label,
  error,
  hint,
  required,
  id,
  ...rest
}: PasswordInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [visible, setVisible] = useState(false);

  return (
    <FieldWrapper
      label={label}
      required={required}
      error={error}
      hint={hint}
      htmlFor={inputId}
    >
      <div className={styles.passwordWrapper}>
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          required={required}
          className={`${styles.control} ${styles.passwordControl} ${error ? styles.error : ""}`}
          {...rest}
        />
        <button
          type="button"
          className={styles.passwordToggle}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={visible}
          tabIndex={-1}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </FieldWrapper>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
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
