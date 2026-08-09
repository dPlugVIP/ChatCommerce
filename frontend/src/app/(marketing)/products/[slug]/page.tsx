import { notFound } from "next/navigation";

import ProductDetailPage from "@/components/pages/marketing/product-detail";
import { getCatalogProduct } from "@/lib/api/server-data";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) notFound();
  return <ProductDetailPage product={product} />;
}
