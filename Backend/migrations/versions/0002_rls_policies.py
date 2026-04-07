"""Apply Row-Level Security policies for multi-tenant isolation.

Revision ID: 0002_rls_policies
Revises: 0e04f23ba55f
Create Date: 2026-04-07
"""
from typing import Sequence, Union
from alembic import op

revision: str = "0002_rls_policies"
down_revision: Union[str, None] = "0e04f23ba55f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Tables that need RLS (all tenant-scoped tables)
RLS_TABLES = ["users", "links", "theme_configs", "click_events"]


def upgrade() -> None:
    for table in RLS_TABLES:
        # Enable RLS
        op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")

        # Force RLS even for table owner
        op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")

        # Create tenant isolation policy
        op.execute(f"""
            CREATE POLICY tenant_isolation_policy ON {table}
            USING (tenant_id::text = current_setting('app.current_tenant', true))
            WITH CHECK (tenant_id::text = current_setting('app.current_tenant', true))
        """)

    # The 'tenants' table doesn't need RLS — it's queried by slug (public) or by id (from JWT)


def downgrade() -> None:
    for table in RLS_TABLES:
        op.execute(f"DROP POLICY IF EXISTS tenant_isolation_policy ON {table}")
        op.execute(f"ALTER TABLE {table} DISABLE ROW LEVEL SECURITY")
