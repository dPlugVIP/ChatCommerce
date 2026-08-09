import type { Conversation, CustomerSession, CustomerUser } from "@/types";

import { ApiError, bff } from "./client";
import { mapConversation, type BackendConversation } from "./contracts";

const unauthenticated: CustomerSession = { authenticated: false, user: null };

export async function getCustomerSession(): Promise<CustomerSession> {
  try {
    return await bff<CustomerSession>("customer/session");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return unauthenticated;
    throw error;
  }
}

export async function logoutCustomer(): Promise<void> {
  try {
    await bff<void>("customer/session", { method: "DELETE" });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return;
    throw error;
  }
}

export type AuthResponse = {
  authenticated: true;
  area: "admin" | "customer";
  user: CustomerUser & { role: "admin" | "customer" };
};

export function login(email: string, password: string) {
  return bff<AuthResponse>("customer/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function register(name: string, email: string, password: string) {
  return bff<AuthResponse>("customer/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
}

export async function getCurrentConversation(): Promise<Conversation> {
  const conversation = await bff<BackendConversation>("customer/conversations/current");
  return mapConversation(conversation);
}

export async function sendCustomerMessage(body: string) {
  await bff("customer/conversations/current/messages", {
    method: "POST",
    body: { body },
  });
  return getCurrentConversation();
}
