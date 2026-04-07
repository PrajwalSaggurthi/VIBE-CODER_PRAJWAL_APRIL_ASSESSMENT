# LinkHub — Filesystem Structure

> **Last Updated**: 2026-04-07  
> **Status**: 🟡 Pre-Scaffolding  
> This document is a living tracker of every file and folder in the project. It is updated as we build.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| 📁 | Directory |
| 📄 | File |
| ✅ | Created |
| 🟡 | Planned (not yet created) |
| 🔧 | Modified from scaffold |

---

## Root

```
VIBE-CODER_PRAJWAL_APRIL_ASSESSMENT/
├── 📁 Frontend/                              🟡 Next.js 14 App Router
├── 📁 Backend/                               🟡 FastAPI (Python 3.10)
├── 📄 vercel.json                            🟡 Vercel monorepo config
├── 📄 docker-compose.yml                     🟡 Local dev PostgreSQL
├── 📄 .gitignore                             ✅ Git ignore rules
├── 📄 .env.example                           🟡 Root env template
├── 📄 README.md                              ✅ Project README
├── 📄 FILESYSTEM.md                          ✅ This file
├── 📄 challenge.txt                          ✅ Original challenge spec
└── 📄 placeholder.txt                        ✅ Placeholder
```

---

## Frontend/

```
Frontend/                                      🟡 NOT YET SCAFFOLDED
├── 📁 public/
│   ├── 📁 fonts/                             🟡 Self-hosted Inter, Outfit
│   ├── 📁 images/                            🟡 Static assets
│   └── 📄 favicon.ico                        🟡
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 (marketing)/                   🟡 Landing page route group
│   │   │   ├── 📄 page.tsx                   🟡
│   │   │   └── 📄 layout.tsx                 🟡
│   │   ├── 📁 (auth)/                        🟡 Auth route group
│   │   │   ├── 📁 login/
│   │   │   │   └── 📄 page.tsx               🟡
│   │   │   ├── 📁 register/
│   │   │   │   └── 📄 page.tsx               🟡
│   │   │   └── 📄 layout.tsx                 🟡
│   │   ├── 📁 dashboard/                     🟡 Tenant dashboard
│   │   │   ├── 📄 page.tsx                   🟡 Link management
│   │   │   ├── 📁 analytics/
│   │   │   │   └── 📄 page.tsx               🟡
│   │   │   ├── 📁 settings/
│   │   │   │   └── 📄 page.tsx               🟡
│   │   │   ├── 📁 appearance/
│   │   │   │   └── 📄 page.tsx               🟡 Theme customization
│   │   │   └── 📄 layout.tsx                 🟡 Dashboard shell
│   │   ├── 📁 site/
│   │   │   └── 📁 [slug]/
│   │   │       └── 📄 page.tsx               🟡 Public tenant profile
│   │   ├── 📄 layout.tsx                     🟡 Root layout
│   │   ├── 📄 globals.css                    🟡 Global styles
│   │   └── 📄 not-found.tsx                  🟡
│   ├── 📁 components/
│   │   ├── 📁 ui/                            🟡 UI primitives
│   │   │   ├── 📄 Button.tsx                 🟡
│   │   │   ├── 📄 Card.tsx                   🟡
│   │   │   ├── 📄 Input.tsx                  🟡
│   │   │   ├── 📄 Modal.tsx                  🟡
│   │   │   ├── 📄 Avatar.tsx                 🟡
│   │   │   ├── 📄 Badge.tsx                  🟡
│   │   │   ├── 📄 Skeleton.tsx               🟡
│   │   │   └── 📄 Toast.tsx                  🟡
│   │   ├── 📁 dashboard/                     🟡
│   │   │   ├── 📄 Sidebar.tsx                🟡
│   │   │   ├── 📄 LinkCard.tsx               🟡
│   │   │   ├── 📄 LinkEditor.tsx             🟡
│   │   │   ├── 📄 LinkList.tsx               🟡
│   │   │   ├── 📄 ThemePreview.tsx           🟡
│   │   │   ├── 📄 ThemeControls.tsx          🟡
│   │   │   └── 📄 StatsCard.tsx              🟡
│   │   ├── 📁 analytics/                     🟡
│   │   │   ├── 📄 ClickHeatmap.tsx           🟡
│   │   │   ├── 📄 LinkRanking.tsx            🟡
│   │   │   ├── 📄 TrafficSources.tsx         🟡
│   │   │   └── 📄 DateRangePicker.tsx        🟡
│   │   ├── 📁 profile/                       🟡 Public profile components
│   │   │   ├── 📄 ProfileHeader.tsx          🟡
│   │   │   ├── 📄 LinkButton.tsx             🟡
│   │   │   ├── 📄 SocialIcons.tsx            🟡
│   │   │   └── 📄 ProfileFooter.tsx          🟡
│   │   └── 📁 shared/                        🟡
│   │       ├── 📄 Navbar.tsx                 🟡
│   │       ├── 📄 Footer.tsx                 🟡
│   │       └── 📄 EmptyState.tsx             🟡
│   ├── 📁 hooks/                             🟡
│   │   ├── 📄 useAuth.ts                     🟡
│   │   ├── 📄 useLinks.ts                    🟡
│   │   ├── 📄 useTheme.ts                    🟡
│   │   ├── 📄 useAnalytics.ts                🟡
│   │   └── 📄 useDragAndDrop.ts              🟡
│   ├── 📁 lib/                               🟡
│   │   ├── 📄 api.ts                         🟡 API client
│   │   ├── 📄 auth.ts                        🟡 JWT utilities
│   │   ├── 📄 constants.ts                   🟡
│   │   ├── 📄 utils.ts                       🟡
│   │   └── 📄 themes.ts                      🟡 Preset themes
│   ├── 📁 types/                             🟡
│   │   ├── 📄 api.ts                         🟡
│   │   ├── 📄 tenant.ts                      🟡
│   │   ├── 📄 link.ts                        🟡
│   │   ├── 📄 analytics.ts                   🟡
│   │   └── 📄 theme.ts                       🟡
│   ├── 📁 styles/                            🟡
│   │   ├── 📄 variables.css                  🟡 Design tokens
│   │   ├── 📄 animations.css                 🟡 Keyframes
│   │   └── 📁 themes/                        🟡
│   │       ├── 📄 minimal.css                🟡
│   │       ├── 📄 vibrant.css                🟡
│   │       └── 📄 neon.css                   🟡
│   └── 📄 middleware.ts                      🟡 Subdomain router
├── 📄 next.config.js                         🟡
├── 📄 tsconfig.json                          🟡
├── 📄 package.json                           🟡
└── 📄 .env.local.example                     🟡
```

