from dataclasses import dataclass

from app.core.config import Settings


@dataclass(frozen=True)
class CloudinaryConfig:
    cloud_name: str
    api_key: str
    api_secret: str


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
