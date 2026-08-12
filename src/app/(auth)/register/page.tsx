"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, PasswordInput } from "@/components/ui/Field";
import styles from "../form.module.scss";

function translateError(message: string): string {
  if (message.includes("already registered")) {
    return "Ya existe una cuenta con ese email.";
  }
  if (message.includes("Password should be")) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  return "No se pudo crear la cuenta. Intentá de nuevo.";
}

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setError(null);

    const cleanUsername = username.trim().toLowerCase();

    if (!USERNAME_REGEX.test(cleanUsername)) {
      setError(
        "El nombre de usuario debe tener entre 3 y 20 caracteres, solo letras minúsculas, números y guión bajo."
      );
      return;
    }
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

    const { data: existingEmail } = await supabase.rpc(
      "get_email_for_username",
      { p_username: cleanUsername }
    );
    if (existingEmail) {
      setError("Ese nombre de usuario ya está en uso.");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: name.trim(), username: cleanUsername },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (signUpError) {
      setError(translateError(signUpError.message));
      setLoading(false);
      return;
    }

    if (!data.session) {
      setNeedsConfirmation(true);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (needsConfirmation) {
    return (
      <div className={styles.form}>
        <h1 className={styles.title}>Revisá tu email</h1>
        <p className={styles.info}>
          Te enviamos un link de confirmación a {email}. Después de confirmar
          vas a poder iniciar sesión.
        </p>
        <p className={styles.switch}>
          <Link href="/login">Ir a iniciar sesión</Link>
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Crear cuenta</h1>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <Input
        label="Nombre"
        type="text"
        autoComplete="name"
        placeholder="Tu nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Nombre de usuario"
        type="text"
        autoComplete="username"
        placeholder="tu_usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value.toLowerCase())}
        required
      />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
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
        Crear cuenta
      </Button>
      <p className={styles.switch}>
        ¿Ya tenés cuenta? <Link href="/login">Iniciá sesión</Link>
      </p>
    </form>
  );
}
