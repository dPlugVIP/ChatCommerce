import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Providers } from "./index";

describe("Providers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders children inside the application provider stack", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ detail: "Not signed in.", status: 401 }), { status: 401 }))
    );

    render(
      <Providers>
        <main>Provider smoke test</main>
      </Providers>
    );

    expect(screen.getByText("Provider smoke test")).toBeInTheDocument();
  });
});
