import asyncio
import sys

from sqlalchemy import select

from app.core.config import get_settings
from app.core.security import hash_password
from app.db.models import Category, Product, User
from app.db.session import make_session_factory


async def seed_admin() -> None:
    settings = get_settings()
    if not settings.bootstrap_admin_email or not settings.bootstrap_admin_password:
        raise RuntimeError("BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD are required")
    factory = make_session_factory(settings)
    async with factory() as db:
        email = settings.bootstrap_admin_email.lower().strip()
        existing = await db.scalar(select(User).where(User.email == email))
        if existing and existing.role != "admin":
            raise RuntimeError("Bootstrap email belongs to a non-admin account")
        if not existing:
            db.add(
                User(
                    email=email,
                    display_name="DplugVIP Admin",
                    password_hash=hash_password(settings.bootstrap_admin_password),
                    role="admin",
                )
            )

        category = await db.scalar(select(Category).where(Category.slug == "electronics"))
        if not category:
            category = Category(slug="electronics", name="Electronics")
            db.add(category)
            await db.flush()

        if not await db.scalar(select(Product.id).limit(1)):
            db.add_all(
                [
                    Product(
                        category_id=category.id,
                        slug="macbook-pro-14-m3-max",
                        title='MacBook Pro 14" M3 Max',
                        description="Sealed Space Black unit with 36GB RAM and 1TB SSD.",
                        price_minor=320_000,
                        stock=3,
                        status="published",
                        image_url="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
                        image_alt="Space gray laptop on a desk",
                    ),
                    Product(
                        category_id=category.id,
                        slug="aura-noise-cancelling-headphones",
                        title="Aura Noise Cancelling Headphones",
                        description="High-fidelity wireless audio with active noise cancellation.",
                        price_minor=34_900,
                        stock=12,
                        status="published",
                        image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
                        image_alt="Silver over-ear headphones",
                    ),
                ]
            )
        await db.commit()


def main() -> None:
    if sys.argv[1:] != ["seed-admin"]:
        raise SystemExit("Usage: python -m app.cli seed-admin")
    asyncio.run(seed_admin())


if __name__ == "__main__":
    main()
