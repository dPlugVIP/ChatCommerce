import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  CUSTOMER_SESSION_COOKIE,
  backendRequest,
  customerBackendRequest,
} from "@/lib/api/server-client";

type Ctx = { params: Promise<{ path: string[] }> };

const ALLOWED_ROOTS = new Set(["auth", "session", "conversations", "messages"]);

type BackendUser = { id: string; name: string; email: string; role: "customer" | "admin" };
type AuthResult = { token: string; user: BackendUser };

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  };
}

function notFound() {
  return NextResponse.json(
    { type: "about:blank", title: "not_found", status: 404, detail: "Not found." },
    { status: 404 },
  );
}

async function forward(request: Request, ctx: Ctx, method: string) {
  const { path } = await ctx.params;
  if (path.length === 0 || !ALLOWED_ROOTS.has(path[0])) return notFound();

  if (path[0] === "auth" && (path[1] === "login" || path[1] === "register") && method === "POST") {
    const result = await backendRequest<AuthResult>(`/auth/${path[1]}`, {
      method: "POST",
      body: await request.text(),
    });
    if (!result.ok) return NextResponse.json(result.problem, { status: result.status });

    const isAdmin = result.data.user.role === "admin";
    const response = NextResponse.json({
      authenticated: true,
      area: isAdmin ? "admin" : "customer",
      user: result.data.user,
    }, { status: result.status });
    response.cookies.set(
      isAdmin ? ADMIN_SESSION_COOKIE : CUSTOMER_SESSION_COOKIE,
      result.data.token,
      cookieOptions(),
    );
    return response;
  }

  if (path[0] === "session") {
    if (method === "GET") {
      const result = await customerBackendRequest<BackendUser>("/auth/session");
      if (!result.ok) return NextResponse.json(result.problem, { status: result.status });
      return NextResponse.json({ authenticated: true, user: result.data });
    }
    if (method === "DELETE") {
      await customerBackendRequest("/auth/logout", { method: "POST" });
      const response = new NextResponse(null, { status: 204 });
      response.cookies.set(CUSTOMER_SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
      return response;
    }
  }

  const search = new URL(request.url).search;
  const body = method !== "GET" && method !== "DELETE" ? await request.text() : undefined;
  const result = await customerBackendRequest<unknown>(`/${path.join("/")}${search}`, {
    method,
    body: body || undefined,
  });

  if (!result.ok) return NextResponse.json(result.problem, { status: result.status });
  if (result.status === 204 || result.data === null) return new NextResponse(null, { status: result.status });
  return NextResponse.json(result.data, { status: result.status });
}

export const GET = (request: Request, ctx: Ctx) => forward(request, ctx, "GET");
export const POST = (request: Request, ctx: Ctx) => forward(request, ctx, "POST");
export const PATCH = (request: Request, ctx: Ctx) => forward(request, ctx, "PATCH");
export const DELETE = (request: Request, ctx: Ctx) => forward(request, ctx, "DELETE");
