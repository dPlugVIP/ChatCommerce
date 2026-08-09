import AdminInboxPage from "@/components/pages/admin/inbox";
import { getAdminConversations } from "@/lib/api/server-data";

export default async function Page() {
  return <AdminInboxPage conversations={await getAdminConversations()} />;
}
