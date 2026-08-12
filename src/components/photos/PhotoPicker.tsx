"use client";

import { useEffect, useMemo, useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { validatePhotoFile } from "@/lib/queries/photos";
import { useToast } from "@/components/ui/Toast";
import styles from "./PhotoPicker.module.scss";

type PhotoPickerProps = {
  files: File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
};

export function PhotoPicker({
  files,
  onChange,
  multiple = true,
  disabled = false,
  label = "Agregar foto",
}: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  function handleSelect(selected: FileList | null) {
    if (!selected) return;
    const valid: File[] = [];
    for (const file of Array.from(selected)) {
      const error = validatePhotoFile(file);
      if (error) {
        toast(error, "error");
        continue;
      }
      valid.push(file);
    }
    if (valid.length === 0) return;
    onChange(multiple ? [...files, ...valid] : [valid[0]]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className={styles.picker}>
      <div className={styles.grid}>
        {previews.map((url, index) => (
          <div key={url} className={styles.preview}>
            <img src={url} alt={`Foto seleccionada ${index + 1}`} />
            <button
              type="button"
              className={styles.remove}
              onClick={() => removeAt(index)}
              disabled={disabled}
              aria-label={`Quitar foto ${index + 1}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      {(multiple || files.length === 0) && (
        <button
          type="button"
          className={styles.add}
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          <ImagePlus size={20} aria-hidden="true" />
          {label}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        className={styles.input}
        onChange={(e) => handleSelect(e.target.files)}
        aria-label={label}
        tabIndex={-1}
      />
    </div>
  );
}
