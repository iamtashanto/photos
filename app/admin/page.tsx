import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin";
import AdminDashboard from "./admin-dashboard";

export default async function AdminPage() {
  const authenticated = isValidAdminToken((await cookies()).get(ADMIN_COOKIE)?.value);
  return <AdminDashboard authenticated={authenticated} />;
}
