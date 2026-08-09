import json
from functools import lru_cache
from typing import Annotated, Literal

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

AppEnv = Literal["development", "test", "production"]


def _is_safe_test_url(value: str) -> bool:
    normalized = value.lower()
    return "test" in normalized or normalized.endswith("/15")


class Settings(BaseSettings):
    app_env: AppEnv = "development"
    app_name: str = "ChatCommerce API"
    api_v1_prefix: str = "/api/v1"
    allowed_origins: Annotated[list[str], NoDecode] = Field(
        default_factory=lambda: ["http://localhost:3000"]
    )

    database_url: str | None = None
    redis_url: str | None = None
    test_database_url: str | None = None
    test_redis_url: str | None = None

    session_secret: str | None = None
    access_token_ttl_minutes: int = 60

    bootstrap_admin_email: str | None = None
    bootstrap_admin_password: str | None = None

    cloudinary_cloud_name: str | None = None
    cloudinary_api_key: str | None = None
    cloudinary_api_secret: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            raw = value.strip()
            if raw.startswith("[") and raw.endswith("]"):
                try:
                    parsed = json.loads(raw)
                except json.JSONDecodeError:
                    raw = raw[1:-1]
                else:
                    if isinstance(parsed, list):
                        return [str(origin).strip().rstrip("/") for origin in parsed if origin]

            return [
                origin.strip().strip("'\"").rstrip("/")
                for origin in raw.split(",")
                if origin.strip().strip("'\"")
            ]
        return value

    @field_validator("database_url", "test_database_url", mode="before")
    @classmethod
    def normalize_database_url(cls, value: str | None) -> str | None:
        if value and value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+asyncpg://", 1)
        return value

    @model_validator(mode="after")
    def validate_environment(self) -> "Settings":
        if self.app_env == "production":
            required = {
                "DATABASE_URL": self.database_url,
                "REDIS_URL": self.redis_url,
                "SESSION_SECRET": self.session_secret,
                "BOOTSTRAP_ADMIN_EMAIL": self.bootstrap_admin_email,
                "BOOTSTRAP_ADMIN_PASSWORD": self.bootstrap_admin_password,
                "CLOUDINARY_CLOUD_NAME": self.cloudinary_cloud_name,
                "CLOUDINARY_API_KEY": self.cloudinary_api_key,
                "CLOUDINARY_API_SECRET": self.cloudinary_api_secret,
            }
            missing = [name for name, value in required.items() if not value]
            if missing:
                raise ValueError(f"Missing production settings: {', '.join(missing)}")

        if self.app_env == "test":
            unsafe = [
                name
                for name, value in {
                    "TEST_DATABASE_URL": self.test_database_url,
                    "TEST_REDIS_URL": self.test_redis_url,
                }.items()
                if value and not _is_safe_test_url(value)
            ]
            if unsafe:
                raise ValueError(f"Unsafe test resource settings: {', '.join(unsafe)}")

        return self

    @property
    def effective_database_url(self) -> str | None:
        if self.app_env == "test":
            return self.test_database_url
        return self.database_url

    @property
    def effective_redis_url(self) -> str | None:
        if self.app_env == "test":
            return self.test_redis_url
        return self.redis_url


@lru_cache
def get_settings() -> Settings:
    return Settings()
