"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, FolderKanban, ImageIcon, LayoutDashboard, LogOut } from "lucide-react";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }
  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <div className="admin-brand"><span>TA SHANTO</span><small>PHOTOGRAPHY / CMS</small></div>
      <nav className="admin-nav" aria-label="Admin navigation">
        <Link className={pathname === "/admin" ? "is-active" : ""} href="/admin"><span><LayoutDashboard /> Overview</span></Link>
        <Link className={pathname.startsWith("/admin/photographs") ? "is-active" : ""} href="/admin/photographs"><span><ImageIcon /> Photographs</span></Link>
        <Link className={pathname.startsWith("/admin/collections") ? "is-active" : ""} href="/admin/collections"><span><FolderKanban /> Collections</span></Link>
      </nav>
      <div className="admin-sidebar-footer">
        <a href="/" target="_blank" rel="noreferrer"><span><ExternalLink /> View live site</span></a>
        <button onClick={logout}><span><LogOut /> Sign out</span></button>
      </div>
    </aside>
    <section className="admin-main">{children}</section>
  </main>;
}
