"""Theme configuration model — one-to-one with tenant."""

import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ThemeConfig(Base):
    __tablename__ = "theme_configs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    preset_name: Mapped[str] = mapped_column(String(50), nullable=False, default="minimal")
    primary_color: Mapped[str] = mapped_column(String(7), nullable=False, default="#1a1a2e")
    secondary_color: Mapped[str] = mapped_column(String(7), nullable=False, default="#16213e")
    bg_color: Mapped[str] = mapped_column(String(7), nullable=False, default="#ffffff")
    text_color: Mapped[str] = mapped_column(String(7), nullable=False, default="#1a1a2e")
    font_family: Mapped[str] = mapped_column(String(100), nullable=False, default="Inter")
    button_style: Mapped[str] = mapped_column(String(20), nullable=False, default="rounded")
    bg_pattern: Mapped[str] = mapped_column(String(20), nullable=False, default="none")
    bg_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    custom_css: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    tenant = relationship("Tenant", back_populates="theme_config")
