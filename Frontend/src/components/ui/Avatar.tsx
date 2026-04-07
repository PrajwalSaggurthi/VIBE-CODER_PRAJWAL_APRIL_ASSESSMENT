"use client";

import styles from "./Avatar.module.css";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Avatar({ src, name, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(styles.avatar, styles[size], className)}
      />
    );
  }

  return (
    <div className={cn(styles.avatar, styles.fallback, styles[size], className)}>
      <span>{getInitials(name)}</span>
    </div>
  );
}
