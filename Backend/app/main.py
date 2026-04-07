"""LinkHub FastAPI application factory."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import auth, tenants, links, analytics, themes, public

settings = get_settings()


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="LinkHub API",
        description="Multi-tenant Link-in-Bio platform API",
        version="1.0.0",
        docs_url="/api/v1/docs",
        openapi_url="/api/v1/openapi.json",
    )

    # ── CORS ──────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routers ───────────────────────────────────
    api_prefix = "/api/v1"
    app.include_router(auth.router, prefix=f"{api_prefix}/auth", tags=["Authentication"])
    app.include_router(tenants.router, prefix=f"{api_prefix}/tenant", tags=["Tenant"])
    app.include_router(links.router, prefix=f"{api_prefix}/links", tags=["Links"])
    app.include_router(analytics.router, prefix=f"{api_prefix}/analytics", tags=["Analytics"])
    app.include_router(themes.router, prefix=f"{api_prefix}/theme", tags=["Theme"])
    app.include_router(public.router, prefix=f"{api_prefix}/public", tags=["Public"])

    @app.get("/api/v1/health", tags=["Health"])
    async def health_check():
        return {"status": "healthy", "service": "linkhub-api"}

    return app


app = create_app()
