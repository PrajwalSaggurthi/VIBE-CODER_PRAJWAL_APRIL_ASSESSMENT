"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { AnalyticsOverview, HeatmapData, TrafficSourceData } from "@/types/analytics";

export function useAnalytics() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapData[]>([]);
  const [sources, setSources] = useState<TrafficSourceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);

  const fetchAll = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [ov, hm, src] = await Promise.all([
        api.get<AnalyticsOverview>(`/analytics/overview?days=${days}`),
        api.get<HeatmapData[]>(`/analytics/heatmap?days=${days}`),
        api.get<TrafficSourceData[]>(`/analytics/sources?days=${days}`),
      ]);
      setOverview(ov);
      setHeatmap(hm);
      setSources(src);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { overview, heatmap, sources, isLoading, error, refetch: fetchAll, days, setDays };
}
