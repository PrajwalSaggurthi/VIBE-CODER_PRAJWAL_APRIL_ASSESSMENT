"use client";

import styles from "./Skeleton.module.css";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export default function Skeleton({
  width = "100%",
  height = "20px",
  borderRadius,
  className,
}: SkeletonProps) {
  return (
    <div
      className={cn(styles.skeleton, className)}
      style={{ width, height, borderRadius }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Skeleton width="40px" height="40px" borderRadius="50%" />
        <div className={styles.cardHeaderText}>
          <Skeleton width="120px" height="14px" />
          <Skeleton width="180px" height="12px" />
        </div>
      </div>
      <Skeleton height="12px" />
      <Skeleton width="75%" height="12px" />
    </div>
  );
}
