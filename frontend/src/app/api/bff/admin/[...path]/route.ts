import { NextResponse } from "next/server";

import { adminBackendRequest } from "@/lib/api/server-client";

type Ctx = { params: Promise<{ path: string[] }> };

const ALLOWED_ROOTS = new Set(["session", "products", "conversations", "messages", "settings", "media"]);

function notFound() {
  return NextResponse.json(
    { type: "about:blank", title: "not_found", status: 404, detail: "Not found." },
    { status: 404 },
  );
}

async function forward(request: Request, ctx: Ctx, method: string) {
  const { path } = await ctx.params;
  if (path.length === 0 || !ALLOWED_ROOTS.has(path[0])) return notFound();

  if (path[0] === "session") {
    if (method === "GET") {
      const result = await adminBackendRequest<{ id: string; name: string; email: string; role: "admin" }>("/auth/session");
      if (!result.ok) return NextResponse.json(result.problem, { status: result.status });
      return NextResponse.json({
        authenticated: true,
        admin: { ...result.data, role: "admin" },
      });
    }
    if (method === "DELETE") {
      await adminBackendRequest("/auth/logout", { method: "POST" });
      const response = new NextResponse(null, { status: 204 });
      response.cookies.set("chatcommerce_admin", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
      });
      return response;
    }
  }

  if (path[0] === "media" && method === "POST") {
    const result = await adminBackendRequest<unknown>(`/admin/${path.join("/")}`, {
      method,
      body: await request.formData(),
    });
    if (!result.ok) return NextResponse.json(result.problem, { status: result.status });
    return NextResponse.json(result.data, { status: result.status });
  }

  const search = new URL(request.url).search;
  const body = method !== "GET" && method !== "DELETE" ? await request.text() : undefined;
  const result = await adminBackendRequest<unknown>(`/admin/${path.join("/")}${search}`, {
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
export const PUT = (request: Request, ctx: Ctx) => forward(request, ctx, "PUT");
export const DELETE = (request: Request, ctx: Ctx) => forward(request, ctx, "DELETE");
