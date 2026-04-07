"""Mock data seeder — creates 3 tenants with links, themes, and click events."""

import asyncio
import random
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy.ext.asyncio import AsyncSession
from app.database import async_session_factory, engine, Base
from app.models.tenant import Tenant
from app.models.user import User
from app.models.link import Link
from app.models.theme import ThemeConfig
from app.models.click_event import ClickEvent
from app.security.password import hash_password


TENANTS_DATA = [
    {
        "name": "Prajwal Saggurthi",
        "slug": "prajwal",
        "bio": "Full-stack developer | AI Developer & open source enthusiast. Building cool stuff with code.",
        "social_links": {"twitter": "", "github": "https://github.com/PrajwalSaggurthi"},
        "email": "prajwalsaggurthi1@gmail.com",
        "theme": {
            "preset_name": "minimal",
            "primary_color": "#1a1a2e",
            "secondary_color": "#16213e",
            "bg_color": "#ffffff",
            "text_color": "#1a1a2e",
            "font_family": "Inter",
            "button_style": "rounded",
            "bg_pattern": "none",
        },
        "links": [
            {"title": "GitHub", "url": "https://github.com/PrajwalSaggurthi", "icon": "github"},
            {"title": "LinkedIn", "url": "https://www.linkedin.com/in/prajwalsaggurthi/", "icon": "linkedin"},
            {"title": "Resume (PDF)", "url": "https://drive.google.com/file/d/14mfnpdAYmTAi-p9rxndjSz427RDU-A1z/view?usp=sharing", "icon": "file"},
        ],
    },
    {
        "name": "Luna Creative Studio",
        "slug": "luna-studio",
        "bio": "✨ Design studio crafting digital experiences. We make brands shine.",
        "social_links": {"instagram": "https://instagram.com/lunastudio", "dribbble": "https://dribbble.com/luna"},
        "email": "hello@lunastudio.io",
        "theme": {
            "preset_name": "vibrant",
            "primary_color": "#ff6b6b",
            "secondary_color": "#feca57",
            "bg_color": "#2d1b69",
            "text_color": "#ffffff",
            "font_family": "Outfit",
            "button_style": "pill",
            "bg_pattern": "gradient",
        },
        "links": [
            {"title": "Our Work", "url": "https://lunastudio.io/portfolio", "icon": "palette"},
            {"title": "Book a Call", "url": "https://cal.com/lunastudio", "icon": "calendar"},
            {"title": "Instagram", "url": "https://instagram.com/lunastudio", "icon": "instagram"},
            {"title": "Dribbble Shots", "url": "https://dribbble.com/luna", "icon": "dribbble"},
            {"title": "Free Resources", "url": "https://lunastudio.io/freebies", "icon": "gift"},
        ],
    },
    {
        "name": "NeonByte Gaming",
        "slug": "neonbyte",
        "bio": "🎮 Pro gamer & streamer. Catch me live every weekend!",
        "social_links": {"twitch": "https://twitch.tv/neonbyte", "youtube": "https://youtube.com/@neonbyte"},
        "email": "neon@bytegaming.gg",
        "theme": {
            "preset_name": "neon",
            "primary_color": "#00f5d4",
            "secondary_color": "#7b2ff7",
            "bg_color": "#0a0a0a",
            "text_color": "#e0e0e0",
            "font_family": "Space Grotesk",
            "button_style": "outline",
            "bg_pattern": "dots",
        },
        "links": [
            {"title": "Twitch Stream", "url": "https://twitch.tv/neonbyte", "icon": "twitch"},
            {"title": "YouTube Channel", "url": "https://youtube.com/@neonbyte", "icon": "youtube"},
            {"title": "Discord Server", "url": "https://discord.gg/neonbyte", "icon": "discord"},
            {"title": "Merch Store", "url": "https://neonbyte.store", "icon": "shopping-bag"},
            {"title": "Sponsor Me", "url": "https://ko-fi.com/neonbyte", "icon": "heart"},
        ],
    },
]

REFERRERS = ["twitter.com", "instagram.com", "google.com", "direct", "youtube.com", "linkedin.com", "reddit.com"]
COUNTRIES = ["US", "IN", "UK", "DE", "BR", "JP", "CA", "AU", "FR", "KR"]


async def seed():
    """Seed the database with mock data."""
    async with async_session_factory() as session:
        for tenant_data in TENANTS_DATA:
            # Create tenant
            tenant = Tenant(
                name=tenant_data["name"],
                slug=tenant_data["slug"],
                bio=tenant_data["bio"],
                social_links=tenant_data["social_links"],
            )
            session.add(tenant)
            await session.flush()

            # Create owner user
            user = User(
                tenant_id=tenant.id,
                email=tenant_data["email"],
                password_hash=hash_password("password123"),
                role="owner",
            )
            session.add(user)

            # Create theme
            theme = ThemeConfig(tenant_id=tenant.id, **tenant_data["theme"])
            session.add(theme)

            # Create links
            links = []
            for i, link_data in enumerate(tenant_data["links"]):
                link = Link(
                    tenant_id=tenant.id,
                    title=link_data["title"],
                    url=link_data["url"],
                    icon=link_data["icon"],
                    position=i,
                    is_active=True,
                )
                session.add(link)
                links.append(link)

            await session.flush()

            # Generate click events (last 30 days)
            now = datetime.now(timezone.utc)
            for link in links:
                num_clicks = random.randint(15, 200)
                for _ in range(num_clicks):
                    click = ClickEvent(
                        tenant_id=tenant.id,
                        link_id=link.id,
                        referrer=random.choice(REFERRERS),
                        user_agent="Mozilla/5.0 (mock)",
                        country=random.choice(COUNTRIES),
                        clicked_at=now - timedelta(
                            days=random.randint(0, 30),
                            hours=random.randint(0, 23),
                            minutes=random.randint(0, 59),
                        ),
                    )
                    session.add(click)

            print(f"  ✓ Tenant '{tenant_data['slug']}' seeded with {len(links)} links")

        await session.commit()
        print("\n✅ Database seeded successfully!")


if __name__ == "__main__":
    asyncio.run(seed())
