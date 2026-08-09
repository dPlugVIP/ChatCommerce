import uuid
from dataclasses import dataclass
from io import BytesIO
from typing import Any

import cloudinary  # type: ignore[import-untyped]
import cloudinary.uploader  # type: ignore[import-untyped]
from cloudinary.exceptions import Error as CloudinaryError  # type: ignore[import-untyped]

from app.core.config import Settings


@dataclass(frozen=True)
class CloudinaryConfig:
    cloud_name: str
    api_key: str
    api_secret: str


@dataclass(frozen=True)
class UploadedImage:
    url: str
    public_id: str
    width: int | None
    height: int | None
    format: str | None


def get_cloudinary_config(settings: Settings) -> CloudinaryConfig | None:
    if not (
        settings.cloudinary_cloud_name
        and settings.cloudinary_api_key
        and settings.cloudinary_api_secret
    ):
        return None
    return CloudinaryConfig(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
    )


def upload_brand_image(data: bytes, filename: str, kind: str, settings: Settings) -> UploadedImage:
    config = get_cloudinary_config(settings)
    if not config:
        raise RuntimeError("Cloudinary is not configured")

    cloudinary.config(
        cloud_name=config.cloud_name,
        api_key=config.api_key,
        api_secret=config.api_secret,
        secure=True,
    )
    try:
        response: dict[str, Any] = cloudinary.uploader.upload(
            BytesIO(data),
            resource_type="image",
            folder="dplugvip/branding",
            public_id=f"{kind}-{uuid.uuid4().hex}",
            filename_override=filename,
            use_filename=False,
            unique_filename=True,
            overwrite=False,
        )
    except CloudinaryError as exc:
        raise RuntimeError("Brand asset upload failed") from exc
    return UploadedImage(
        url=str(response["secure_url"]),
        public_id=str(response["public_id"]),
        width=int(response["width"]) if response.get("width") else None,
        height=int(response["height"]) if response.get("height") else None,
        format=str(response["format"]) if response.get("format") else None,
    )
