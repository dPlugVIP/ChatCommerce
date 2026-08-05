const FALLBACK_RETURN_TO = "/";

function isLocalPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//") && !value.includes("\\");
}

export function normalizeReturnTo(value: string | null | undefined, fallback = FALLBACK_RETURN_TO) {
  if (!value || !isLocalPath(fallback)) return fallback;

  try {
    const url = new URL(value, "https://chatcommerce.local");
    if (url.origin !== "https://chatcommerce.local") return fallback;
    const next = `${url.pathname}${url.search}${url.hash}`;
    return isLocalPath(next) ? next : fallback;
  } catch {
    return fallback;
  }
}

export function withReturnTo(path: string, returnTo: string) {
  const safeReturnTo = normalizeReturnTo(returnTo);
  const url = new URL(path, "https://chatcommerce.local");
  url.searchParams.set("next", safeReturnTo);
  return `${url.pathname}${url.search}`;
}
