import type { AdminSession, Conversation, Product } from "@/types";

import { ApiError, bff } from "./client";
import {
  mapConversation,
  mapProduct,
  type BackendConversation,
  type BackendProduct,
} from "./contracts";

const unauthenticated: AdminSession = { authenticated: false, admin: null };

export async function getAdminSession(): Promise<AdminSession> {
  try {
    return await bff<AdminSession>("admin/session");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return unauthenticated;
    throw error;
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await bff<void>("admin/session", { method: "DELETE" });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return;
    throw error;
  }
}

export async function getConversation(id: string): Promise<Conversation> {
  const result = await bff<BackendConversation>(`admin/conversations/${id}`);
  return mapConversation(result);
}

export async function sendAdminMessage(id: string, body: string): Promise<Conversation> {
  await bff(`admin/conversations/${id}/messages`, { method: "POST", body: { body } });
  return getConversation(id);
}

type ProductPayload = Omit<Product, "id" | "images" | "tag" | "features" | "specs"> & {
  imageUrl: string;
  imageAlt: string;
};

function toPayload(product: ProductPayload) {
  return {
    title: product.title,
    slug: product.slug,
    description: product.description,
    category: product.category,
    price: Math.round(product.price * 100),
    stock: product.stock,
    status: product.status,
    image_url: product.imageUrl,
    image_alt: product.imageAlt,
  };
}

export async function saveProduct(product: ProductPayload, id?: string): Promise<Product> {
  const result = await bff<BackendProduct>(id ? `admin/products/${id}` : "admin/products", {
    method: id ? "PATCH" : "POST",
    body: toPayload(product),
  });
  return mapProduct(result);
}
