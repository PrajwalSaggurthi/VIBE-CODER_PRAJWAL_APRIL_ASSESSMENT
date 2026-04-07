"use client";

import { ReactNode } from "react";
import Card from "@/components/ui/Card";
import styles from "./StatsCard.module.css";

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
}

export default function StatsCard({ icon, label, value, trend, trendUp }: StatsCardProps) {
  return (
    <Card className={styles.card}>
      <div className={styles.iconWrap}>{icon}</div>
      <div className={styles.info}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
        {trend && (
          <span className={`${styles.trend} ${trendUp ? styles.trendUp : styles.trendDown}`}>
            {trend}
          </span>
        )}
      </div>
    </Card>
  );
}
