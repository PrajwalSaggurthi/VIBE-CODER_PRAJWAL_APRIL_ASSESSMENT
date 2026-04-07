"""Tenant context middleware for RLS enforcement."""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.security.jwt import decode_access_token


class TenantContextMiddleware(BaseHTTPMiddleware):
    """Middleware that extracts tenant_id from JWT and stores it in request state.
    
    This is used as a convenience layer. The actual RLS enforcement
    happens in the get_tenant_db dependency which calls SET LOCAL.
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        # Extract tenant from Authorization header if present
        auth_header = request.headers.get("authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            payload = decode_access_token(token)
            if payload:
                request.state.tenant_id = payload.get("tenant_id")
                request.state.user_id = payload.get("sub")
            else:
                request.state.tenant_id = None
                request.state.user_id = None
        else:
            request.state.tenant_id = None
            request.state.user_id = None

        response = await call_next(request)
        return response
