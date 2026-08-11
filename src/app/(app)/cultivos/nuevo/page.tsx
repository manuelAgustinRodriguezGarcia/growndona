import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { NewCultivationForm } from "@/components/cultivation/NewCultivationForm";

export const metadata: Metadata = { title: "Nuevo cultivo" };

export default async function NewCultivationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <>
      <PageHeader
        title="Nuevo cultivo"
        subtitle="Creá un cultivo para empezar a registrar su seguimiento."
        backHref="/cultivos"
        backLabel="Mis cultivos"
      />
      <NewCultivationForm userId={user.id} />
    </>
  );
}
