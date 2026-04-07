"""Permission guards to prevent IDOR attacks."""

from fastapi import HTTPException, status
from uuid import UUID


def verify_resource_ownership(resource_tenant_id: UUID, current_tenant_id: str) -> None:
    """Raise 403 if the resource doesn't belong to the current tenant.
    
    This is a defense-in-depth check on top of RLS policies.
    Even though RLS should prevent cross-tenant access at the DB level,
    this guard catches any issues at the application layer.
    """
    if str(resource_tenant_id) != str(current_tenant_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: resource belongs to another tenant",
        )
