import AdminDashboardPage from "@/components/pages/admin/dashboard";
import { getAdminConversations, getAdminProducts } from "@/lib/api/server-data";

export default async function Page() {
  const [products, conversations] = await Promise.all([
    getAdminProducts(),
    getAdminConversations(),
  ]);
  return <AdminDashboardPage products={products} conversations={conversations} />;
}
