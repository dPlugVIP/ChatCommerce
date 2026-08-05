import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ProtectedRoute } from "./protected-route";

const authState = vi.hoisted(() => ({
  admin: { isLoading: false, isAuthenticated: false },
  customer: { isLoading: false, isAuthenticated: false },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/chat",
  useSearchParams: () => new URLSearchParams("product=prod-1"),
}));

vi.mock("@/lib/providers/auth", () => ({
  useAdminAuth: () => authState.admin,
}));

vi.mock("@/lib/providers/customer-auth", () => ({
  useCustomerAuth: () => authState.customer,
}));

describe("ProtectedRoute", () => {
  it("renders a loading state while the selected session is pending", () => {
    authState.customer = { isLoading: true, isAuthenticated: false };

    render(
      <ProtectedRoute area="customer">
        <div>Private chat</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Checking your session...")).toBeInTheDocument();
  });

  it("renders an unauthenticated state with a safe login link", () => {
    authState.customer = { isLoading: false, isAuthenticated: false };

    render(
      <ProtectedRoute area="customer">
        <div>Private chat</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Sign in to continue")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute("href", "/login?next=%2Fchat%3Fproduct%3Dprod-1");
  });

  it("renders protected children when the selected session is authenticated", () => {
    authState.customer = { isLoading: false, isAuthenticated: true };

    render(
      <ProtectedRoute area="customer">
        <div>Private chat</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Private chat")).toBeInTheDocument();
  });
});
