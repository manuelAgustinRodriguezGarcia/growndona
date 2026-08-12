import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  Camera,
  ChevronLeft,
  Droplets,
  NotebookPen,
  Pencil,
  Plus,
  Scissors,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCultivation } from "@/lib/queries/cultivations";
import { getCultivationGenetics } from "@/lib/queries/genetics";
import { getPlants } from "@/lib/queries/plants";
import { getEntries } from "@/lib/queries/entries";
import { getProblems } from "@/lib/queries/problems";
import { getSignedUrlMap } from "@/lib/queries/photos";
import { dayNumber, formatDate, formatShortDate, relativeDate } from "@/lib/utils/dates";
import { currentPeriod, sortedPeriods } from "@/lib/utils/labels";
import { buildGeneticSeries, latestPerField } from "@/lib/utils/measurements";
import { CultivationHeader } from "@/components/cultivation/CultivationHeader";
import { MeasurementGrid } from "@/components/cultivation/MeasurementGrid";
import { PeriodManager } from "@/components/cultivation/PeriodManager";
import { PeriodList } from "@/components/cultivation/PeriodList";
import { CultivationDangerZone } from "@/components/cultivation/CultivationDangerZone";
import { TimelineEntry } from "@/components/entries/TimelineEntry";
import { QuickActions } from "@/components/entries/QuickActions";
import { MeasurementChart } from "@/components/charts/MeasurementChart";
import { GeneticParametersPanel } from "@/components/charts/GeneticParametersPanel";
import { PhotoGrid, type GalleryPhoto } from "@/components/photos/PhotoGrid";
import { ProblemCard } from "@/components/problems/ProblemCard";
import { CultivationSectionNav } from "@/components/cultivation/CultivationSectionNav";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import styles from "./cultivo.module.scss";

