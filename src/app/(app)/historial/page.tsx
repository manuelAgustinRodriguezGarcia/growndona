import Link from "next/link";
import type { Metadata } from "next";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Droplets,
  History,
  Scissors,
  StickyNote,
  Thermometer,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getRecentActivity, type ActivityItem } from "@/lib/queries/history";
import { relativeDate } from "@/lib/utils/dates";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import styles from "./historial.module.scss";

export const metadata: Metadata = { title: "Historial" };

function itemIcon(kind: ActivityItem["kind"]) {
  switch (kind) {
    case "measurements":
      return <Thermometer size={17} aria-hidden="true" />;
    case "irrigation":
      return <Droplets size={17} aria-hidden="true" />;
    case "action":
      return <Scissors size={17} aria-hidden="true" />;
    case "photos":
      return <Camera size={17} aria-hidden="true" />;
    case "note":
      return <StickyNote size={17} aria-hidden="true" />;
    case "problem":
      return <AlertTriangle size={17} aria-hidden="true" />;
    case "problem_resolved":
      return <CheckCircle2 size={17} aria-hidden="true" />;
  }
}

export default async function HistoryPage() {
  const supabase = await createClient();
  const items = await getRecentActivity(supabase);

  const groups = new Map<string, ActivityItem[]>();
  for (const item of items) {
    const label = relativeDate(item.date);
    const group = groups.get(label) ?? [];
    group.push(item);
    groups.set(label, group);
  }

  return (
    <>
      <PageHeader
        title="Historial"
        subtitle="Actividad reciente de todos tus cultivos."
      />
      {items.length === 0 ? (
        <EmptyState
          icon={<History size={24} />}
          title="Sin actividad todavía"
          description="Cuando registres días, riegos, fotos o problemas, van a aparecer acá."
        />
      ) : (
        <div className={styles.groups}>
          {[...groups.entries()].map(([label, groupItems]) => (
            <section key={label} className={styles.group}>
              <h2 className="section-title">{label}</h2>
              {groupItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/cultivos/${item.cultivationId}?tab=timeline`}
                  className={styles.item}
                >
                  <span
                    className={`${styles.icon} ${item.kind === "problem" ? styles.warning : ""}`}
                  >
                    {itemIcon(item.kind)}
                  </span>
                  <span className={styles.body}>
                    <span className={styles.cultivation}>
                      {item.cultivationName}
                    </span>
                    <span className={styles.label}>{item.label}</span>
                  </span>
                </Link>
              ))}
            </section>
          ))}
        </div>
      )}
    </>
  );
}
