import styles from "./Skeleton.module.scss";

type SkeletonProps = {
  height?: number | string;
  width?: number | string;
  radius?: number | string;
  className?: string;
};

export function Skeleton({ height = 20, width = "100%", radius, className }: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className ?? ""}`}
      style={{ height, width, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}
