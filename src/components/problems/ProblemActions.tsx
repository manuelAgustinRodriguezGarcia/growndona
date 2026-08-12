"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  deleteProblem,
  reopenProblem,
  resolveProblem,
} from "@/lib/queries/problems";
import { removeStorageFiles } from "@/lib/queries/photos";
import { todayISO } from "@/lib/utils/dates";
import type { ProblemWithPhotos } from "@/lib/queries/problems";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { DatePicker } from "@/components/ui/DatePicker";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import styles from "@/styles/form.module.scss";

type ProblemActionsProps = {
  problem: ProblemWithPhotos;
};

export function ProblemActions({ problem }: ProblemActionsProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [resolveOpen, setResolveOpen] = useState(false);
  const [reopenConfirm, setReopenConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [solution, setSolution] = useState("");
  const [resolvedAt, setResolvedAt] = useState(todayISO());
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleResolve(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError(null);
    if (!solution.trim()) {
      setError("Contanos qué solución aplicaste.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      await resolveProblem(supabase, problem.id, solution.trim(), resolvedAt);
      toast("Problema resuelto");
      setResolveOpen(false);
      router.refresh();
    } catch {
      setError("No se pudo resolver el problema.");
    } finally {
      setBusy(false);
    }
  }

  async function handleReopen() {
    if (busy) return;
    setBusy(true);
    try {
      const supabase = createClient();
      await reopenProblem(supabase, problem.id);
      toast("Problema reabierto");
      setReopenConfirm(false);
      router.refresh();
    } catch {
      toast("No se pudo reabrir el problema", "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (busy) return;
    setBusy(true);
    try {
      const supabase = createClient();
      const paths = problem.problem_photos.map((p) => p.storage_path);
      await deleteProblem(supabase, problem.id);
      await removeStorageFiles(supabase, paths);
      toast("Problema eliminado");
      router.push(`/cultivos/${problem.cultivation_id}?tab=problemas`);
      router.refresh();
    } catch {
      toast("No se pudo eliminar el problema", "error");
      setBusy(false);
    }
  }

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {problem.status === "active" ? (
          <Button onClick={() => setResolveOpen(true)}>Resolver problema</Button>
        ) : (
          <Button variant="secondary" onClick={() => setReopenConfirm(true)}>
            <RotateCcw size={16} aria-hidden="true" />
            Reabrir problema
          </Button>
        )}
        <Button variant="danger" onClick={() => setDeleteConfirm(true)}>
          <Trash2 size={16} aria-hidden="true" />
          Eliminar
        </Button>
      </div>

      <Modal
        open={resolveOpen}
        title="Resolver problema"
        onClose={() => setResolveOpen(false)}
      >
        <form className={styles.form} onSubmit={handleResolve}>
          {error && (
            <p role="alert" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}
          <Textarea
            label="Solución aplicada"
            placeholder="¿Qué hiciste para solucionarlo?"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            required
          />
          <DatePicker
            label="Fecha de resolución"
            value={resolvedAt}
            onChange={setResolvedAt}
            required
          />
          <div className={styles.actions}>
            <Button type="submit" loading={busy}>
              Marcar como resuelto
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={reopenConfirm}
        title="Reabrir problema"
        message="El problema volverá a figurar como activo y se borrará la solución registrada."
        confirmLabel="Reabrir"
        loading={busy}
        onConfirm={handleReopen}
        onCancel={() => setReopenConfirm(false)}
      />

      <ConfirmDialog
        open={deleteConfirm}
        title="Eliminar problema"
        message="Se eliminará el problema y sus fotos. Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        danger
        loading={busy}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
      />
    </>
  );
}
