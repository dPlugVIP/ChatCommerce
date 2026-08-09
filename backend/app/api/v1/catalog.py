from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.v1.schemas import CategoryView, ProductView
from app.core.security import get_current_user
from app.db.models import Category, Product
from app.db.session import get_db_session

router = APIRouter(tags=["catalog"], dependencies=[Depends(get_current_user)])


def product_view(product: Product) -> ProductView:
    return ProductView(
        id=product.id,
        slug=product.slug,
        title=product.title,
        description=product.description,
        category=product.category.name,
        price=product.price_minor,
        stock=product.stock,
        status=product.status,
        image_url=product.image_url,
        image_alt=product.image_alt,
    )


@router.get("/categories", response_model=list[CategoryView])
async def categories(db: AsyncSession = Depends(get_db_session)) -> list[Category]:
    result = await db.scalars(
        select(Category).where(Category.is_active.is_(True)).order_by(Category.name)
    )
    return list(result)


@router.get("/products", response_model=list[ProductView])
async def products(db: AsyncSession = Depends(get_db_session)) -> list[ProductView]:
    result = await db.scalars(
        select(Product)
        .options(selectinload(Product.category))
        .where(Product.status == "published")
        .order_by(Product.created_at.desc())
    )
    return [product_view(product) for product in result]


@router.get("/products/{slug}", response_model=ProductView)
async def product(slug: str, db: AsyncSession = Depends(get_db_session)) -> ProductView:
    record = await db.scalar(
        select(Product)
        .options(selectinload(Product.category))
        .where(Product.slug == slug, Product.status == "published")
    )
    if not record:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Product not found")
    return product_view(record)
