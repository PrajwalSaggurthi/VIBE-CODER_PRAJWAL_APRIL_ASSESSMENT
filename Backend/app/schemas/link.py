"""Link schemas."""

from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional


class LinkResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    title: str
    url: str
    icon: Optional[str] = None
    position: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class LinkCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    url: str = Field(..., min_length=1, max_length=2048)
    icon: Optional[str] = Field(None, max_length=100)


class LinkUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    url: Optional[str] = Field(None, max_length=2048)
    icon: Optional[str] = Field(None, max_length=100)
    is_active: Optional[bool] = None


class LinkOrderItem(BaseModel):
    id: UUID
    position: int


class LinkReorderRequest(BaseModel):
    order: list[LinkOrderItem]
