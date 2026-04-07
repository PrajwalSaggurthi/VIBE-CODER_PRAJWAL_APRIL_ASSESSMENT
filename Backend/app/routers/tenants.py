"""Tenant profile router."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.dependencies import get_current_user, get_tenant_db
from app.models.tenant import Tenant
from app.schemas.tenant import TenantResponse, TenantUpdateRequest

router = APIRouter()


@router.get("", response_model=TenantResponse)
async def get_tenant(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_tenant_db),
):
    """Get the current tenant's profile."""
    result = await db.execute(
        select(Tenant).where(Tenant.id == current_user["tenant_id"])
    )
    tenant = result.scalar_one_or_none()
    return tenant


@router.put("", response_model=TenantResponse)
async def update_tenant(
    data: TenantUpdateRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_tenant_db),
):
    """Update the current tenant's profile."""
    result = await db.execute(
        select(Tenant).where(Tenant.id == current_user["tenant_id"])
    )
    tenant = result.scalar_one_or_none()

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tenant, field, value)

    db.add(tenant)
    return tenant
