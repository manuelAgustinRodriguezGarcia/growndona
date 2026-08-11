import { Skeleton } from "@/components/ui/Skeleton";

export default function ProfileLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Skeleton height={30} width={100} />
      <Skeleton height={104} radius={14} />
      <Skeleton height={80} radius={10} />
      <Skeleton height={80} radius={10} />
    </div>
  );
}
