import "server-only";

import { adminBackendRequest, backendRequest, customerBackendRequest } from "./server-client";
import {
  mapBusinessSettings,
  mapConversation,
  mapProduct,
  type BackendBusinessSettings,
  type BackendConversation,
  type BackendProduct,
} from "./contracts";

export async function getPublicBrandingServer() {
  const result = await backendRequest<BackendBusinessSettings>("/settings");
  return result.ok ? mapBusinessSettings(result.data) : null;
}

export async function getCatalogProducts() {
  const result = await customerBackendRequest<BackendProduct[]>("/products");
  return result.ok ? result.data.map(mapProduct) : [];
}

export async function getCatalogCategories() {
  const result = await customerBackendRequest<Array<{ name: string }>>("/categories");
  return result.ok ? ["All Categories", ...result.data.map((category) => category.name)] : ["All Categories"];
}

export async function getCatalogProduct(slug: string) {
  const result = await customerBackendRequest<BackendProduct>(`/products/${slug}`);
  return result.ok ? mapProduct(result.data) : null;
}

export async function getAdminProducts() {
  const result = await adminBackendRequest<BackendProduct[]>("/admin/products");
  return result.ok ? result.data.map(mapProduct) : [];
}

export async function getAdminProduct(id: string) {
  const result = await adminBackendRequest<BackendProduct>(`/admin/products/${id}`);
  return result.ok ? mapProduct(result.data) : null;
}

export async function getAdminConversations() {
  const result = await adminBackendRequest<BackendConversation[]>("/admin/conversations");
  return result.ok ? result.data.map(mapConversation) : [];
}
