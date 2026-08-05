import { NextResponse } from "next/server";

import { backendRequest } from "@/lib/api/server-client";

type Ctx = { params: Promise<{ path: string[] }> };

const ALLOWED_ROOTS = new Set(["settings", "products", "categories"]);

function notFound() {
  return NextResponse.json(
    { type: "about:blank", title: "not_found", status: 404, detail: "Not found." },
    { status: 404 },
  );
}

async function forward(request: Request, ctx: Ctx, method: string) {
  const { path } = await ctx.params;
  if (path.length === 0 || !ALLOWED_ROOTS.has(path[0])) return notFound();

  const search = new URL(request.url).search;
  const body = method !== "GET" && method !== "DELETE" ? await request.text() : undefined;
  const result = await backendRequest<unknown>(`/${path.join("/")}${search}`, {
    method,
    body: body || undefined,
  });

  if (!result.ok) return NextResponse.json(result.problem, { status: result.status });
  if (result.status === 204 || result.data === null) return new NextResponse(null, { status: result.status });
  return NextResponse.json(result.data, { status: result.status });
}

export const GET = (request: Request, ctx: Ctx) => forward(request, ctx, "GET");
export const POST = (request: Request, ctx: Ctx) => forward(request, ctx, "POST");
