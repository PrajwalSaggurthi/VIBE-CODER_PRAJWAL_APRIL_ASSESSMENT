"""Analytics router — click recording and aggregation."""

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from uuid import UUID
from datetime import datetime, timedelta, timezone

from app.database import get_db
from app.dependencies import get_current_user, get_tenant_db
from app.models.click_event import ClickEvent
from app.models.link import Link
from app.schemas.analytics import (
    ClickRecordRequest,
    AnalyticsOverview,
    HeatmapData,
    TrafficSourceData,
)

router = APIRouter()


@router.post("/click", status_code=201)
async def record_click(
    data: ClickRecordRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Record a click event (public — no auth required)."""
    # Verify link exists
    result = await db.execute(select(Link).where(Link.id == data.link_id))
    link = result.scalar_one_or_none()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    click = ClickEvent(
        tenant_id=link.tenant_id,
        link_id=link.id,
        referrer=data.referrer or request.headers.get("referer", "direct"),
        user_agent=request.headers.get("user-agent", "unknown"),
        country=data.country or "unknown",
    )
    db.add(click)
    return {"status": "recorded"}


@router.get("/overview", response_model=AnalyticsOverview)
async def get_overview(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_tenant_db),
):
    """Get analytics overview for the current tenant."""
    tenant_id = current_user["tenant_id"]

    # Total clicks
    total = await db.execute(
        select(func.count(ClickEvent.id)).where(ClickEvent.tenant_id == tenant_id)
    )
    total_clicks = total.scalar() or 0

    # Clicks today
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    today = await db.execute(
        select(func.count(ClickEvent.id))
        .where(ClickEvent.tenant_id == tenant_id)
        .where(ClickEvent.clicked_at >= today_start)
    )
    clicks_today = today.scalar() or 0

    # Top links
    top_links_result = await db.execute(
        select(Link.title, func.count(ClickEvent.id).label("clicks"))
        .join(ClickEvent, ClickEvent.link_id == Link.id)
        .where(Link.tenant_id == tenant_id)
        .group_by(Link.id, Link.title)
        .order_by(func.count(ClickEvent.id).desc())
        .limit(5)
    )
    top_links = [
        {"title": row.title, "clicks": row.clicks}
        for row in top_links_result.all()
    ]

    return AnalyticsOverview(
        total_clicks=total_clicks,
        clicks_today=clicks_today,
        top_links=top_links,
    )


@router.get("/heatmap", response_model=list[HeatmapData])
async def get_heatmap(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_tenant_db),
):
    """Get 24-hour click heatmap for the last 30 days."""
    tenant_id = current_user["tenant_id"]
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)

    result = await db.execute(
        select(
            func.extract("hour", ClickEvent.clicked_at).label("hour"),
            func.count(ClickEvent.id).label("clicks"),
        )
        .where(ClickEvent.tenant_id == tenant_id)
        .where(ClickEvent.clicked_at >= thirty_days_ago)
        .group_by(text("hour"))
        .order_by(text("hour"))
    )

    return [HeatmapData(hour=int(row.hour), clicks=row.clicks) for row in result.all()]


@router.get("/sources", response_model=list[TrafficSourceData])
async def get_traffic_sources(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_tenant_db),
):
    """Get traffic source breakdown."""
    tenant_id = current_user["tenant_id"]

    result = await db.execute(
        select(
            ClickEvent.referrer,
            func.count(ClickEvent.id).label("clicks"),
        )
        .where(ClickEvent.tenant_id == tenant_id)
        .group_by(ClickEvent.referrer)
        .order_by(func.count(ClickEvent.id).desc())
        .limit(10)
    )

    return [
        TrafficSourceData(source=row.referrer or "direct", clicks=row.clicks)
        for row in result.all()
    ]
