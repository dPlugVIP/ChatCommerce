import type { ApiProblem } from "@/types";

export class ApiError extends Error {
  status: number;
  problem?: ApiProblem;

  constructor(message: string, status: number, problem?: ApiProblem) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.problem = problem;
  }
}

export async function bff<T>(
  path: string,
  init: Omit<RequestInit, "body"> & { body?: unknown } = {},
): Promise<T> {
  const { body, headers, ...rest } = init;
  const response = await fetch(`/api/bff/${path}`, {
    ...rest,
    headers: {
      ...(body ? { "content-type": "application/json" } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
  });

  const text = await response.text();
  const parsed: unknown = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const problem = parsed as ApiProblem | null;
    throw new ApiError(
      problem?.detail ?? "Request failed. Please try again.",
      response.status,
      problem ?? undefined,
    );
  }

  return parsed as T;
}

export async function bffUpload<T>(path: string, form: FormData): Promise<T> {
  const response = await fetch(`/api/bff/${path}`, {
    method: "POST",
    body: form,
    credentials: "same-origin",
  });

  const text = await response.text();
  const parsed: unknown = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const problem = parsed as ApiProblem | null;
    throw new ApiError(
      problem?.detail ?? "Upload failed. Please try again.",
      response.status,
      problem ?? undefined,
    );
  }

  return parsed as T;
}
