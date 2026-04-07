"""Tenant schemas."""

from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional

from app.schemas.link import LinkResponse
from app.schemas.theme import ThemeResponse


class TenantResponse(BaseModel):
    id: UUID
    slug: str
    name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    social_links: Optional[dict] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TenantUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    bio: Optional[str] = Field(None, max_length=500)
    avatar_url: Optional[str] = Field(None, max_length=500)
    social_links: Optional[dict] = None


class PublicTenantInfo(BaseModel):
    slug: str
    name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    social_links: Optional[dict] = None

    model_config = {"from_attributes": True}


class PublicProfileResponse(BaseModel):
    tenant: PublicTenantInfo
    links: list[LinkResponse] = []
    theme: Optional[ThemeResponse] = None

    model_config = {"from_attributes": True}