const TABS = [
  { key: "resumen", label: "Resumen" },
  { key: "timeline", label: "Timeline" },
  { key: "parametros", label: "Parámetros" },
  { key: "galeria", label: "Galería" },
  { key: "problemas", label: "Problemas" },
  { key: "info", label: "Información" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function CultivationPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { tab: rawTab } = await searchParams;
  const tab: TabKey = TABS.some((t) => t.key === rawTab)
    ? (rawTab as TabKey)
    : "resumen";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const cultivation = await getCultivation(supabase, id);
  if (!cultivation) notFound();

  const [entries, problems, genetics] = await Promise.all([
    getEntries(supabase, id),
    getProblems(supabase, id),
    getCultivationGenetics(supabase, id),
  ]);

  const coverUrl = cultivation.cover_image_url
    ? ((await getSignedUrlMap(supabase, [cultivation.cover_image_url])).get(
        cultivation.cover_image_url
      ) ?? null)
    : null;

  const periods = sortedPeriods(cultivation.cultivation_periods);
  const activePeriod = currentPeriod(cultivation.cultivation_periods);
  const isActive = cultivation.status === "active";

  const geneticSeries = buildGeneticSeries(entries, genetics);
  const hasSeries = geneticSeries.length > 0;
  const geneticNames = Object.fromEntries(genetics.map((g) => [g.id, g.name]));

  const activeProblems = problems.filter((p) => p.status === "active");
  const resolvedProblems = problems.filter((p) => p.status === "resolved");

  const lastEntry = entries[0] ?? null;
  const lastIrrigationEntry = entries.find((e) => e.irrigations.length > 0) ?? null;
  const lastPruningEntry =
    entries.find((e) => e.actions.some((a) => a.type === "pruning")) ?? null;

  const plants = tab === "info" ? await getPlants(supabase, id) : [];

  let photoUrlMap = new Map<string, string>();
  if (tab === "timeline" || tab === "galeria") {
    const paths = entries.flatMap((e) => e.photos.map((p) => p.storage_path));
    photoUrlMap = await getSignedUrlMap(supabase, paths);
  }

  const galleryPhotos: GalleryPhoto[] =
    tab === "galeria"
      ? entries.flatMap((entry) =>
          entry.photos
            .map((photo) => {
              const url = photoUrlMap.get(photo.storage_path);
              if (!url) return null;
              return {
                id: photo.id,
                url,
                caption: photo.caption,
                day: dayNumber(cultivation.start_date, entry.entry_date),
                date: formatShortDate(entry.entry_date),
              };
            })
            .filter((p): p is GalleryPhoto => p !== null)
        )
      : [];

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/cultivos" className={styles.back}>
          <ChevronLeft size={16} aria-hidden="true" />
          Mis cultivos
        </Link>
      </div>

      <CultivationHeader cultivation={cultivation} coverUrl={coverUrl} />

      <CultivationSectionNav cultivationId={id} active={tab} />

      <div className={styles.content}>
        {tab === "resumen" && (
          <>
            <section className="card">
              <div className={styles.topBar} style={{ marginBottom: 8 }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>
                  Períodos
                </h2>
                {isActive && (
                  <PeriodManager cultivationId={id} currentPeriod={activePeriod} />
                )}
              </div>
              <PeriodList
                cultivationId={id}
                periods={periods}
                isActive={isActive}
                cultivationEndDate={cultivation.end_date}
                harvestGrams={cultivation.harvest_grams}
              />
            </section>

            <section>
              <h2 className="section-title">Últimos parámetros</h2>
              {geneticSeries.length <= 1 ? (
                <MeasurementGrid
                  latest={latestPerField(geneticSeries[0]?.series ?? [])}
                />
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

            {isActive && (
              <section>
                <h2 className="section-title">Acciones rápidas</h2>
                <QuickActions cultivationId={id} userId={user.id} />
              </section>
            )}

            <section className="card">
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
                <div className={styles.activityRow}>
                  <Camera size={16} aria-hidden="true" />
                  <span className={styles.activityLabel}>Fotos totales</span>
                  <span className={styles.activityValue}>
                    {entries.reduce((sum, e) => sum + e.photos.length, 0)}
                  </span>
                </div>
              </div>
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
                  {activeProblems.slice(0, 2).map((problem) => (
                    <ProblemCard
                      key={problem.id}
                      problem={problem}
                      cultivationStartDate={cultivation.start_date}
                    />
                  ))}
                </div>
              </section>
            )}

            {hasSeries && (
              <section className="card">
                <h2 className="section-title">Evolución reciente</h2>
                <div className={styles.geneticStack}>
                  {geneticSeries.map((group) => (
                    <div key={group.geneticId ?? "general"}>
                      {geneticSeries.length > 1 && (
                        <p className={styles.geneticLabel}>{group.label}</p>
                      )}
                      <MeasurementChart
                        series={group.series.slice(-14)}
                        height={180}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {tab === "timeline" &&
          (entries.length === 0 ? (
            <EmptyState
              icon={<NotebookPen size={24} />}
              title="Este cultivo todavía no tiene registros"
              description="Registrá el primer día para empezar a construir el historial."
              action={
                isActive ? (
                  <Link href={`/cultivos/${id}/registrar`}>
                    <Button>Registrar primer día</Button>
                  </Link>
                ) : undefined
              }
            />
          ) : (
            <div className={styles.list}>
              {entries.map((entry) => (
                <TimelineEntry
                  key={entry.id}
                  entry={entry}
                  startDate={cultivation.start_date}
                  periods={periods}
                  photoUrls={photoUrlMap}
                  problems={problems}
                  geneticNames={geneticNames}
                />
              ))}
            </div>
          ))}

        {tab === "parametros" &&
          (!hasSeries ? (
            <EmptyState
              title="Sin parámetros registrados"
              description="Registrá temperatura, humedad, pH, EC o PPM para ver los gráficos."
              action={
                isActive ? (
                  <Link href={`/cultivos/${id}/registrar`}>
                    <Button>Registrar parámetros</Button>
                  </Link>
                ) : undefined
              }
            />
          ) : (
            <section className="card">
              <GeneticParametersPanel groups={geneticSeries} />
            </section>
          ))}

        {tab === "galeria" &&
          (galleryPhotos.length === 0 ? (
            <EmptyState
              icon={<Camera size={24} />}
              title="Todavía no agregaste fotos"
              description="Las fotos que subas en los registros diarios van a aparecer acá."
            />
          ) : (
            <PhotoGrid photos={galleryPhotos} />
          ))}

        {tab === "problemas" && (
          <>
            <div className={styles.topBar}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                Problemas
              </h2>
              <Link href={`/cultivos/${id}/problemas/nuevo`}>
                <Button size="small" variant="secondary">
                  <Plus size={15} aria-hidden="true" />
                  Nuevo problema
                </Button>
              </Link>
            </div>
            {problems.length === 0 ? (
              <EmptyState
                icon={<ShieldCheck size={24} />}
                title="No hay problemas registrados"
                description="Si detectás plagas, carencias u otros inconvenientes, registralos acá."
              />
            ) : (
              <>
                {activeProblems.length > 0 && (
                  <section>
                    <h3 className="section-title">Activos</h3>
                    <div className={styles.list}>
                      {activeProblems.map((problem) => (
                        <ProblemCard
                          key={problem.id}
                          problem={problem}
                          cultivationStartDate={cultivation.start_date}
                        />
                      ))}
                    </div>
                  </section>
                )}
                {resolvedProblems.length > 0 && (
                  <section>
                    <h3 className="section-title">Resueltos</h3>
                    <div className={styles.list}>
                      {resolvedProblems.map((problem) => (
                        <ProblemCard
                          key={problem.id}
                          problem={problem}
                          cultivationStartDate={cultivation.start_date}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </>
        )}

        {tab === "info" && (
          <>
            <section className="card">
              <div className={styles.topBar} style={{ marginBottom: 12 }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>
                  Información
                </h2>
                <Link href={`/cultivos/${id}/editar`}>
                  <Button size="small" variant="secondary">
                    <Pencil size={14} aria-hidden="true" />
                    Editar
                  </Button>
                </Link>
              </div>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Nombre</span>
                  <span className={styles.infoValue}>{cultivation.name}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Plantas</span>
                  <span className={styles.infoValue}>{cultivation.plant_count}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Fecha de inicio</span>
                  <span className={styles.infoValue}>
                    {formatDate(cultivation.start_date)}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Fecha de finalización</span>
                  <span className={styles.infoValue}>
                    {cultivation.end_date ? formatDate(cultivation.end_date) : "—"}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Genética</span>
                  <span className={styles.infoValue}>{cultivation.genetics ?? "—"}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Método</span>
                  <span className={styles.infoValue}>{cultivation.method ?? "—"}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Medio / sustrato</span>
                  <span className={styles.infoValue}>{cultivation.medium ?? "—"}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Ambiente</span>
                  <span className={styles.infoValue}>
                    {cultivation.environment ?? "—"}
                  </span>
                </div>
                {cultivation.description && (
                  <div className={`${styles.infoItem} ${styles.infoWide}`}>
                    <span className={styles.infoLabel}>Descripción</span>
                    <span className={styles.infoValue}>{cultivation.description}</span>
                  </div>
                )}
              </div>
              {cultivation.final_notes && (
                <div style={{ marginTop: 14 }}>
                  <span className={styles.infoLabel}>Nota final</span>
                  <p className={styles.finalNotes} style={{ marginTop: 4 }}>
                    {cultivation.final_notes}
                  </p>
                </div>
              )}
            </section>

            <section className="card">
              <h2 className="section-title">Plantas</h2>
              {plants.length === 0 ? (
                <p className="text-muted" style={{ fontSize: 14 }}>
                  Este cultivo todavía no tiene plantas configuradas.
                </p>
              ) : (
                plants.map((plant) => {
                  const title = plant.genetics?.trim()
                    ? `${plant.genetics.trim()} #${plant.number}`
                    : `Planta #${plant.number}`;
                  const summary = [plant.method, plant.environment]
                    .filter(Boolean)
                    .join(" · ");
                  return (
                    <div key={plant.id} className={styles.periodRow}>
                      <div>
                        <p className={styles.periodName}>{title}</p>
                        <p className={styles.periodDates}>
                          {summary || "Sin configurar"}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </section>

            <section className="card">
              <div className={styles.topBar} style={{ marginBottom: 8 }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>
                  Períodos
                </h2>
                {isActive && (
                  <PeriodManager cultivationId={id} currentPeriod={activePeriod} />
                )}
              </div>
              <PeriodList
                cultivationId={id}
                periods={periods}
                isActive={isActive}
                cultivationEndDate={cultivation.end_date}
                harvestGrams={cultivation.harvest_grams}
              />
            </section>

            <section className="card">
              <h2 className="section-title">Gestión</h2>
              <CultivationDangerZone
                cultivationId={id}
                cultivationName={cultivation.name}
                isActive={isActive}
              />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
