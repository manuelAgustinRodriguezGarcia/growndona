import { Skeleton } from "@/components/ui/Skeleton";

export default function CultivationsLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Skeleton height={32} width={180} />
      <Skeleton height={118} radius={14} />
      <Skeleton height={118} radius={14} />
      <Skeleton height={118} radius={14} />
    </div>
  );
}
