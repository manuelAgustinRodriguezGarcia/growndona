"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, PasswordInput } from "@/components/ui/Field";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import styles from "../form.module.scss";

function translateError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Usuario o contraseña incorrectos.";
  }
  if (message.includes("Email not confirmed")) {
    return "Tenés que confirmar tu email antes de iniciar sesión.";
  }
  return "No se pudo iniciar sesión. Intentá de nuevo.";
}

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    const supabase = createClient();
    let email = identifier.trim();

    if (!email.includes("@")) {
      const { data: resolvedEmail, error: rpcError } = await supabase.rpc(
        "get_email_for_username",
        { p_username: email }
      );
      if (rpcError || !resolvedEmail) {
        setError("Usuario o contraseña incorrectos.");
        setLoading(false);
        return;
      }
      email = resolvedEmail;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(translateError(signInError.message));
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <Input
        label="Email o nombre de usuario"
        type="text"
        autoComplete="username"
        placeholder="Ingresá tu email o usuario"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
      />
      <PasswordInput
        label="Contraseña"
        autoComplete="current-password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" loading={loading} full>
        Entrar
      </Button>
      <p className={styles.switch}>
        <Link href="/recuperar">¿Olvidaste tu contraseña?</Link>
      </p>
      <p className={styles.switch}>
        ¿No tenés cuenta? <Link href="/register">Registrate</Link>
      </p>
      <InstallAppButton />
    </form>
  );
}
