import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Droplets, NotebookPen, Scissors, Sprout } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCultivations } from "@/lib/queries/cultivations";
import { getEntries } from "@/lib/queries/entries";
import { getCultivationGenetics } from "@/lib/queries/genetics";
import { getProblems } from "@/lib/queries/problems";
import { getSignedUrlMap } from "@/lib/queries/photos";
import { relativeDate } from "@/lib/utils/dates";
import { buildGeneticSeries, latestPerField } from "@/lib/utils/measurements";
import { CultivationHeader } from "@/components/cultivation/CultivationHeader";
import { MeasurementGrid } from "@/components/cultivation/MeasurementGrid";
import { QuickActions } from "@/components/entries/QuickActions";
import { MeasurementChart } from "@/components/charts/MeasurementChart";
import { ProblemCard } from "@/components/problems/ProblemCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import styles from "./dashboard.module.scss";

export const metadata: Metadata = { title: "Inicio" };

type PageProps = {
  searchParams: Promise<{ c?: string }>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const { c } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const cultivations = await getCultivations(supabase);
  const active = cultivations.filter((cult) => cult.status === "active");

  if (active.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.greeting}>Inicio</h1>
        <EmptyState
          icon={<Sprout size={24} />}
          title="No tenés ningún cultivo activo"
          description="Creá un cultivo para empezar a registrar parámetros, riegos y fotos día a día."
          action={
            <Link href="/cultivos/nuevo">
              <Button>Crear cultivo</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const selected = active.find((cult) => cult.id === c) ?? active[0];

  const [entries, problems, genetics] = await Promise.all([
    getEntries(supabase, selected.id),
    getProblems(supabase, selected.id),
    getCultivationGenetics(supabase, selected.id),
  ]);

  const coverUrl = selected.cover_image_url
    ? ((await getSignedUrlMap(supabase, [selected.cover_image_url])).get(
        selected.cover_image_url
      ) ?? null)
    : null;

  const geneticSeries = buildGeneticSeries(entries, genetics);
  const hasSeries = geneticSeries.length > 0;

  const lastEntry = entries[0] ?? null;
  const lastIrrigationEntry = entries.find((e) => e.irrigations.length > 0) ?? null;
  const lastPruningEntry =
    entries.find((e) => e.actions.some((a) => a.type === "pruning")) ?? null;
  const activeProblems = problems.filter((p) => p.status === "active");

  return (
    <div className={styles.page}>
      <h1 className={styles.greeting}>Inicio</h1>

      {active.length > 1 && (
        <div className={styles.switcher}>
          {active.map((cult) => (
            <Link
              key={cult.id}
              href={`/dashboard?c=${cult.id}`}
              className={`${styles.switchChip} ${cult.id === selected.id ? styles.switchActive : ""}`}
            >
              {cult.name}
            </Link>
          ))}
        </div>
      )}

      <Link href={`/cultivos/${selected.id}`} className={styles.headerLink}>
        <CultivationHeader cultivation={selected} coverUrl={coverUrl} />
      </Link>

      <section>
        <h2 className="section-title">Acciones rápidas</h2>
        <QuickActions cultivationId={selected.id} userId={user.id} />
      </section>

      <section>
        <h2 className="section-title">Actividad</h2>
        <div className={styles.activity}>
          <div className={styles.activityRow}>
            <NotebookPen size={16} aria-hidden="true" />
            <span className={styles.activityLabel}>Último registro</span>
            <span className={styles.activityValue}>
              {lastEntry ? relativeDate(lastEntry.entry_date) : "Sin registros"}
            </span>
          </div>
          <div className={styles.activityRow}>
            <Droplets size={16} aria-hidden="true" />
            <span className={styles.activityLabel}>Último riego</span>
            <span className={styles.activityValue}>
              {lastIrrigationEntry
                ? relativeDate(lastIrrigationEntry.entry_date)
                : "Sin riegos"}
            </span>
          </div>
          <div className={styles.activityRow}>
            <Scissors size={16} aria-hidden="true" />
            <span className={styles.activityLabel}>Última poda</span>
            <span className={styles.activityValue}>
              {lastPruningEntry
                ? relativeDate(lastPruningEntry.entry_date)
                : "Sin podas"}
            </span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title">Últimos parámetros</h2>
        {geneticSeries.length <= 1 ? (
          <MeasurementGrid latest={latestPerField(geneticSeries[0]?.series ?? [])} />
        ) : (
          <div className={styles.geneticStack}>
            {geneticSeries.map((group) => (
              <div key={group.geneticId ?? "general"}>
                <p className={styles.geneticLabel}>{group.label}</p>
                <MeasurementGrid latest={latestPerField(group.series)} />
              </div>
            ))}
          </div>
        )}
      </section>

      {activeProblems.length > 0 && (
        <section>
          <div className={styles.problemsHeader}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Problemas activos
            </h2>
            <span className={styles.problemCount}>{activeProblems.length}</span>
          </div>
          <div className={styles.list}>
            {activeProblems.slice(0, 3).map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                cultivationStartDate={selected.start_date}
              />
            ))}
          </div>
        </section>
      )}

      {hasSeries && (
        <section>
          <h2 className="section-title">Evolución reciente</h2>
          <div className={styles.geneticStack}>
            {geneticSeries.map((group) => (
              <div key={group.geneticId ?? "general"}>
                {geneticSeries.length > 1 && (
                  <p className={styles.geneticLabel}>{group.label}</p>
                )}
                <MeasurementChart series={group.series.slice(-14)} height={180} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
