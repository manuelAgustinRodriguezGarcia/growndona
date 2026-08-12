import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getCultivation } from "@/lib/queries/cultivations";
import { getPlants } from "@/lib/queries/plants";
import { PageHeader } from "@/components/layout/PageHeader";
import { EditCultivationForm } from "@/components/cultivation/EditCultivationForm";

export const metadata: Metadata = { title: "Editar cultivo" };

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCultivationPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const cultivation = await getCultivation(supabase, id);
  if (!cultivation) notFound();

  const plants = await getPlants(supabase, id);

  return (
    <>
      <PageHeader
        title="Editar cultivo"
        subtitle={cultivation.name}
        backHref={`/cultivos/${id}?tab=info`}
        backLabel={cultivation.name}
      />
      <EditCultivationForm
        cultivation={cultivation}
        plants={plants}
        userId={user.id}
      />
    </>
  );
}
