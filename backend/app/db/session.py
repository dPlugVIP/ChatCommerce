from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import Settings, get_settings


def make_session_factory(settings: Settings) -> async_sessionmaker[AsyncSession]:
    database_url = settings.effective_database_url
    if not database_url:
        raise RuntimeError("Database URL is not configured.")

    engine = create_async_engine(database_url, pool_pre_ping=True)
    return async_sessionmaker(engine, expire_on_commit=False)


async def get_db_session() -> AsyncIterator[AsyncSession]:
    session_factory = make_session_factory(get_settings())
    async with session_factory() as session:
        yield session
