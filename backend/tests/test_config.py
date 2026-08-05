import pytest
from pydantic import ValidationError

from app.core.config import Settings


def test_production_requires_runtime_secrets() -> None:
    with pytest.raises(ValidationError, match="Missing production settings"):
        Settings(app_env="production")


def test_test_environment_rejects_unsafe_resources() -> None:
    with pytest.raises(ValidationError, match="Unsafe test resource settings"):
        Settings(app_env="test", test_database_url="postgresql+asyncpg://db/prod")


def test_test_environment_accepts_test_resources() -> None:
    settings = Settings(
        app_env="test",
        test_database_url="postgresql+asyncpg://db/chatcommerce_test",
        test_redis_url="redis://localhost:6379/15",
    )

    assert settings.effective_database_url == "postgresql+asyncpg://db/chatcommerce_test"
    assert settings.effective_redis_url == "redis://localhost:6379/15"
