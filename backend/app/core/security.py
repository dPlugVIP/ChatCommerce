import hashlib
import hmac
import secrets
from datetime import UTC, datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pwdlib import PasswordHash
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import Settings, get_settings
from app.db.models import Session, User
from app.db.session import get_db_session

password_hash = PasswordHash.recommended()
bearer = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, encoded: str) -> bool:
    return password_hash.verify(password, encoded)


def token_digest(token: str, secret: str) -> str:
    return hmac.new(secret.encode(), token.encode(), hashlib.sha256).hexdigest()


async def create_session(db: AsyncSession, user: User, settings: Settings) -> str:
    if not settings.session_secret:
        raise RuntimeError("SESSION_SECRET is required")
    token = secrets.token_urlsafe(48)
    db.add(
        Session(
            user_id=user.id,
            token_hash=token_digest(token, settings.session_secret),
            expires_at=datetime.now(UTC) + timedelta(minutes=settings.access_token_ttl_minutes),
        )
    )
    await db.commit()
    return token


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: AsyncSession = Depends(get_db_session),
    settings: Settings = Depends(get_settings),
) -> User:
    if not credentials or not settings.session_secret:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    digest = token_digest(credentials.credentials, settings.session_secret)
    session = (
        await db.scalars(
            select(Session)
            .options(selectinload(Session.user))
            .where(Session.token_hash == digest, Session.revoked_at.is_(None))
        )
    ).first()
    if not session:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    user = session.user
    if session.expires_at <= datetime.now(UTC) or not user.is_active:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Session expired")
    return user


async def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Admin access required")
    return user


async def require_customer(user: User = Depends(get_current_user)) -> User:
    if user.role != "customer":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Customer access required")
    return user


async def revoke_session(
    token: str,
    db: AsyncSession,
    settings: Settings,
) -> None:
    if not settings.session_secret:
        return
    result = await db.execute(
        select(Session).where(Session.token_hash == token_digest(token, settings.session_secret))
    )
    session = result.scalar_one_or_none()
    if session:
        session.revoked_at = datetime.now(UTC)
        await db.commit()
