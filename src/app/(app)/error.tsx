"use client";

import { AlertTriangle } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function AppError({ reset }: { error: Error; reset: () => void }) {
  return (
    <EmptyState
      icon={<AlertTriangle size={24} />}
      title="Algo salió mal"
      description="Ocurrió un error inesperado. Podés intentar de nuevo."
      action={<Button onClick={reset}>Reintentar</Button>}
    />
  );
}
