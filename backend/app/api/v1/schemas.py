import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class AuthInput(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class RegisterInput(AuthInput):
    name: str = Field(min_length=2, max_length=120)


class UserView(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    role: str


class AuthResult(BaseModel):
    token: str
    user: UserView


class CategoryView(BaseModel):
    id: uuid.UUID
    slug: str
    name: str

    model_config = ConfigDict(from_attributes=True)


class ProductInput(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    slug: str = Field(min_length=2, max_length=160, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    description: str = Field(min_length=5, max_length=5000)
    category: str = Field(min_length=2, max_length=120)
    price: int = Field(ge=0)
    stock: int = Field(ge=0, default=0)
    status: str = Field(pattern=r"^(draft|published|archived)$", default="draft")
    image_url: str = Field(min_length=1, max_length=2000)
    image_alt: str = Field(default="Product image", max_length=240)


class ProductView(BaseModel):
    id: uuid.UUID
    slug: str
    title: str
    description: str
    category: str
    price: int
    stock: int
    status: str
    image_url: str
    image_alt: str


class MessageInput(BaseModel):
    body: str = Field(min_length=1, max_length=4000)
    product_id: uuid.UUID | None = None


class MessageView(BaseModel):
    id: uuid.UUID
    sender: str
    body: str
    timestamp: datetime
    product_id: uuid.UUID | None


class ConversationView(BaseModel):
    id: uuid.UUID
    customer_name: str
    customer_email: str
    status: str
    last_message: str
    last_message_at: datetime
    messages: list[MessageView] = []
