"use client";

import { ReactNode } from "react";
import styles from "./Card.module.css";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: "sm" | "md" | "lg";
}

export default function Card({
  children,
  className,
  hoverable = false,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={cn(
        styles.card,
        styles[`padding-${padding}`],
        hoverable && styles.hoverable,
        className
      )}
    >
      {children}
    </div>
  );
}