---

## Backend/

```
Backend/                                       🟡 NOT YET SCAFFOLDED
├── 📁 api/
│   └── 📄 index.py                           🟡 Vercel serverless entry
├── 📁 app/
│   ├── 📄 __init__.py                        🟡
│   ├── 📄 main.py                            🟡 FastAPI app factory
│   ├── 📄 config.py                          🟡 Pydantic settings
│   ├── 📄 database.py                        🟡 Async SQLAlchemy
│   ├── 📄 dependencies.py                    🟡 Shared dependencies
│   ├── 📁 routers/
│   │   ├── 📄 __init__.py                    🟡
│   │   ├── 📄 auth.py                        🟡
│   │   ├── 📄 tenants.py                     🟡
│   │   ├── 📄 links.py                       🟡
│   │   ├── 📄 analytics.py                   🟡
│   │   ├── 📄 themes.py                      🟡
│   │   └── 📄 public.py                      🟡
│   ├── 📁 models/
│   │   ├── 📄 __init__.py                    🟡
│   │   ├── 📄 tenant.py                      🟡
│   │   ├── 📄 user.py                        🟡
│   │   ├── 📄 link.py                        🟡
│   │   ├── 📄 click_event.py                 🟡
│   │   └── 📄 theme.py                       🟡
│   ├── 📁 schemas/
│   │   ├── 📄 __init__.py                    🟡
│   │   ├── 📄 auth.py                        🟡
│   │   ├── 📄 tenant.py                      🟡
│   │   ├── 📄 link.py                        🟡
│   │   ├── 📄 analytics.py                   🟡
│   │   └── 📄 theme.py                       🟡
│   ├── 📁 services/
│   │   ├── 📄 __init__.py                    🟡
│   │   ├── 📄 auth_service.py                🟡
│   │   ├── 📄 tenant_service.py              🟡
│   │   ├── 📄 link_service.py                🟡
│   │   ├── 📄 analytics_service.py           🟡
│   │   └── 📄 theme_service.py               🟡
│   ├── 📁 middleware/
│   │   ├── 📄 __init__.py                    🟡
│   │   ├── 📄 tenant_context.py              🟡
│   │   └── 📄 cors.py                        🟡
│   ├── 📁 security/
│   │   ├── 📄 __init__.py                    🟡
│   │   ├── 📄 jwt.py                         🟡
│   │   ├── 📄 password.py                    🟡
│   │   └── 📄 permissions.py                 🟡
│   └── 📁 utils/
│       ├── 📄 __init__.py                    🟡
│       └── 📄 seed.py                        🟡 Mock data generator
├── 📁 migrations/
│   ├── 📄 env.py                             🟡
│   ├── 📁 versions/
│   │   └── 📄 001_initial_schema.py          🟡
│   └── 📄 script.py.mako                     🟡
├── 📁 tests/
│   ├── 📄 __init__.py                        🟡
│   ├── 📄 conftest.py                        🟡
│   ├── 📄 test_auth.py                       🟡
│   ├── 📄 test_links.py                      🟡
│   ├── 📄 test_tenant_isolation.py           🟡
│   └── 📄 test_analytics.py                  🟡
├── 📄 alembic.ini                            🟡
├── 📄 requirements.txt                       🟡
├── 📄 .env.example                           🟡
└── 📄 Dockerfile                             🟡
```

---

## Change Log

| Date | Phase | Action | Files Affected |
|------|-------|--------|----------------|
| 2026-04-07 | Pre | Created FILESYSTEM.md | `FILESYSTEM.md` |
| — | — | *Awaiting Phase 1 scaffolding* | — |
