from fastapi import APIRouter

from app.api.v1.admin import router as admin_router
from app.api.v1.auth import router as auth_router
from app.api.v1.business import admin_router as business_admin_router
from app.api.v1.business import public_router as business_public_router
from app.api.v1.catalog import router as catalog_router
from app.api.v1.conversations import router as conversations_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(business_public_router)
api_router.include_router(catalog_router)
api_router.include_router(conversations_router)
api_router.include_router(admin_router)
api_router.include_router(business_admin_router)
