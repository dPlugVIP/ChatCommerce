import type { AdminSession } from "@/types";

import { ApiError, bff } from "./client";

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
