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
  const navClass = (active: boolean) => `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${active ? "bg-white/10 text-white shadow-[inset_3px_0_#d8d2c7]" : "text-stone-400 hover:bg-white/5 hover:text-white"}`;
  return <main className="admin-root grid min-h-svh grid-cols-[272px_minmax(0,1fr)] bg-[#f3f1eb] text-[#171716] max-[850px]:grid-cols-1">
    <aside className="sticky top-0 flex h-svh flex-col border-r border-white/10 bg-[#161616] px-5 py-8 text-[#f4f1ea] max-[850px]:static max-[850px]:h-auto">
      <div className="px-4 pb-12 text-base font-bold tracking-[.18em]"><span>TA SHANTO</span><small className="mt-2 block text-[.66rem] font-medium tracking-[.16em] text-stone-500">PHOTOGRAPHY / CMS</small></div>
      <nav className="grid gap-1" aria-label="Admin navigation">
        <Link className={navClass(pathname === "/admin")} href="/admin"><LayoutDashboard className="size-[18px]" /> Overview</Link>
        <Link className={navClass(pathname.startsWith("/admin/photographs"))} href="/admin/photographs"><ImageIcon className="size-[18px]" /> Photographs</Link>
        <Link className={navClass(pathname.startsWith("/admin/collections"))} href="/admin/collections"><FolderKanban className="size-[18px]" /> Collections</Link>
      </nav>
      <div className="mt-auto grid border-t border-white/10 pt-5 text-sm text-stone-400">
        <a className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-white/5 hover:text-white" href="/" target="_blank" rel="noreferrer"><ExternalLink className="size-[18px]" /> View live site</a>
        <button className="flex items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-white/5 hover:text-white" onClick={logout}><LogOut className="size-[18px]" /> Sign out</button>
      </div>
    </aside>
    <section className="min-w-0 w-full px-[clamp(1.25rem,3.5vw,4.5rem)] py-[clamp(2rem,3.5vw,3.5rem)]">{children}</section>
  </main>;
}
