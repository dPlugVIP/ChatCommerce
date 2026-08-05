import { describe, expect, it } from "vitest";

import { normalizeReturnTo, withReturnTo } from "./routing";

describe("routing helpers", () => {
  it("keeps local return paths intact", () => {
    expect(normalizeReturnTo("/chat?product=prod-1#thread")).toBe("/chat?product=prod-1#thread");
  });

  it("rejects external and protocol-relative return paths", () => {
    expect(normalizeReturnTo("https://example.com/admin", "/login")).toBe("/login");
    expect(normalizeReturnTo("//example.com/admin", "/login")).toBe("/login");
  });

  it("builds login links with a normalized next parameter", () => {
    expect(withReturnTo("/login", "/admin/products")).toBe("/login?next=%2Fadmin%2Fproducts");
  });
});
