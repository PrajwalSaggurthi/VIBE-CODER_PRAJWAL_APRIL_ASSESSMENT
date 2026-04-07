"""Theme schemas."""

from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional


class ThemeResponse(BaseModel):
    id: Optional[UUID] = None
    tenant_id: Optional[UUID] = None
    preset_name: str = "minimal"
    primary_color: str = "#1a1a2e"
    secondary_color: str = "#16213e"
    bg_color: str = "#ffffff"
    text_color: str = "#1a1a2e"
    font_family: str = "Inter"
    button_style: str = "rounded"
    bg_pattern: str = "none"
    bg_image_url: Optional[str] = None
    custom_css: Optional[dict] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ThemeUpdateRequest(BaseModel):
    preset_name: Optional[str] = Field(None, max_length=50)
    primary_color: Optional[str] = Field(None, max_length=7)
    secondary_color: Optional[str] = Field(None, max_length=7)
    bg_color: Optional[str] = Field(None, max_length=7)
    text_color: Optional[str] = Field(None, max_length=7)
    font_family: Optional[str] = Field(None, max_length=100)
    button_style: Optional[str] = Field(None, max_length=20)
    bg_pattern: Optional[str] = Field(None, max_length=20)
    bg_image_url: Optional[str] = Field(None, max_length=500)
    custom_css: Optional[dict] = None
