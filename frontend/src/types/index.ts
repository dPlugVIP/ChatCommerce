export type ProductStatus = "published" | "draft" | "archived";

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  tag?: string;
  images: ProductImage[];
  specs?: Array<{ label: string; value: string }>;
  features?: string[];
}

export type ConversationStatus = "open" | "closed" | "archived";

export interface ChatMessage {
  id: string;
  sender: "customer" | "business";
  body: string;
  timestamp: string;
  productId?: string;
}

export interface Conversation {
  id: string;
  customerName: string;
  customerInitials: string;
  avatar?: string;
  status: ConversationStatus;
  unreadCount: number;
  lastMessage: string;
  lastMessageAt: string;
  productId?: string;
  messages: ChatMessage[];
}

export interface BusinessSettings {
  name: string;
  supportEmail: string;
  replyTime: string;
  primaryColor: string;
  logoUrl?: string;
  logoPublicId?: string;
  brandMarkUrl?: string;
  brandMarkPublicId?: string;
  faviconUrl?: string;
  faviconPublicId?: string;
  updatedAt?: string;
}

export interface AdminIdentity {
  id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
  permissions?: string[];
}

export type AdminSession =
  | { authenticated: true; admin: AdminIdentity }
  | { authenticated: false; admin: null };

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
}

export type CustomerSession =
  | { authenticated: true; user: CustomerUser }
  | { authenticated: false; user: null };

export interface ApiProblem {
  type: string;
  title: string;
  status: number;
  detail: string;
}
