import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Skeleton height={30} width={120} />
      <Skeleton height={116} radius={14} />
      <Skeleton height={92} radius={14} />
      <Skeleton height={100} radius={14} />
      <Skeleton height={180} radius={14} />
    </div>
  );
}
