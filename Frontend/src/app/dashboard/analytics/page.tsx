"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import Card from "@/components/ui/Card";
import StatsCard from "@/components/dashboard/StatsCard";
import Skeleton from "@/components/ui/Skeleton";
import { formatNumber } from "@/lib/utils";
import { FiMousePointer, FiTrendingUp, FiGlobe } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import styles from "./analytics.module.css";

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899", "#6b7280"];

export default function AnalyticsPage() {
  const { overview, heatmap, sources, isLoading, days, setDays } = useAnalytics();

  if (isLoading && !overview) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Analytics</h1>
            <p className={styles.subtitle}>Loading your data...</p>
          </div>
        </div>
        <div className={styles.statsGrid}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height="90px" borderRadius="var(--radius-xl)" />
          ))}
        </div>
        <div className={styles.chartsGrid}>
          <Skeleton height="360px" borderRadius="var(--radius-xl)" />
          <Skeleton height="360px" borderRadius="var(--radius-xl)" />
        </div>
      </div>
    );
  }

  // Fill in missing hours for heatmap (0–23)
  const fullHeatmap = Array.from({ length: 24 }, (_, i) => {
    const existing = heatmap.find((h) => h.hour === i);
    return { hour: `${i.toString().padStart(2, "0")}:00`, clicks: existing?.clicks || 0 };
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Analytics</h1>
          <p className={styles.subtitle}>
            Track your link performance over the {days === 0 ? "entire lifetime" : `last ${days} days`}
          </p>
        </div>
        <select 
          className={styles.dateFilter} 
          value={days} 
          onChange={(e) => setDays(Number(e.target.value))}
          disabled={isLoading}
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
          <option value={0}>All Time</option>
        </select>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatsCard
          icon={<FiMousePointer />}
          label="Total Clicks"
          value={overview ? formatNumber(overview.total_clicks) : "0"}
        />
        <StatsCard
          icon={<FiTrendingUp />}
          label="Today"
          value={overview ? formatNumber(overview.clicks_today) : "0"}
        />
        <StatsCard
          icon={<FiGlobe />}
          label="Sources"
          value={sources.length}
        />
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        {/* Heatmap */}
        <Card className={styles.chartCard} padding="lg">
          <h2 className={styles.chartTitle}>Click Activity by Hour</h2>
          <p className={styles.chartSubtitle}>24-hour distribution ({days === 0 ? "All time" : `Last ${days} days`})</p>
          <div className={styles.chartWrap}>
            {isLoading ? (
              <div className={styles.loadingChart}><Skeleton height="100%" borderRadius="var(--radius-lg)" /></div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
              <BarChart data={fullHeatmap} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval={2}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="clicks" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Traffic Sources */}
        <Card className={styles.chartCard} padding="lg">
          <h2 className={styles.chartTitle}>Traffic Sources</h2>
          <p className={styles.chartSubtitle}>Where your visitors come from</p>
          <div className={styles.chartWrap}>
            {isLoading ? (
              <div className={styles.loadingChart}><Skeleton height="100%" borderRadius="var(--radius-lg)" /></div>
            ) : sources.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={sources.map((s) => ({ name: s.source, value: s.clicks }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {sources.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles.noData}>No traffic data yet</div>
            )}
          </div>
        </Card>
      </div>

      {/* Top Links */}
      {overview && overview.top_links.length > 0 && (
        <Card className={styles.topLinksCard} padding="lg">
          <h2 className={styles.chartTitle}>Top Performing Links</h2>
          <div className={styles.topLinksList}>
            {overview.top_links.map((link, idx) => (
              <div key={idx} className={styles.topLinkRow}>
                <span className={styles.topLinkRank}>#{idx + 1}</span>
                <span className={styles.topLinkTitle}>{link.title}</span>
                <div className={styles.topLinkBar}>
                  <div
                    className={styles.topLinkBarFill}
                    style={{
                      width: `${(link.clicks / overview.top_links[0].clicks) * 100}%`,
                    }}
                  />
                </div>
                <span className={styles.topLinkClicks}>{formatNumber(link.clicks)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
