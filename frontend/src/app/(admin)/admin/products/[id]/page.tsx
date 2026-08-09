import { notFound } from "next/navigation";

import ProductEditorPage from "@/components/pages/admin/products/editor";
import { getAdminProduct } from "@/lib/api/server-data";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getAdminProduct(id);
  if (!product) notFound();
  return <ProductEditorPage product={product} />;
}
