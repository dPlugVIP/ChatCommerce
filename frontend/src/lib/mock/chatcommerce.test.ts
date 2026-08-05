import { describe, expect, it } from "vitest";

import { conversations, formatMoney, getProductById, getProductBySlug, products } from "@/lib/mock/chatcommerce";

describe("chatcommerce mock data helpers", () => {
  it("formats whole-dollar prices without cents", () => {
    expect(formatMoney(3200)).toBe("$3,200");
  });

  it("finds products by slug and id", () => {
    const product = products[0];

    expect(getProductBySlug(product.slug)).toEqual(product);
    expect(getProductById(product.id)).toEqual(product);
  });

  it("keeps customer conversations tied to valid product references", () => {
    const referencedProductIds = new Set(products.map((product) => product.id));

    expect(conversations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          customerName: expect.any(String),
          messages: expect.any(Array),
        }),
      ])
    );

    for (const conversation of conversations) {
      if (conversation.productId) {
        expect(referencedProductIds.has(conversation.productId)).toBe(true);
      }
    }
  });
});
