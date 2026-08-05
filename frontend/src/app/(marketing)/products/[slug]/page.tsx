import { notFound } from "next/navigation";

import ProductDetailPage from "@/components/pages/marketing/product-detail";
import { getProductBySlug } from "@/lib/mock/chatcommerce";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetailPage product={product} />;
}
