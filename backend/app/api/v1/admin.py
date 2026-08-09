import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.v1.catalog import product_view
from app.api.v1.conversations import conversation_view, message_view
from app.api.v1.schemas import (
    ConversationView,
    MessageInput,
    MessageView,
    ProductInput,
    ProductView,
)
from app.core.security import require_admin
from app.db.models import Category, Conversation, Message, Product, User, utcnow
from app.db.session import get_db_session

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_admin)])


async def category_for(db: AsyncSession, name: str) -> Category:
    category = await db.scalar(select(Category).where(Category.name == name.strip()))
    if category:
        return category
    slug = "-".join(name.lower().strip().split())
    category = Category(name=name.strip(), slug=slug)
    db.add(category)
    await db.flush()
    return category


@router.get("/products", response_model=list[ProductView])
async def products(db: AsyncSession = Depends(get_db_session)) -> list[ProductView]:
    result = await db.scalars(
        select(Product).options(selectinload(Product.category)).order_by(Product.created_at.desc())
    )
    return [product_view(product) for product in result]


@router.post("/products", response_model=ProductView, status_code=status.HTTP_201_CREATED)
async def create_product(
    payload: ProductInput, db: AsyncSession = Depends(get_db_session)
) -> ProductView:
    if await db.scalar(select(Product.id).where(Product.slug == payload.slug)):
        raise HTTPException(status.HTTP_409_CONFLICT, "Product slug already exists")
    category = await category_for(db, payload.category)
    product = Product(
        category_id=category.id,
        slug=payload.slug,
        title=payload.title,
        description=payload.description,
        price_minor=payload.price,
        stock=payload.stock,
        status=payload.status,
        image_url=payload.image_url,
        image_alt=payload.image_alt,
    )
    db.add(product)
    await db.commit()
    product.category = category
    return product_view(product)


@router.patch("/products/{product_id}", response_model=ProductView)
async def update_product(
    product_id: uuid.UUID,
    payload: ProductInput,
    db: AsyncSession = Depends(get_db_session),
) -> ProductView:
    product = await db.scalar(
        select(Product).options(selectinload(Product.category)).where(Product.id == product_id)
    )
    if not product:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Product not found")
    duplicate = await db.scalar(
        select(Product.id).where(Product.slug == payload.slug, Product.id != product_id)
    )
    if duplicate:
        raise HTTPException(status.HTTP_409_CONFLICT, "Product slug already exists")
    category = await category_for(db, payload.category)
    for field in ("slug", "title", "description", "stock", "status", "image_url", "image_alt"):
        setattr(product, field, getattr(payload, field))
    product.price_minor = payload.price
    product.category_id = category.id
    await db.commit()
    product.category = category
    return product_view(product)


@router.get("/products/{product_id}", response_model=ProductView)
async def product(product_id: uuid.UUID, db: AsyncSession = Depends(get_db_session)) -> ProductView:
    record = await db.scalar(
        select(Product).options(selectinload(Product.category)).where(Product.id == product_id)
    )
    if not record:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Product not found")
    return product_view(record)


@router.get("/conversations", response_model=list[ConversationView])
async def conversations(db: AsyncSession = Depends(get_db_session)) -> list[ConversationView]:
    result = await db.scalars(
        select(Conversation)
        .options(
            selectinload(Conversation.customer),
            selectinload(Conversation.messages).selectinload(Message.sender),
        )
        .order_by(Conversation.last_message_at.desc())
    )
    return [conversation_view(item, include_messages=False) for item in result]


async def load_conversation(db: AsyncSession, conversation_id: uuid.UUID) -> Conversation:
    conversation = await db.scalar(
        select(Conversation)
        .options(
            selectinload(Conversation.customer),
            selectinload(Conversation.messages).selectinload(Message.sender),
        )
        .where(Conversation.id == conversation_id)
    )
    if not conversation:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Conversation not found")
    return conversation


@router.get("/conversations/{conversation_id}", response_model=ConversationView)
async def conversation(
    conversation_id: uuid.UUID, db: AsyncSession = Depends(get_db_session)
) -> ConversationView:
    return conversation_view(await load_conversation(db, conversation_id))


@router.post(
    "/conversations/{conversation_id}/messages",
    response_model=MessageView,
    status_code=status.HTTP_201_CREATED,
)
async def reply(
    conversation_id: uuid.UUID,
    payload: MessageInput,
    db: AsyncSession = Depends(get_db_session),
    admin: User = Depends(require_admin),
) -> MessageView:
    conversation = await load_conversation(db, conversation_id)
    message = Message(
        conversation_id=conversation.id,
        sender_id=admin.id,
        body=payload.body.strip(),
        product_id=payload.product_id,
    )
    conversation.last_message_at = utcnow()
    db.add(message)
    await db.commit()
    await db.refresh(message)
    message.sender = admin
    return message_view(message)
