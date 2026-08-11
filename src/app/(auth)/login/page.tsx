"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import styles from "../form.module.scss";

function translateError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Email o contraseña incorrectos.";
  }
  if (message.includes("Email not confirmed")) {
    return "Tenés que confirmar tu email antes de iniciar sesión.";
  }
  return "No se pudo iniciar sesión. Intentá de nuevo.";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    const supabase = createClient();
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
      <h1 className={styles.title}>Iniciar sesión</h1>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Contraseña"
        type="password"
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
        ¿No tenés cuenta? <Link href="/register">Registrate</Link>
      </p>
    </form>
  );
}
