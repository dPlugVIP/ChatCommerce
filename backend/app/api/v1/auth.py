from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.schemas import AuthInput, AuthResult, RegisterInput, UserView
from app.core.config import Settings, get_settings
from app.core.security import (
    bearer,
    create_session,
    get_current_user,
    hash_password,
    revoke_session,
    verify_password,
)
from app.db.models import User
from app.db.session import get_db_session

router = APIRouter(prefix="/auth", tags=["auth"])


def view(user: User) -> UserView:
    return UserView(id=user.id, name=user.display_name, email=user.email, role=user.role)


@router.post("/register", response_model=AuthResult, status_code=status.HTTP_201_CREATED)
async def register(
    payload: RegisterInput,
    db: AsyncSession = Depends(get_db_session),
    settings: Settings = Depends(get_settings),
) -> AuthResult:
    email = payload.email.lower().strip()
    if await db.scalar(select(User.id).where(User.email == email)):
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")
    user = User(
        email=email,
        display_name=payload.name.strip(),
        password_hash=hash_password(payload.password),
        role="customer",
    )
    db.add(user)
    await db.flush()
    token = await create_session(db, user, settings)
    return AuthResult(token=token, user=view(user))


@router.post("/login", response_model=AuthResult)
async def login(
    payload: AuthInput,
    db: AsyncSession = Depends(get_db_session),
    settings: Settings = Depends(get_settings),
) -> AuthResult:
    user = await db.scalar(select(User).where(User.email == payload.email.lower().strip()))
    if not user or not user.is_active or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    token = await create_session(db, user, settings)
    return AuthResult(token=token, user=view(user))


@router.get("/session", response_model=UserView)
async def session(user: User = Depends(get_current_user)) -> UserView:
    return view(user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: AsyncSession = Depends(get_db_session),
    settings: Settings = Depends(get_settings),
) -> None:
    if credentials:
        await revoke_session(credentials.credentials, db, settings)
