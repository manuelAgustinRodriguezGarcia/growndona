import { Skeleton } from "@/components/ui/Skeleton";

export default function HistoryLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Skeleton height={30} width={140} />
      <Skeleton height={60} radius={10} />
      <Skeleton height={60} radius={10} />
      <Skeleton height={60} radius={10} />
      <Skeleton height={60} radius={10} />
      <Skeleton height={60} radius={10} />
    </div>
  );
}
