# LinkHub — Filesystem Structure

> **Last Updated**: 2026-04-08  
> **Status**: 🟢 Active Development  
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
├── 📁 Frontend/                              ✅ Next.js 16 App Router
├── 📁 Backend/                               ✅ FastAPI (Python 3.10)
├── 📄 vercel.json                            ✅ Vercel monorepo config
├── 📄 docker-compose.yml                     ✅ Local dev PostgreSQL
├── 📄 .gitignore                             ✅ Git ignore rules
├── 📄 README.md                              ✅ Project README
├── 📄 FILESYSTEM.md                          ✅ This file
├── 📄 implementation_plan.md                 ✅ Detailed implementation plan
├── 📄 challenge.txt                          ✅ Original challenge spec
└── 📄 placeholder.txt                        ✅ Placeholder
```

---

## Frontend/

```
Frontend/                                      ✅ SCAFFOLDED
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📄 layout.tsx                     ✅ Root layout
│   │   ├── 📄 globals.css                    ✅ Global styles + CSS variables
│   │   ├── 📄 page.tsx                       ✅ Landing page
│   │   ├── 📄 landing.module.css             ✅ Landing page styles
│   │   ├── 📄 providers.tsx                  ✅ Client providers
│   │   ├── 📄 not-found.tsx                  ✅ 404 page
│   │   ├── 📁 login/
│   │   │   ├── 📄 page.tsx                   ✅ Login page
│   │   │   └── 📄 auth.module.css            ✅ Auth styles
│   │   ├── 📁 register/
│   │   │   ├── 📄 page.tsx                   ✅ Registration page
│   │   │   └── 📄 auth.module.css            ✅ Auth styles
│   │   ├── 📁 dashboard/
│   │   │   ├── 📄 page.tsx                   ✅ Link management (CRUD + D&D)
│   │   │   ├── 📄 page.module.css            ✅ Dashboard page styles
│   │   │   ├── 📄 layout.tsx                 ✅ Dashboard shell + sidebar
│   │   │   ├── 📄 dashboard.module.css       ✅ Dashboard layout styles
│   │   │   ├── 📁 analytics/
│   │   │   │   ├── 📄 page.tsx               ✅ Analytics charts
│   │   │   │   └── 📄 analytics.module.css   ✅
│   │   │   ├── 📁 appearance/
│   │   │   │   ├── 📄 page.tsx               ✅ Theme customization
│   │   │   │   └── 📄 appearance.module.css  ✅
│   │   │   └── 📁 settings/
│   │   │       ├── 📄 page.tsx               ✅ Profile settings
│   │   │       └── 📄 settings.module.css    ✅
│   │   └── 📁 site/
│   │       └── 📁 [slug]/
│   │           ├── 📄 page.tsx               ✅ Public tenant profile (SSR)
│   │           ├── 📄 ProfileView.tsx        ✅ Client-side profile view
│   │           └── 📄 profile.module.css     ✅ Profile styles
│   ├── 📁 components/
│   │   ├── 📁 ui/                            ✅ UI primitives
│   │   │   ├── 📄 Avatar.tsx                 ✅
│   │   │   ├── 📄 Avatar.module.css          ✅
│   │   │   ├── 📄 Badge.tsx                  ✅
│   │   │   ├── 📄 Badge.module.css           ✅
│   │   │   ├── 📄 Button.tsx                 ✅
│   │   │   ├── 📄 Button.module.css          ✅
│   │   │   ├── 📄 Card.tsx                   ✅
│   │   │   ├── 📄 Card.module.css            ✅
│   │   │   ├── 📄 Input.tsx                  ✅
│   │   │   ├── 📄 Input.module.css           ✅
│   │   │   ├── 📄 Modal.tsx                  ✅
│   │   │   ├── 📄 Modal.module.css           ✅
│   │   │   ├── 📄 Skeleton.tsx               ✅
│   │   │   └── 📄 Skeleton.module.css        ✅
│   │   ├── 📁 dashboard/                     ✅
│   │   │   ├── 📄 LinkCard.tsx               ✅
│   │   │   ├── 📄 LinkCard.module.css        ✅
│   │   │   ├── 📄 LinkEditor.tsx             ✅
│   │   │   ├── 📄 LinkEditor.module.css      ✅
│   │   │   ├── 📄 StatsCard.tsx              ✅
│   │   │   └── 📄 StatsCard.module.css       ✅
│   │   └── 📁 shared/                        ✅
│   │       ├── 📄 EmptyState.tsx             ✅
│   │       └── 📄 EmptyState.module.css      ✅
│   ├── 📁 hooks/                             ✅
│   │   ├── 📄 useAuth.tsx                    ✅
│   │   ├── 📄 useLinks.ts                    ✅
│   │   └── 📄 useAnalytics.ts                ✅
│   ├── 📁 lib/                               ✅
│   │   ├── 📄 api.ts                         ✅ API client (fetch wrapper)
│   │   ├── 📄 auth.ts                        ✅ JWT utilities
│   │   ├── 📄 constants.ts                   ✅ App constants
│   │   └── 📄 utils.ts                       ✅ Utility functions
│   ├── 📁 types/                             ✅
│   │   ├── 📄 api.ts                         ✅
│   │   ├── 📄 analytics.ts                   ✅
│   │   ├── 📄 link.ts                        ✅
│   │   ├── 📄 tenant.ts                      ✅
│   │   └── 📄 theme.ts                       ✅
│   └── 📄 middleware.ts                      ✅ Subdomain router
├── 📄 next.config.ts                         ✅
├── 📄 tsconfig.json                          ✅
├── 📄 package.json                           ✅
├── 📄 eslint.config.mjs                      ✅
└── 📄 .env.local                             ✅ Frontend environment variables
```

---

## Backend/

```
Backend/                                       ✅ SCAFFOLDED
├── 📁 api/
│   └── 📄 index.py                           ✅ Vercel serverless entry
├── 📁 app/
│   ├── 📄 __init__.py                        ✅
│   ├── 📄 main.py                            ✅ FastAPI app factory
│   ├── 📄 config.py                          ✅ Pydantic settings
│   ├── 📄 database.py                        ✅ Async SQLAlchemy + RLS
│   ├── 📄 dependencies.py                    ✅ Shared dependencies
│   ├── 📁 routers/
│   │   ├── 📄 __init__.py                    ✅
│   │   ├── 📄 auth.py                        ✅ Register, login, refresh
│   │   ├── 📄 tenants.py                     ✅ GET/PUT tenant profile
│   │   ├── 📄 links.py                       ✅ CRUD + reorder
│   │   ├── 📄 analytics.py                   ✅ Click recording + aggregation
│   │   ├── 📄 themes.py                      ✅ GET/PUT theme config
│   │   └── 📄 public.py                      ✅ Public profile endpoint
│   ├── 📁 models/
│   │   ├── 📄 __init__.py                    ✅
│   │   ├── 📄 tenant.py                      ✅ Tenant model
│   │   ├── 📄 user.py                        ✅ User model
│   │   ├── 📄 link.py                        ✅ Link model
│   │   ├── 📄 click_event.py                 ✅ ClickEvent model
│   │   └── 📄 theme.py                       ✅ ThemeConfig model
│   ├── 📁 schemas/
│   │   ├── 📄 __init__.py                    ✅
│   │   ├── 📄 auth.py                        ✅
│   │   ├── 📄 tenant.py                      ✅
│   │   ├── 📄 link.py                        ✅
│   │   ├── 📄 analytics.py                   ✅
│   │   └── 📄 theme.py                       ✅
│   ├── 📁 services/
│   │   └── 📄 __init__.py                    ✅
│   ├── 📁 security/
│   │   ├── 📄 __init__.py                    ✅
│   │   ├── 📄 jwt.py                         ✅ JWT encode/decode
│   │   ├── 📄 password.py                    ✅ bcrypt hashing
│   │   └── 📄 permissions.py                 ✅ IDOR protection
│   ├── 📁 middleware/
│   │   ├── 📄 __init__.py                    ✅
│   │   └── 📄 tenant_context.py              ✅ SET LOCAL per request
│   └── 📁 utils/
│       ├── 📄 __init__.py                    ✅
│       └── 📄 seed.py                        ✅ Mock data generator
├── 📁 migrations/
│   ├── 📄 env.py                             ✅ Async Alembic env
│   ├── 📄 script.py.mako                     ✅
│   └── 📁 versions/
│       ├── 📄 0e04f23ba55f_initial_schema.py ✅ Tables + indexes
│       └── 📄 0002_rls_policies.py           ✅ RLS policies
├── 📁 tests/
│   └── 📄 __init__.py                        ✅
├── 📄 alembic.ini                            ✅
├── 📄 requirements.txt                       ✅
└── 📄 .env                                   ✅ Backend environment variables
```

---

## Change Log

| Date | Phase | Action | Files Affected |
|------|-------|--------|----------------|
| 2026-04-07 | Pre | Created FILESYSTEM.md | `FILESYSTEM.md` |
| 2026-04-07 | 1 | Scaffolded monorepo (Frontend + Backend) | All |
| 2026-04-07 | 2 | Backend core: models, routers, schemas, security, migrations | `Backend/` |
| 2026-04-07 | 2 | Applied RLS policies + seeded mock data | `migrations/`, `seed.py` |
| 2026-04-07 | 3 | Frontend: auth, dashboard, components, hooks | `Frontend/src/` |
| 2026-04-07 | 4 | Public profiles, theming, appearance page | `site/[slug]/`, `appearance/` |
| 2026-04-07 | 4 | Landing page, login/register with back nav | `page.tsx`, `login/`, `register/` |
| 2026-04-08 | 6 | Comprehensive README, env docs, FILESYSTEM update | `README.md`, `FILESYSTEM.md` |
