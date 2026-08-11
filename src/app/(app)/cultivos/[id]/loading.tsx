import { Skeleton } from "@/components/ui/Skeleton";

export default function CultivationLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Skeleton height={20} width={120} />
      <Skeleton height={116} radius={14} />
      <Skeleton height={38} radius={999} />
      <Skeleton height={110} radius={14} />
      <Skeleton height={180} radius={14} />
    </div>
  );
}
