import "server-only";

import { cookies } from "next/headers";

import type { ApiProblem } from "@/types";

export const ADMIN_SESSION_COOKIE = "chatcommerce_admin";
export const CUSTOMER_SESSION_COOKIE = "chatcommerce_customer";

const API_PREFIX = "/api/v1";

export type BackendResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; problem: ApiProblem };

function backendBase(): string {
  const url = process.env.NEXT_API_URL;
  if (!url) throw new Error("NEXT_API_URL is not set.");
  return url.replace(/\/$/, "") + API_PREFIX;
}

function problem(detail: string, status = 503): ApiProblem {
  return { type: "about:blank", title: "network_error", status, detail };
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function isProblem(body: unknown): body is ApiProblem {
  return typeof body === "object" && body !== null && "detail" in body && "status" in body;
}

export async function backendRequest<T>(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<BackendResult<T>> {
  const { token, headers, ...rest } = init;
  const finalHeaders = new Headers(headers);
  if (!finalHeaders.has("content-type") && rest.body) finalHeaders.set("content-type", "application/json");
  finalHeaders.set("accept", "application/json");
  if (token) finalHeaders.set("authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(backendBase() + path, {
      ...rest,
      headers: finalHeaders,
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    return {
      ok: false,
      status: 503,
      problem: problem(error instanceof Error ? error.message : "Backend unreachable."),
    };
  }

  const text = await response.text();
  const body: unknown = text ? safeJson(text) : null;

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      problem: isProblem(body) ? body : problem("Request failed.", response.status),
    };
  }

  return { ok: true, status: response.status, data: body as T };
}

async function authorizedRequest<T>(
  cookieName: string,
  path: string,
  init: RequestInit = {},
): Promise<BackendResult<T>> {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) {
    return {
      ok: false,
      status: 401,
      problem: {
        type: "about:blank",
        title: "unauthorized",
        status: 401,
        detail: "Not signed in.",
      },
    };
  }

  return backendRequest<T>(path, { ...init, token });
}

export function adminBackendRequest<T>(path: string, init: RequestInit = {}) {
  return authorizedRequest<T>(ADMIN_SESSION_COOKIE, path, init);
}

export function customerBackendRequest<T>(path: string, init: RequestInit = {}) {
  return authorizedRequest<T>(CUSTOMER_SESSION_COOKIE, path, init);
}
