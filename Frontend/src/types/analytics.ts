/* Analytics-related types. */

export interface AnalyticsOverview {
  total_clicks: number;
  clicks_today: number;
  top_links: TopLink[];
}

export interface TopLink {
  title: string;
  clicks: number;
}

export interface HeatmapData {
  hour: number;
  clicks: number;
}

export interface TrafficSourceData {
  source: string;
  clicks: number;
}
