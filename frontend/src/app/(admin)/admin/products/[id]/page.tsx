import ProductEditorPage from "@/components/pages/admin/products/editor";
import { getProductBySlug, products } from "@/lib/mock/chatcommerce";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductEditorPage product={getProductBySlug(id) ?? products[0]} />;
}
