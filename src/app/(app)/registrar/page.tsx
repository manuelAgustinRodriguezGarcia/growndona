import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Sprout } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCultivations } from "@/lib/queries/cultivations";
import { getSignedUrlMap } from "@/lib/queries/photos";
import { PageHeader } from "@/components/layout/PageHeader";
import { CultivationCard } from "@/components/cultivation/CultivationCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Registrar" };

export default async function RegisterPickerPage() {
  const supabase = await createClient();
  const cultivations = await getCultivations(supabase);
  const active = cultivations.filter((c) => c.status === "active");

  if (active.length === 1) {
    redirect(`/cultivos/${active[0].id}/registrar`);
  }

  if (active.length === 0) {
    return (
      <>
        <PageHeader title="Registrar" />
        <EmptyState
          icon={<Sprout size={24} />}
          title="No tenés ningún cultivo activo"
          description="Para registrar un día primero necesitás un cultivo activo."
          action={
            <Link href="/cultivos/nuevo">
              <Button>Crear cultivo</Button>
            </Link>
          }
        />
      </>
    );
  }

  const coverPaths = active
    .map((c) => c.cover_image_url)
    .filter((p): p is string => Boolean(p));
  const urlMap = await getSignedUrlMap(supabase, coverPaths);

  return (
    <>
      <PageHeader
        title="Registrar"
        subtitle="Elegí el cultivo en el que querés registrar el día."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {active.map((cultivation) => (
          <CultivationCard
            key={cultivation.id}
            cultivation={cultivation}
            href={`/cultivos/${cultivation.id}/registrar`}
            coverUrl={
              cultivation.cover_image_url
                ? (urlMap.get(cultivation.cover_image_url) ?? null)
                : null
            }
          />
        ))}
      </div>
    </>
  );
}
