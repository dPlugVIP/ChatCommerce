from redis.asyncio import Redis

from app.core.config import Settings


def make_redis_client(settings: Settings) -> Redis | None:
    redis_url = settings.effective_redis_url
    if not redis_url:
        return None
    return Redis.from_url(redis_url, decode_responses=True)
