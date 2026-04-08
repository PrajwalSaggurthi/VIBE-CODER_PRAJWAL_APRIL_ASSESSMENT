# 🔗 LinkHub — Multi-Tenant "Link in Bio" Platform

> A production-grade, white-label "Link in Bio" platform (similar to Linktree/Carrd) with **true multi-tenant isolation** via PostgreSQL Row-Level Security.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![FastAPI](https://img.shields.io/badge/FastAPI-0.135-009688?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Python](https://img.shields.io/badge/Python-3.10-3776ab?logo=python)

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Database Setup](#2-database-setup)
  - [3. Backend Setup](#3-backend-setup)
  - [4. Frontend Setup](#4-frontend-setup)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Seeding Mock Data](#-seeding-mock-data)
- [Multi-Tenant Isolation](#-multi-tenant-isolation)
- [Theming Engine](#-theming-engine)
- [Deployment](#-deployment)
- [Docker (Local Development)](#-docker-local-development)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Platform
- **Multi-Tenant Architecture** — Each tenant gets a unique slug/subdomain with fully isolated data
- **Row-Level Security (RLS)** — PostgreSQL enforces tenant isolation at the database level, not just application logic
- **JWT Authentication** — Tenant-scoped tokens with access/refresh token rotation
- **IDOR Protection** — Users cannot access other tenants' resources via ID manipulation

### Tenant Dashboard
- **Link Management** — Full CRUD with drag-and-drop reordering via `@dnd-kit`
- **Theme Customization** — Dynamic CSS variable injection for colors, fonts, button styles, and background patterns
- **Profile Settings** — Name, bio, avatar, and social links
- **Analytics Dashboard** — Interactive charts (Recharts) showing click heatmaps, link rankings, and traffic sources

### Public Profiles
- **Dynamic Theming** — 3 built-in presets (Minimal, Vibrant, Neon) + full custom theme support
- **Subdomain Routing** — `tenant.yourdomain.com` → `/site/[slug]` rewriting via Next.js middleware
- **Mobile-First Design** — Responsive, thumb-friendly tap targets
- **Click Tracking** — Every link click is recorded for analytics

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Vercel Edge / Dev                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Next.js Middleware (subdomain → path rewriting)     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ Landing Page │   │ Tenant Dashboard │   │  Public Profile  │
│     (/)      │   │  (/dashboard/*)  │   │  (/site/[slug])  │
└──────────────┘   └────────┬─────────┘   └────────┬─────────┘
                            │                      │
                            ▼                      ▼
                   ┌─────────────────────────────────────────┐
                   │         FastAPI Backend (API v1)        │
                   │  • Auth (JWT + tenant scoping)          │
                   │  • Links CRUD + reorder                 │
                   │  • Theme config                         │
                   │  • Analytics (click recording + agg)    │
                   │  • RLS Middleware (SET LOCAL per req)    │
                   └────────────────┬────────────────────────┘
                                    │
                                    ▼
                   ┌─────────────────────────────────────────┐
                   │     PostgreSQL 15+ (Neon Serverless)    │
                   │  • Row-Level Security (RLS) policies    │
                   │  • Tenant isolation at query level      │
                   │  • Alembic migrations                   │
                   └─────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16 (App Router) + TypeScript | SSR for public profiles, RSC for dashboard |
| **Backend** | FastAPI (Python 3.10) | Async API, auto-generated OpenAPI docs |
| **Database** | PostgreSQL 15+ (Neon) | RLS for multi-tenant isolation |
| **Auth** | Custom JWT (`python-jose` + `passlib`) | Tenant-scoped access/refresh tokens |
| **ORM** | SQLAlchemy 2.0 (async) | Async database access |
| **Migrations** | Alembic | Schema versioning & RLS policy management |
| **Drag & Drop** | `@dnd-kit/core` + `@dnd-kit/sortable` | Accessible, performant link reordering |
| **Charts** | Recharts | Analytics visualization |
| **Styling** | CSS Modules + CSS Variables | Dynamic tenant theming |
| **Deployment** | Vercel (monorepo) | Frontend (Next.js) + Backend (Serverless Python) |

---

## 📂 Repository Structure

```
VIBE-CODER_PRAJWAL_APRIL_ASSESSMENT/
├── Frontend/                          # Next.js 16 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx               # Landing page
│   │   │   ├── login/page.tsx         # Login page
│   │   │   ├── register/page.tsx      # Registration page
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx           # Link management (CRUD + D&D)
│   │   │   │   ├── layout.tsx         # Dashboard shell + sidebar
│   │   │   │   ├── analytics/page.tsx # Analytics charts
│   │   │   │   ├── appearance/page.tsx# Theme customization
│   │   │   │   └── settings/page.tsx  # Profile settings
│   │   │   └── site/[slug]/page.tsx   # Public tenant profile
│   │   ├── components/
│   │   │   ├── ui/                    # Reusable primitives (Button, Card, Input, Modal, etc.)
│   │   │   ├── dashboard/            # LinkCard, LinkEditor, StatsCard
│   │   │   └── shared/               # EmptyState
│   │   ├── hooks/                     # useAuth, useLinks, useAnalytics
│   │   ├── lib/                       # API client, auth helpers, constants, utils
│   │   ├── types/                     # TypeScript type definitions
│   │   └── middleware.ts              # Subdomain → path rewriting
│   ├── package.json
│   └── .env.local                     # Frontend environment variables
│
├── Backend/                           # FastAPI (Python 3.10)
│   ├── api/
│   │   └── index.py                   # Vercel serverless entry point
│   ├── app/
│   │   ├── main.py                    # FastAPI app factory + router mounting
│   │   ├── config.py                  # Pydantic settings (env-driven)
│   │   ├── database.py                # Async SQLAlchemy engine + RLS helper
│   │   ├── dependencies.py            # Shared FastAPI dependencies
│   │   ├── routers/                   # API route handlers
│   │   │   ├── auth.py                # POST /register, /login, /refresh
│   │   │   ├── tenants.py             # GET/PUT /tenant
│   │   │   ├── links.py               # CRUD + reorder
│   │   │   ├── analytics.py           # Click recording + aggregation
│   │   │   ├── themes.py              # GET/PUT theme config
│   │   │   └── public.py              # GET /public/{slug} (unauthenticated)
│   │   ├── models/                    # SQLAlchemy ORM models
│   │   │   ├── tenant.py              # Tenant
│   │   │   ├── user.py                # User (belongs to tenant)
│   │   │   ├── link.py                # Link
│   │   │   ├── theme.py               # ThemeConfig (1:1 with tenant)
│   │   │   └── click_event.py         # ClickEvent
│   │   ├── schemas/                   # Pydantic request/response schemas
│   │   ├── security/                  # JWT, password hashing, IDOR guards
│   │   ├── middleware/                # Tenant context (SET LOCAL)
│   │   └── utils/
│   │       └── seed.py                # Mock data generator (3 tenants)
│   ├── migrations/                    # Alembic migrations
│   │   ├── env.py                     # Async Alembic environment
│   │   └── versions/
│   │       ├── 0e04f23ba55f_initial_schema.py
│   │       └── 0002_rls_policies.py
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env                           # Backend environment variables
│
├── vercel.json                        # Vercel monorepo routing config
├── docker-compose.yml                 # Local PostgreSQL dev server
├── .gitignore
├── challenge.txt                      # Original challenge specification
├── implementation_plan.md             # Detailed implementation plan
└── FILESYSTEM.md                      # File structure tracker
```

---

## 📦 Prerequisites

| Tool | Version | Installation |
|------|---------|-------------|
| **Node.js** | >= 18.x | [nodejs.org](https://nodejs.org/) |
| **npm** | >= 9.x | Bundled with Node.js |
| **Python** | 3.10+ | [python.org](https://python.org/) |
| **PostgreSQL** | 15+ | [Via Docker](#-docker-local-development) or [Neon](https://neon.tech/) |
| **Docker** *(optional)* | 20.x+ | [docker.com](https://docker.com/) — for local PostgreSQL |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/PrajwalSaggurthi/VIBE-CODER_PRAJWAL_APRIL_ASSESSMENT.git
cd VIBE-CODER_PRAJWAL_APRIL_ASSESSMENT
```

### 2. Database Setup

You have two options for PostgreSQL:

#### Option A: Neon (Cloud — Recommended)

1. Sign up at [neon.tech](https://neon.tech/) (free tier available)
2. Create a new project and database
3. Copy the connection string (use the `?ssl=require` variant)
4. Add it to `Backend/.env` as `DATABASE_URL`

#### Option B: Docker (Local)

```bash
# Start PostgreSQL in a container
docker-compose up -d

# Verify it's running
docker ps
# Should show: linkhub-postgres on port 5432
```

Default connection string for Docker:
```
postgresql+asyncpg://linkhub:linkhub_dev_password@localhost:5432/linkhub
```

### 3. Backend Setup

```bash
# Navigate to backend
cd Backend

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate          # macOS / Linux
# venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment variables (see "Environment Variables" section below)
# Edit Backend/.env with your database URL and JWT secret

# Run database migrations
alembic upgrade head

# Seed mock data (3 tenants with links + analytics)
python -m app.utils.seed

# Start the API server
uvicorn app.main:app --reload --port 8000
```

The API will be available at **http://localhost:8000**
- Swagger docs: http://localhost:8000/api/v1/docs
- OpenAPI JSON: http://localhost:8000/api/v1/openapi.json
- Health check: http://localhost:8000/api/v1/health

### 4. Frontend Setup

Open a **new terminal**:

```bash
# Navigate to frontend
cd Frontend

# Install dependencies
npm install

# Configure environment variables
# Edit Frontend/.env.local with your API URL if needed

# Start the dev server
npm run dev
```

The frontend will be available at **http://localhost:3000**

### Quick Verification

Once both servers are running:

1. Visit **http://localhost:3000** — Landing page
2. Visit **http://localhost:3000/register** — Create an account
3. Visit **http://localhost:3000/login** — Log in
4. Visit **http://localhost:3000/dashboard** — Manage links
5. Visit **http://localhost:3000/site/prajwal** — Public profile (seeded)
6. Visit **http://localhost:3000/site/luna-studio** — Vibrant theme
7. Visit **http://localhost:3000/site/neonbyte** — Neon theme

---

## 🔐 Environment Variables

### Backend (`Backend/.env`)

```env
# ── Database ──────────────────────────────
# For Docker (local):
# DATABASE_URL=postgresql+asyncpg://linkhub:linkhub_dev_password@localhost:5432/linkhub
# For Neon (cloud):
DATABASE_URL=postgresql+asyncpg://<user>:<password>@<host>/<database>?ssl=require

# ── JWT ───────────────────────────────────
JWT_SECRET_KEY=your-secret-key-here       # CHANGE in production!
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# ── App ───────────────────────────────────
APP_ENV=development
APP_DEBUG=true
CORS_ORIGINS=http://localhost:3000        # Comma-separated for multiple
```

### Frontend (`Frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🗄 Database Schema

The database uses **5 tables** with foreign key constraints that respect tenant boundaries:

```
┌──────────────┐
│   TENANTS    │──────────────────────────────────────────┐
│──────────────│                                          │
│ id (PK, UUID)│     ┌──────────────┐                    │
│ slug (UNIQUE)│────▶│    USERS     │                    │
│ name         │     │──────────────│                    │
│ bio          │     │ id (PK)      │                    │
│ avatar_url   │     │ tenant_id(FK)│                    │
│ social_links │     │ email(UNIQUE)│                    │
│ created_at   │     │ password_hash│                    │
│ updated_at   │     │ role         │                    │
└──────────────┘     │ created_at   │                    │
       │             └──────────────┘                    │
       │                                                  │
       ├─────────────┐            ┌──────────────────────┘
       ▼             ▼            ▼
┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐
│    LINKS     │  │  THEME_CONFIGS   │  │  CLICK_EVENTS    │
│──────────────│  │──────────────────│  │──────────────────│
│ id (PK)      │  │ id (PK)          │  │ id (PK)          │
│ tenant_id(FK)│  │ tenant_id(FK,UQ) │  │ tenant_id (FK)   │
│ title        │  │ preset_name      │  │ link_id (FK)     │
│ url          │  │ primary_color    │  │ referrer         │
│ icon         │  │ secondary_color  │  │ user_agent       │
│ position     │  │ bg_color         │  │ country          │
│ is_active    │  │ text_color       │  │ clicked_at       │
│ created_at   │  │ font_family      │  └──────────────────┘
│ updated_at   │  │ button_style     │
└──────────────┘  │ bg_pattern       │
                  │ bg_image_url     │
                  │ custom_css       │
                  │ updated_at       │
                  └──────────────────┘
```

### Migration Files

| Migration | Description |
|-----------|-------------|
| `0e04f23ba55f_initial_schema.py` | Creates all 5 tables with indexes and constraints |
| `0002_rls_policies.py` | Enables RLS + creates `tenant_isolation_policy` on all tenant-scoped tables |

### Running Migrations

```bash
cd Backend
source venv/bin/activate

# Apply all migrations
alembic upgrade head

# Check current migration state
alembic current

# Create a new migration after model changes
alembic revision --autogenerate -m "description of changes"

# Rollback one migration
alembic downgrade -1
```

---

## 📡 API Documentation

Base URL: `http://localhost:8000/api/v1`

> **Interactive docs**: Visit http://localhost:8000/api/v1/docs for the full Swagger UI.

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Create tenant + owner user | Public |
| `POST` | `/auth/login` | Issue JWT with tenant_id claim | Public |
| `POST` | `/auth/refresh` | Refresh access token | Bearer |

### Tenant Profile

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/tenant` | Get current tenant profile | Bearer |
| `PUT` | `/tenant` | Update tenant profile | Bearer |

### Links

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/links` | List all links (ordered by position) | Bearer |
| `POST` | `/links` | Create a new link | Bearer |
| `PUT` | `/links/{id}` | Update a link | Bearer |
| `DELETE` | `/links/{id}` | Delete a link | Bearer |
| `PUT` | `/links/reorder` | Batch update link positions | Bearer |

### Analytics

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/analytics/click` | Record a click event | Public |
| `GET` | `/analytics/overview` | Total clicks, top links | Bearer |
| `GET` | `/analytics/heatmap` | 24-hour click distribution | Bearer |
| `GET` | `/analytics/sources` | Referrer breakdown | Bearer |

### Theme

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/theme` | Get current theme config | Bearer |
| `PUT` | `/theme` | Update theme config | Bearer |
| `GET` | `/theme/presets` | List available presets | Public |

### Public

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/public/{slug}` | Get public profile + links + theme | Public |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |

---

## 🌱 Seeding Mock Data

The seed script creates **3 distinct tenants** with links, themes, and realistic click analytics data:

| Tenant | Slug | Theme | Email | Password |
|--------|------|-------|-------|----------|
| Prajwal Saggurthi | `prajwal` | Minimal (black/white) | prajwalsaggurthi1@gmail.com | `password123` |
| Luna Creative Studio | `luna-studio` | Vibrant (gradient) | hello@lunastudio.io | `password123` |
| NeonByte Gaming | `neonbyte` | Neon (dark/cyan) | neon@bytegaming.gg | `password123` |

```bash
cd Backend
source venv/bin/activate
python -m app.utils.seed
```

Each tenant receives:
- An owner user account
- 3–5 themed links
- 15–200 click events per link (randomized over the last 30 days)
- A distinct theme preset configuration

---

## 🔒 Multi-Tenant Isolation

LinkHub implements **defense-in-depth** multi-tenant security:

### 1. JWT Tenant Scoping
Every JWT access token includes a `tenant_id` claim. The backend extracts this claim and uses it to scope all database queries.

### 2. RLS Middleware
On every authenticated request, the backend executes:
```sql
SET LOCAL app.current_tenant = '<tenant_id>';
```
This sets a session-level parameter that PostgreSQL RLS policies reference.

### 3. Row-Level Security (RLS)
All tenant-scoped tables (`users`, `links`, `theme_configs`, `click_events`) have:
```sql
ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;
ALTER TABLE <table> FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON <table>
    USING (tenant_id::text = current_setting('app.current_tenant', true))
    WITH CHECK (tenant_id::text = current_setting('app.current_tenant', true));
```

### 4. IDOR Protection
Application-level guards verify that requested resource IDs belong to the authenticated tenant before performing any operation.

---

## 🎨 Theming Engine

The theming system uses **CSS custom properties** injected dynamically from the API response:

### Built-in Presets

| Preset | Primary | Background | Style |
|--------|---------|-----------|-------|
| **Minimal** | `#1a1a2e` | `#ffffff` | Clean, professional |
| **Vibrant** | `#ff6b6b` | `#2d1b69` | Bold gradient |
| **Neon** | `#00f5d4` | `#0a0a0a` | Dark, glowing accents |

### Customizable Properties
- Primary & secondary colors
- Background & text colors
- Font family (Inter, Outfit, Space Grotesk, etc.)
- Button style (rounded, pill, square, outline)
- Background pattern (none, dots, waves, gradient)
- Background image URL
- Custom CSS overrides (JSON escape hatch)

---

## 🚢 Deployment

### Vercel (Recommended)

The project is configured as a **Vercel monorepo** with the Next.js frontend as the primary framework and the FastAPI backend as a Serverless Python function.

1. **Connect your repo** to Vercel
2. **Set environment variables** in the Vercel dashboard:
   - `DATABASE_URL` (Neon connection string)
   - `JWT_SECRET_KEY` (strong random secret)
   - `CORS_ORIGINS` (your production domain)
   - `NEXT_PUBLIC_API_URL` (your production API URL)
   - `NEXT_PUBLIC_APP_URL` (your production frontend URL)
3. **Deploy** — Vercel auto-detects the `vercel.json` config

#### `vercel.json` Configuration

```json
{
  "buildCommand": "cd Frontend && npm run build",
  "outputDirectory": "Frontend/.next",
  "installCommand": "cd Frontend && npm install",
  "framework": "nextjs",
  "rewrites": [
    { "source": "/api/v1/:path*", "destination": "/api/index" }
  ],
  "functions": {
    "api/index.py": {
      "runtime": "python3.10",
      "maxDuration": 30
    }
  }
}
```

### Custom Domain + Wildcard Subdomains

For `tenant.yourdomain.com` routing:
1. Add your custom domain in Vercel
2. Configure wildcard DNS: `*.yourdomain.com → CNAME → cname.vercel-dns.com`
3. Update `NEXT_PUBLIC_APP_URL` to your domain

> **Note**: Without a custom domain, tenant profiles are accessible via path-based routing: `yourdomain.vercel.app/site/[slug]`

---

## 🐳 Docker (Local Development)

The `docker-compose.yml` provides a local PostgreSQL instance for development:

```yaml
version: "3.9"

services:
  postgres:
    image: postgres:15-alpine
    container_name: linkhub-postgres
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: linkhub
      POSTGRES_PASSWORD: linkhub_dev_password
      POSTGRES_DB: linkhub
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U linkhub"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

### Commands

```bash
# Start PostgreSQL
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f postgres

# Stop and remove
docker-compose down

# Stop and remove with data volume
docker-compose down -v
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is built as part of an assessment challenge. All rights reserved.

---

## 👤 Author

**Prajwal Saggurthi**

- GitHub: [@PrajwalSaggurthi](https://github.com/PrajwalSaggurthi)
- LinkedIn: [prajwalsaggurthi](https://www.linkedin.com/in/prajwalsaggurthi/)
