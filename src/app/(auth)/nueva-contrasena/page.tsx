"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/Field";
import styles from "../form.module.scss";

export default function NewPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expired, setExpired] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");
    const linkError = hash.get("error_description");

    async function restoreSession() {
      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        window.history.replaceState(null, "", window.location.pathname);
        setExpired(Boolean(sessionError));
        setReady(true);
        return;
      }

      if (linkError) {
        window.history.replaceState(null, "", window.location.pathname);
        setExpired(true);
        setReady(true);
        return;
      }

      const { data } = await supabase.auth.getUser();
      setExpired(!data.user);
      setReady(true);
    }

    restoreSession();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setError(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      console.error(
        "[nueva-contrasena] updateUser failed:",
        updateError.status,
        updateError.code,
        updateError.message
      );

      if (updateError.code === "same_password") {
        setError("La contraseña nueva tiene que ser distinta a la actual.");
      } else if (updateError.code === "weak_password") {
        setError("Esa contraseña es muy débil. Probá con una más larga.");
      } else if (updateError.code === "reauthentication_needed") {
        setError(
          "Supabase pide reautenticación para cambiar la contraseña. Desactivá 'Secure password change' en Authentication → Providers → Email."
        );
      } else if (
        updateError.status === 401 ||
        updateError.code === "session_not_found"
      ) {
        setExpired(true);
      } else {
        setError(`No se pudo cambiar la contraseña: ${updateError.message}`);
      }

      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (!ready) {
    return (
      <div className={styles.form}>
        <h1 className={styles.title}>Nueva contraseña</h1>
        <p className={styles.info}>Verificando el link...</p>
      </div>
    );
  }

  if (expired) {
    return (
      <div className={styles.form}>
        <h1 className={styles.title}>Link vencido</h1>
        <p className={styles.error}>
          El link para cambiar la contraseña ya no es válido. Pedí uno nuevo.
        </p>
        <p className={styles.switch}>
          <Link href="/recuperar">Pedir otro link</Link>
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Nueva contraseña</h1>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <PasswordInput
        label="Contraseña"
        autoComplete="new-password"
        placeholder="Mínimo 6 caracteres"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <PasswordInput
        label="Repetir contraseña"
        autoComplete="new-password"
        placeholder="Repetí la contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <Button type="submit" loading={loading} full>
        Guardar contraseña
      </Button>
    </form>
  );
}
