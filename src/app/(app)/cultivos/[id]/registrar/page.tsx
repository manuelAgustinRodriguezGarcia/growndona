import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getCultivation } from "@/lib/queries/cultivations";
import { getEntryByDate } from "@/lib/queries/entries";
import { getSignedUrlMap } from "@/lib/queries/photos";
import { todayISO } from "@/lib/utils/dates";
import { PageHeader } from "@/components/layout/PageHeader";
import { DailyEntryForm } from "@/components/entries/DailyEntryForm";

export const metadata: Metadata = { title: "Registrar día" };

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ fecha?: string }>;
};

export default async function RegisterDayPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { fecha } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const cultivation = await getCultivation(supabase, id);
  if (!cultivation) notFound();

  const date = fecha && /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? fecha : todayISO();
  const existing = await getEntryByDate(supabase, id, date);

  const photoPaths = existing?.photos.map((p) => p.storage_path) ?? [];
  const urlMap = await getSignedUrlMap(supabase, photoPaths);
  const existingPhotos = (existing?.photos ?? [])
    .map((photo) => {
      const url = urlMap.get(photo.storage_path);
      if (!url) return null;
      return { id: photo.id, url, storage_path: photo.storage_path };
    })
    .filter((p): p is { id: string; url: string; storage_path: string } => p !== null);

  return (
    <>
      <PageHeader
        title="Registrar día"
        subtitle={cultivation.name}
        backHref={`/cultivos/${id}`}
        backLabel={cultivation.name}
      />
      <DailyEntryForm
        key={date}
        cultivationId={id}
        userId={user.id}
        startDate={cultivation.start_date}
        date={date}
        existing={existing}
        existingPhotos={existingPhotos}
      />
    </>
  );
}
