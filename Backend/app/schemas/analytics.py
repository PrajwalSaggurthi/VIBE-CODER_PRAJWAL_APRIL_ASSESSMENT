"""Analytics schemas."""

from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class ClickRecordRequest(BaseModel):
    link_id: UUID
    referrer: Optional[str] = None
    country: Optional[str] = None


class TopLinkItem(BaseModel):
    title: str
    clicks: int


class AnalyticsOverview(BaseModel):
    total_clicks: int
    clicks_today: int
    top_links: list[TopLinkItem]


class HeatmapData(BaseModel):
    hour: int
    clicks: int


class TrafficSourceData(BaseModel):
    source: str
    clicks: int
