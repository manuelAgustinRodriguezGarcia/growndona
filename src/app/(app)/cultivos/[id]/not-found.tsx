import Link from "next/link";
import { Sprout } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function CultivationNotFound() {
  return (
    <EmptyState
      icon={<Sprout size={24} />}
      title="Cultivo no encontrado"
      description="El cultivo que buscás no existe o no tenés acceso."
      action={
        <Link href="/cultivos">
          <Button variant="secondary">Ir a mis cultivos</Button>
        </Link>
      }
    />
  );
}
