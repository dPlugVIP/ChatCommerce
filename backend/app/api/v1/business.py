from typing import Annotated, Literal

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.concurrency import run_in_threadpool

from app.api.v1.schemas import (
    BrandAssetView,
    BusinessSettingsInput,
    BusinessSettingsView,
)
from app.core.config import Settings, get_settings
from app.core.security import require_admin
from app.db.models import BusinessSettings
from app.db.session import get_db_session
from app.integrations.cloudinary import upload_brand_image

public_router = APIRouter(tags=["business-settings"])
admin_router = APIRouter(
    prefix="/admin", tags=["admin-settings"], dependencies=[Depends(require_admin)]
)

MAX_BRAND_ASSET_BYTES = 4 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {"image/png", "image/jpeg", "image/webp", "image/x-icon"}


def settings_view(record: BusinessSettings) -> BusinessSettingsView:
    return BusinessSettingsView(
        name=record.name,
        support_email=record.support_email,
        primary_color=record.primary_color,
        logo_url=record.logo_url,
        logo_public_id=record.logo_public_id,
        brand_mark_url=record.brand_mark_url,
        brand_mark_public_id=record.brand_mark_public_id,
        favicon_url=record.favicon_url,
        favicon_public_id=record.favicon_public_id,
        updated_at=record.updated_at,
    )


async def load_settings(db: AsyncSession) -> BusinessSettings:
    record = (await db.scalars(select(BusinessSettings).limit(1))).first()
    if record:
        return record
    record = BusinessSettings()
    db.add(record)
    await db.commit()
    await db.refresh(record)
    return record


@public_router.get("/settings", response_model=BusinessSettingsView)
async def public_settings(db: AsyncSession = Depends(get_db_session)) -> BusinessSettingsView:
    return settings_view(await load_settings(db))


@admin_router.get("/settings", response_model=BusinessSettingsView)
async def admin_settings(db: AsyncSession = Depends(get_db_session)) -> BusinessSettingsView:
    return settings_view(await load_settings(db))


@admin_router.patch("/settings", response_model=BusinessSettingsView)
async def update_settings(
    payload: BusinessSettingsInput,
    db: AsyncSession = Depends(get_db_session),
) -> BusinessSettingsView:
    record = await load_settings(db)
    for field, value in payload.model_dump().items():
        setattr(record, field, value)
    await db.commit()
    await db.refresh(record)
    return settings_view(record)


@admin_router.post("/media/branding", response_model=BrandAssetView)
async def upload_branding(
    file: Annotated[UploadFile, File()],
    kind: Annotated[Literal["logo", "brand_mark", "favicon"], Form()],
    settings: Settings = Depends(get_settings),
) -> BrandAssetView:
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, "Unsupported image type")
    data = await file.read(MAX_BRAND_ASSET_BYTES + 1)
    if not data or len(data) > MAX_BRAND_ASSET_BYTES:
        raise HTTPException(
            status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, "Image must be 4MB or smaller"
        )
    try:
        uploaded = await run_in_threadpool(
            upload_brand_image,
            data,
            file.filename or f"{kind}.png",
            kind,
            settings,
        )
    except RuntimeError as exc:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, str(exc)) from exc
    return BrandAssetView(kind=kind, **uploaded.__dict__)
