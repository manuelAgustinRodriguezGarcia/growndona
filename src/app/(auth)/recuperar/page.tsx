import { RecoverForm } from "./RecoverForm";

export default async function RecoverPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { error } = await searchParams;

  return <RecoverForm linkError={error === "link"} />;
}
