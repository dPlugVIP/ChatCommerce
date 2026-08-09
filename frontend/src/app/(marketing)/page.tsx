import CatalogPage from "@/components/pages/marketing/catalog";
import { getCatalogCategories, getCatalogProducts } from "@/lib/api/server-data";

export default async function Page() {
  const [products, categories] = await Promise.all([
    getCatalogProducts(),
    getCatalogCategories(),
  ]);
  return <CatalogPage products={products} categories={categories} />;
}
