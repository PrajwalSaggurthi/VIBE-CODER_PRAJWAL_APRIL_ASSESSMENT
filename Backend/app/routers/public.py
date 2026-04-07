"""Public profile router — unauthenticated access to tenant pages."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.tenant import Tenant
from app.models.link import Link
from app.models.theme import ThemeConfig
from app.schemas.tenant import PublicProfileResponse

router = APIRouter()


@router.get("/{slug}", response_model=PublicProfileResponse)
async def get_public_profile(slug: str, db: AsyncSession = Depends(get_db)):
    """Get a tenant's public profile, links, and theme by slug.
    
    This endpoint is publicly accessible (no authentication).
    RLS is NOT applied here — we query by slug directly.
    """
    # Get tenant
    result = await db.execute(select(Tenant).where(Tenant.slug == slug))
    tenant = result.scalar_one_or_none()

    if not tenant:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Get links (ordered, active only)
    links_result = await db.execute(
        select(Link)
        .where(Link.tenant_id == tenant.id)
        .where(Link.is_active == True)  # noqa: E712
        .order_by(Link.position)
    )
    links = links_result.scalars().all()

    # Get theme
    theme_result = await db.execute(
        select(ThemeConfig).where(ThemeConfig.tenant_id == tenant.id)
    )
    theme = theme_result.scalar_one_or_none()

    return PublicProfileResponse(
        tenant=tenant,
        links=links,
        theme=theme,
    )
