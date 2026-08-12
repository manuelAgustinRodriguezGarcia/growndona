import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getProfileStats } from "@/lib/queries/profile";
import { getSignedUrl } from "@/lib/queries/photos";
import { PageHeader } from "@/components/layout/PageHeader";
import { LogoutButton, ProfileCard } from "@/components/profile/ProfileCard";
import styles from "./perfil.module.scss";

export const metadata: Metadata = { title: "Perfil" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profile, stats] = await Promise.all([
    getProfile(supabase, user.id),
    getProfileStats(supabase),
  ]);

  const avatarPath = profile?.avatar_url ?? null;
  const avatarUrl = avatarPath
    ? await getSignedUrl(supabase, avatarPath)
    : null;

  return (
    <div className={styles.page}>
      <PageHeader title="Perfil" />

      <ProfileCard
        userId={user.id}
        name={profile?.name ?? user.email ?? "Usuario"}
        username={profile?.username ?? null}
        email={user.email ?? ""}
        createdAt={profile?.created_at ?? user.created_at}
        avatarUrl={avatarUrl}
        avatarPath={avatarPath}
      />

      <section>
        <h2 className="section-title">Estadísticas</h2>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.activeCultivations}</span>
            <span className={styles.statLabel}>Cultivos activos</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.finishedCultivations}</span>
            <span className={styles.statLabel}>Cultivos finalizados</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.totalEntries}</span>
            <span className={styles.statLabel}>Registros</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.totalPhotos}</span>
            <span className={styles.statLabel}>Fotos</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.totalDays}</span>
            <span className={styles.statLabel}>Días cultivados</span>
          </div>
        </div>
      </section>

      <div className={styles.logoutArea}>
        <LogoutButton />
      </div>
    </div>
  );
}
