import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getCultivation } from "@/lib/queries/cultivations";
import { getProblem } from "@/lib/queries/problems";
import { getSignedUrlMap } from "@/lib/queries/photos";
import { dayNumber, formatDate } from "@/lib/utils/dates";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProblemActions } from "@/components/problems/ProblemActions";
import styles from "./problema.module.scss";

export const metadata: Metadata = { title: "Problema" };

type PageProps = {
  params: Promise<{ id: string; problemId: string }>;
};

export default async function ProblemPage({ params }: PageProps) {
  const { id, problemId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [cultivation, problem] = await Promise.all([
    getCultivation(supabase, id),
    getProblem(supabase, problemId),
  ]);
  if (!cultivation || !problem || problem.cultivation_id !== id) notFound();

  const isActive = problem.status === "active";
  const day = dayNumber(cultivation.start_date, problem.detected_at);

  const photoPaths = problem.problem_photos.map((p) => p.storage_path);
  const urlMap = await getSignedUrlMap(supabase, photoPaths);

  return (
    <div className={styles.page}>
      <PageHeader
        title={problem.title}
        backHref={`/cultivos/${id}?tab=problemas`}
        backLabel={cultivation.name}
        action={
          <span
            className={`${styles.status} ${isActive ? styles.active : styles.resolved}`}
          >
            {isActive ? "Activo" : "Resuelto"}
          </span>
        }
      />

      <section className="card">
        <p className={styles.meta}>
          Detectado el día {day} del cultivo · {formatDate(problem.detected_at)}
        </p>
        {problem.description && (
          <p className={styles.description} style={{ marginTop: 10 }}>
            {problem.description}
          </p>
        )}
      </section>

      {problem.problem_photos.length > 0 && (
        <section>
          <h2 className="section-title">Fotos</h2>
          <div className={styles.photos}>
            {problem.problem_photos.map((photo) => {
              const url = urlMap.get(photo.storage_path);
              if (!url) return null;
              return (
                <div key={photo.id} className={styles.photo}>
                  <Image
                    src={url}
                    alt={`Foto del problema ${problem.title}`}
                    fill
                    sizes="(max-width: 768px) 33vw, 150px"
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {problem.status === "resolved" && problem.solution && (
        <div className={styles.solution}>
          <span className={styles.solutionTitle}>
            Solución aplicada
            {problem.resolved_at ? ` · ${formatDate(problem.resolved_at)}` : ""}
          </span>
          <p className={styles.solutionText}>{problem.solution}</p>
        </div>
      )}

      <section className="card">
        <h2 className="section-title">Acciones</h2>
        <ProblemActions problem={problem} />
      </section>
    </div>
  );
}
