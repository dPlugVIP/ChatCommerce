import type { AdminSession, BusinessSettings, Conversation, Product } from "@/types";

import { ApiError, bff, bffUpload } from "./client";
import {
  mapBusinessSettings,
  mapConversation,
  mapProduct,
  type BackendBusinessSettings,
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

export async function getAdminBranding(): Promise<BusinessSettings> {
  return mapBusinessSettings(await bff<BackendBusinessSettings>("admin/settings"));
}

export async function saveAdminBranding(settings: BusinessSettings): Promise<BusinessSettings> {
  const result = await bff<BackendBusinessSettings>("admin/settings", {
    method: "PATCH",
    body: {
      name: settings.name,
      support_email: settings.supportEmail,
      primary_color: settings.primaryColor,
      logo_url: settings.logoUrl ?? null,
      logo_public_id: settings.logoPublicId ?? null,
      brand_mark_url: settings.brandMarkUrl ?? null,
      brand_mark_public_id: settings.brandMarkPublicId ?? null,
      favicon_url: settings.faviconUrl ?? null,
      favicon_public_id: settings.faviconPublicId ?? null,
    },
  });
  return mapBusinessSettings(result);
}

export type BrandAssetKind = "logo" | "brand_mark" | "favicon";

export type BrandAssetUpload = {
  kind: BrandAssetKind;
  url: string;
  public_id: string;
  width?: number;
  height?: number;
  format?: string;
};

export function uploadBrandAsset(file: File, kind: BrandAssetKind) {
  const form = new FormData();
  form.set("file", file);
  form.set("kind", kind);
  return bffUpload<BrandAssetUpload>("admin/media/branding", form);
}
