"""Add persisted business branding settings.

Revision ID: 20260810_0002
Revises: 20260809_0001
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "20260810_0002"
down_revision: str | None = "20260809_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "business_settings",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("support_email", sa.String(length=320), nullable=False),
        sa.Column("primary_color", sa.String(length=7), nullable=False),
        sa.Column("logo_url", sa.Text(), nullable=True),
        sa.Column("logo_public_id", sa.String(length=255), nullable=True),
        sa.Column("brand_mark_url", sa.Text(), nullable=True),
        sa.Column("brand_mark_public_id", sa.String(length=255), nullable=True),
        sa.Column("favicon_url", sa.Text(), nullable=True),
        sa.Column("favicon_public_id", sa.String(length=255), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("business_settings")
