"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createRecoveryClient } from "@/lib/supabase/recovery";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import styles from "../form.module.scss";

const LINK_ERROR_MESSAGE =
  "El link no era válido o ya se había usado. Pedí uno nuevo y abrilo apenas te llegue.";

export function RecoverForm({ linkError }: { linkError: boolean }) {
  const [identifier, setIdentifier] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(
    linkError ? LINK_ERROR_MESSAGE : null
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    const supabase = createRecoveryClient();
    let email = identifier.trim();

    if (!email.includes("@")) {
      const { data: resolvedEmail } = await supabase.rpc(
        "get_email_for_username",
        { p_username: email }
      );
      if (!resolvedEmail) {
        setSent(true);
        setLoading(false);
        return;
      }
      email = resolvedEmail;
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/nueva-contrasena`,
      }
    );

    if (resetError) {
      setError("No se pudo enviar el email. Intentá de nuevo en un momento.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className={styles.form}>
        <h1 className={styles.title}>Revisá tu email</h1>
        <p className={styles.info}>
          Si esa cuenta existe, te enviamos un link para crear una contraseña
          nueva. El link vence en una hora.
        </p>
        <p className={styles.switch}>
          <Link href="/login">Volver a iniciar sesión</Link>
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Recuperar contraseña</h1>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <Input
        label="Email o nombre de usuario"
        type="text"
        autoComplete="username"
        placeholder="tu@email.com o tu_usuario"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
      />
      <Button type="submit" loading={loading} full>
        Enviar link
      </Button>
      <p className={styles.switch}>
        <Link href="/login">Volver a iniciar sesión</Link>
      </p>
    </form>
  );
}
