import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.v1.schemas import ConversationView, MessageInput, MessageView
from app.core.security import require_customer
from app.db.models import Conversation, Message, User, utcnow
from app.db.session import get_db_session

router = APIRouter(prefix="/conversations", tags=["conversations"])


def message_view(message: Message) -> MessageView:
    return MessageView(
        id=message.id,
        sender="business" if message.sender.role == "admin" else "customer",
        body=message.body,
        timestamp=message.created_at,
        product_id=message.product_id,
    )


def conversation_view(
    conversation: Conversation, include_messages: bool = True
) -> ConversationView:
    messages = sorted(conversation.messages, key=lambda item: item.created_at)
    last = messages[-1].body if messages else "No transmissions yet"
    return ConversationView(
        id=conversation.id,
        customer_name=conversation.customer.display_name,
        customer_email=conversation.customer.email,
        status=conversation.status,
        last_message=last,
        last_message_at=conversation.last_message_at,
        messages=[message_view(message) for message in messages] if include_messages else [],
    )


async def load_customer_conversation(
    db: AsyncSession, customer_id: uuid.UUID
) -> Conversation | None:
    return (
        await db.scalars(
            select(Conversation)
            .options(
                selectinload(Conversation.customer),
                selectinload(Conversation.messages).selectinload(Message.sender),
            )
            .where(Conversation.customer_id == customer_id)
        )
    ).first()


@router.post("/current", response_model=ConversationView)
async def current(
    db: AsyncSession = Depends(get_db_session),
    user: User = Depends(require_customer),
) -> ConversationView:
    conversation = await load_customer_conversation(db, user.id)
    if not conversation:
        conversation = Conversation(customer_id=user.id)
        db.add(conversation)
        await db.commit()
        conversation = await load_customer_conversation(db, user.id)
    if not conversation:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Could not create conversation")
    return conversation_view(conversation)


@router.get("/current", response_model=ConversationView)
async def get_current(
    db: AsyncSession = Depends(get_db_session),
    user: User = Depends(require_customer),
) -> ConversationView:
    conversation = await load_customer_conversation(db, user.id)
    if not conversation:
        return await current(db, user)
    return conversation_view(conversation)


@router.post("/current/messages", response_model=MessageView, status_code=status.HTTP_201_CREATED)
async def send_message(
    payload: MessageInput,
    db: AsyncSession = Depends(get_db_session),
    user: User = Depends(require_customer),
) -> MessageView:
    conversation = await load_customer_conversation(db, user.id)
    if not conversation:
        await current(db, user)
        conversation = await load_customer_conversation(db, user.id)
    if not conversation or conversation.status != "open":
        raise HTTPException(status.HTTP_409_CONFLICT, "Conversation is not open")
    message = Message(
        conversation_id=conversation.id,
        sender_id=user.id,
        body=payload.body.strip(),
        product_id=payload.product_id,
    )
    conversation.last_message_at = utcnow()
    db.add(message)
    await db.commit()
    await db.refresh(message)
    message.sender = user
    return message_view(message)
