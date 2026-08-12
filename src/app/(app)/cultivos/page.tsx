import Link from "next/link";
import { Plus, Sprout } from "lucide-react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getCultivations } from "@/lib/queries/cultivations";
import { getSignedUrlMap } from "@/lib/queries/photos";
import { PageHeader } from "@/components/layout/PageHeader";
import { CultivationCard } from "@/components/cultivation/CultivationCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import styles from "./cultivos.module.scss";

export const metadata: Metadata = { title: "Mis cultivos" };

export default async function CultivationsPage() {
  const supabase = await createClient();
  const cultivations = await getCultivations(supabase);

  const coverPaths = cultivations
    .map((c) => c.cover_image_url)
    .filter((p): p is string => Boolean(p));
  const urlMap = await getSignedUrlMap(supabase, coverPaths);

  const active = cultivations.filter((c) => c.status === "active");
  const finished = cultivations.filter((c) => c.status === "finished");

  return (
    <>
      <PageHeader
        title="Mis cultivos"
        subtitle="Todos tus cultivos, activos y finalizados."
        action={
          <Link href="/cultivos/nuevo" className={styles.headerAction}>
            <Button size="small">
              <Plus size={16} aria-hidden="true" />
              Nuevo cultivo
            </Button>
          </Link>
        }
      />

      {cultivations.length > 0 && (
        <Link
          href="/cultivos/nuevo"
          className={styles.fab}
          aria-label="Nuevo cultivo"
        >
          <Plus size={24} aria-hidden="true" />
        </Link>
      )}

      {cultivations.length === 0 ? (
        <EmptyState
          icon={<Sprout size={24} />}
          title="Todavía no creaste ningún cultivo"
          description="Creá tu primer cultivo para empezar a registrar su seguimiento día a día."
          action={
            <Link href="/cultivos/nuevo">
              <Button>
                <Plus size={16} aria-hidden="true" />
                Crear primer cultivo
              </Button>
            </Link>
          }
        />
      ) : (
        <div className={styles.sections}>
          {active.length > 0 && (
            <section>
              <h2 className="section-title">Activos</h2>
              <div className={styles.list}>
                {active.map((cultivation) => (
                  <CultivationCard
                    key={cultivation.id}
                    cultivation={cultivation}
                    coverUrl={
                      cultivation.cover_image_url
                        ? (urlMap.get(cultivation.cover_image_url) ?? null)
                        : null
                    }
                  />
                ))}
              </div>
            </section>
          )}
          {finished.length > 0 && (
            <section>
              <h2 className="section-title">Finalizados</h2>
              <div className={styles.list}>
                {finished.map((cultivation) => (
                  <CultivationCard
                    key={cultivation.id}
                    cultivation={cultivation}
                    coverUrl={
                      cultivation.cover_image_url
                        ? (urlMap.get(cultivation.cover_image_url) ?? null)
                        : null
                    }
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
}
