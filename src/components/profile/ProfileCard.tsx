"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Camera, LogOut, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/queries/profile";
import {
  buildAvatarPath,
  removeStorageFiles,
  uploadPhoto,
  validatePhotoFile,
} from "@/lib/queries/photos";
import { formatDate } from "@/lib/utils/dates";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import formStyles from "@/styles/form.module.scss";
import styles from "./ProfileCard.module.scss";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Button variant="danger" full loading={loading} onClick={handleLogout}>
      <LogOut size={18} aria-hidden="true" />
      Cerrar sesión
    </Button>
  );
}

type ProfileCardProps = {
  userId: string;
  name: string;
  username: string | null;
  email: string;
  createdAt: string;
  avatarUrl: string | null;
  avatarPath: string | null;
};

export function ProfileCard({
  userId,
  name,
  username,
  email,
  createdAt,
  avatarUrl,
  avatarPath,
}: ProfileCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [newName, setNewName] = useState(name);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleNameSave(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError(null);
    if (!newName.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      await updateProfile(supabase, userId, { name: newName.trim() });
      toast("Nombre actualizado");
      setEditOpen(false);
      router.refresh();
    } catch {
      setError("No se pudo actualizar el nombre.");
    } finally {
      setBusy(false);
    }
  }

  async function handleAvatar(files: FileList | null) {
    if (!files || files.length === 0 || busy) return;
    const file = files[0];
    const validationError = validatePhotoFile(file);
    if (validationError) {
      toast(validationError, "error");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      const path = buildAvatarPath(userId, file.name);
      await uploadPhoto(supabase, path, file);
      if (avatarPath) {
        await removeStorageFiles(supabase, [avatarPath]).catch(() => {});
      }
      await updateProfile(supabase, userId, { avatar_url: path });
      toast("Avatar actualizado");
      router.refresh();
    } catch {
      toast("No se pudo actualizar el avatar", "error");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <>
      <div className={styles.card}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            {avatarUrl ? (
              <Image src={avatarUrl} alt={`Avatar de ${name}`} fill sizes="72px" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
          <button
            type="button"
            className={styles.avatarButton}
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            aria-label="Cambiar avatar"
          >
            <Camera size={14} />
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{name}</span>
            <button
              type="button"
              className={styles.editButton}
              onClick={() => {
                setNewName(name);
                setEditOpen(true);
              }}
              aria-label="Editar nombre"
            >
              <Pencil size={14} />
            </button>
          </div>
          {username && <span className={styles.detail}>@{username}</span>}
          <span className={styles.detail}>{email}</span>
          <span className={styles.detail}>
            Miembro desde {formatDate(createdAt.slice(0, 10))}
          </span>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className={styles.hiddenInput}
        onChange={(e) => handleAvatar(e.target.files)}
        aria-label="Subir avatar"
        tabIndex={-1}
      />

      <Modal open={editOpen} title="Editar nombre" onClose={() => setEditOpen(false)}>
        <form className={formStyles.form} onSubmit={handleNameSave}>
          {error && (
            <p role="alert" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}
          <Input
            label="Nombre"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <div className={formStyles.actions}>
            <Button type="submit" loading={busy}>
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
