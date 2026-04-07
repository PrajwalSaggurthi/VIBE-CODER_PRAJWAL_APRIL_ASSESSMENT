"""Links CRUD router with drag-and-drop reordering."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from uuid import UUID

from app.dependencies import get_current_user, get_tenant_db
from app.models.link import Link
from app.schemas.link import (
    LinkResponse,
    LinkCreateRequest,
    LinkUpdateRequest,
    LinkReorderRequest,
)

router = APIRouter()


@router.get("", response_model=list[LinkResponse])
async def list_links(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_tenant_db),
):
    """List all links for the current tenant, ordered by position."""
    result = await db.execute(
        select(Link)
        .where(Link.tenant_id == current_user["tenant_id"])
        .order_by(Link.position)
    )
    return result.scalars().all()


@router.post("", response_model=LinkResponse, status_code=status.HTTP_201_CREATED)
async def create_link(
    data: LinkCreateRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_tenant_db),
):
    """Create a new link for the current tenant."""
    # Get next position
    result = await db.execute(
        select(Link)
        .where(Link.tenant_id == current_user["tenant_id"])
        .order_by(Link.position.desc())
        .limit(1)
    )
    last_link = result.scalar_one_or_none()
    next_position = (last_link.position + 1) if last_link else 0

    link = Link(
        tenant_id=UUID(current_user["tenant_id"]),
        title=data.title,
        url=data.url,
        icon=data.icon,
        position=next_position,
        is_active=True,
    )
    db.add(link)
    await db.flush()
    return link


@router.put("/{link_id}", response_model=LinkResponse)
async def update_link(
    link_id: UUID,
    data: LinkUpdateRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_tenant_db),
):
    """Update an existing link."""
    result = await db.execute(select(Link).where(Link.id == link_id))
    link = result.scalar_one_or_none()

    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(link, field, value)

    db.add(link)
    return link


@router.delete("/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_link(
    link_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_tenant_db),
):
    """Delete a link."""
    result = await db.execute(select(Link).where(Link.id == link_id))
    link = result.scalar_one_or_none()

    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    await db.delete(link)


@router.put("/reorder", response_model=list[LinkResponse])
async def reorder_links(
    data: LinkReorderRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_tenant_db),
):
    """Batch update link positions after drag-and-drop reorder."""
    for item in data.order:
        await db.execute(
            update(Link)
            .where(Link.id == item.id)
            .where(Link.tenant_id == current_user["tenant_id"])
            .values(position=item.position)
        )

    # Return updated list
    result = await db.execute(
        select(Link)
        .where(Link.tenant_id == current_user["tenant_id"])
        .order_by(Link.position)
    )
    return result.scalars().all()
