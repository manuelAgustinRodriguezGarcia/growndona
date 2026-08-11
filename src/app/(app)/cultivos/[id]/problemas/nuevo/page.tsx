import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getCultivation } from "@/lib/queries/cultivations";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProblemForm } from "@/components/problems/ProblemForm";

export const metadata: Metadata = { title: "Nuevo problema" };

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewProblemPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const cultivation = await getCultivation(supabase, id);
  if (!cultivation) notFound();

  return (
    <>
      <PageHeader
        title="Nuevo problema"
        subtitle={cultivation.name}
        backHref={`/cultivos/${id}?tab=problemas`}
        backLabel={cultivation.name}
      />
      <ProblemForm cultivationId={id} userId={user.id} />
    </>
  );
}
