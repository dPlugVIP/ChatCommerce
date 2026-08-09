from collections.abc import AsyncIterator
from functools import lru_cache

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import Settings, get_settings


@lru_cache
def _make_engine(database_url: str) -> AsyncEngine:
    return create_async_engine(database_url, pool_pre_ping=True)


def make_engine(settings: Settings) -> AsyncEngine:
    database_url = settings.effective_database_url
    if not database_url:
        raise RuntimeError("Database URL is not configured.")
    return _make_engine(database_url)


def make_session_factory(settings: Settings) -> async_sessionmaker[AsyncSession]:
    return async_sessionmaker(make_engine(settings), expire_on_commit=False)


async def get_db_session() -> AsyncIterator[AsyncSession]:
    session_factory = make_session_factory(get_settings())
    async with session_factory() as session:
        yield session
