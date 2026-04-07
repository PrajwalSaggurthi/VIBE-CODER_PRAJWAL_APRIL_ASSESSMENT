"""Theme configuration router."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.dependencies import get_current_user, get_tenant_db
from app.models.theme import ThemeConfig
from app.schemas.theme import ThemeResponse, ThemeUpdateRequest

router = APIRouter()

PRESET_THEMES = [
    {
        "name": "minimal",
        "label": "Minimal",
        "primary_color": "#1a1a2e",
        "secondary_color": "#16213e",
        "bg_color": "#ffffff",
        "text_color": "#1a1a2e",
        "font_family": "Inter",
        "button_style": "rounded",
        "bg_pattern": "none",
    },
    {
        "name": "vibrant",
        "label": "Vibrant",
        "primary_color": "#ff6b6b",
        "secondary_color": "#feca57",
        "bg_color": "#2d1b69",
        "text_color": "#ffffff",
        "font_family": "Outfit",
        "button_style": "pill",
        "bg_pattern": "gradient",
    },
    {
        "name": "neon",
        "label": "Neon",
        "primary_color": "#00f5d4",
        "secondary_color": "#7b2ff7",
        "bg_color": "#0a0a0a",
        "text_color": "#e0e0e0",
        "font_family": "Space Grotesk",
        "button_style": "outline",
        "bg_pattern": "dots",
    },
]


@router.get("", response_model=ThemeResponse)
async def get_theme(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_tenant_db),
):
    """Get the current tenant's theme configuration."""
    result = await db.execute(
        select(ThemeConfig).where(ThemeConfig.tenant_id == current_user["tenant_id"])
    )
    theme = result.scalar_one_or_none()

    if not theme:
        # Return default theme if none configured
        return ThemeResponse(**PRESET_THEMES[0], preset_name="minimal")

    return theme


@router.put("", response_model=ThemeResponse)
async def update_theme(
    data: ThemeUpdateRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_tenant_db),
):
    """Update the current tenant's theme configuration."""
    result = await db.execute(
        select(ThemeConfig).where(ThemeConfig.tenant_id == current_user["tenant_id"])
    )
    theme = result.scalar_one_or_none()

    if not theme:
        theme = ThemeConfig(tenant_id=current_user["tenant_id"])

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(theme, field, value)

    db.add(theme)
    return theme


@router.get("/presets")
async def list_presets():
    """List available theme presets (public)."""
    return PRESET_THEMES
