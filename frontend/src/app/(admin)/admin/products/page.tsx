import AdminProductsPage from "@/components/pages/admin/products";
import { getAdminProducts } from "@/lib/api/server-data";

export default async function Page() {
  return <AdminProductsPage products={await getAdminProducts()} />;
}
