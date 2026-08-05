import type { CustomerSession } from "@/types";

import { ApiError, bff } from "./client";

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
