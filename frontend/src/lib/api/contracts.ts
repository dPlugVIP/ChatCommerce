import type { Conversation, Product } from "@/types";

export type BackendProduct = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: Product["status"];
  image_url: string;
  image_alt: string;
};

export type BackendMessage = {
  id: string;
  sender: "customer" | "business";
  body: string;
  timestamp: string;
  product_id?: string | null;
};

export type BackendConversation = {
  id: string;
  customer_name: string;
  customer_email: string;
  status: Conversation["status"];
  last_message: string;
  last_message_at: string;
  messages: BackendMessage[];
};

export function mapProduct(product: BackendProduct): Product {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    description: product.description,
    category: product.category,
    price: product.price / 100,
    stock: product.stock,
    status: product.status,
    images: [{ src: product.image_url, alt: product.image_alt }],
  };
}

export function mapConversation(conversation: BackendConversation): Conversation {
  const initials = conversation.customer_name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return {
    id: conversation.id,
    customerName: conversation.customer_name,
    customerInitials: initials || "CU",
    status: conversation.status,
    unreadCount: 0,
    lastMessage: conversation.last_message,
    lastMessageAt: new Date(conversation.last_message_at).toLocaleString(),
    messages: conversation.messages.map((message) => ({
      id: message.id,
      sender: message.sender,
      body: message.body,
      timestamp: new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      productId: message.product_id ?? undefined,
    })),
  };
}
