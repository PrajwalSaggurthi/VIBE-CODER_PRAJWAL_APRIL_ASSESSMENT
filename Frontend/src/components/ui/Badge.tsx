"use client";

import { ReactNode } from "react";
import styles from "./Badge.module.css";
import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "info";
  children: ReactNode;
  className?: string;
}

export default function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span className={cn(styles.badge, styles[variant], className)}>
      {children}
    </span>
  );
}
