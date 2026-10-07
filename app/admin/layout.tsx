import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin";
import { LoginForm } from "./components/login-form";
import { AdminShell } from "./components/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authenticated = isValidAdminToken((await cookies()).get(ADMIN_COOKIE)?.value);
  if (!authenticated) return <LoginForm />;
  return <AdminShell>{children}</AdminShell>;
}
