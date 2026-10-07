"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const links = [
  ["Gallery", "/gallery"],
  ["Collections", "/collections"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === "Tab") {
        const focusable = [menuButtonRef.current, ...Array.from(menuRef.current?.querySelectorAll<HTMLElement>("a[href]") ?? [])].filter(Boolean) as HTMLElement[];
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first && last) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className={`site-header ${pathname === "/" && !scrolled ? "hero-header" : ""} ${scrolled ? "is-scrolled" : ""} ${open ? "menu-open" : ""}`}>
      <Link href="/" className="wordmark" aria-label="TA Shanto Photography home">
        <span>TA SHANTO</span><small>PHOTOGRAPHY</small>
      </Link>
      <div className="nav-actions">
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(([label, href]) => <Link className={pathname.startsWith(href) ? "active" : ""} href={href} key={href}>{label}</Link>)}
        </nav>
        <ThemeToggle />
        <button ref={menuButtonRef} className="menu-button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav ref={menuRef} id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .24, ease: [0.22, 1, 0.36, 1] }}>
            <div className="mobile-nav-inner">
              {links.map(([label, href], index) => <motion.div key={href} initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }} transition={{ duration: reduceMotion ? 0 : .3, delay: reduceMotion ? 0 : .035 + index * .04, ease: [0.22, 1, 0.36, 1] }}><Link href={href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{label}</Link></motion.div>)}
            </div>
            <div className="mobile-nav-meta"><span>Dhaka, Bangladesh</span><a href="https://tashanto.com" target="_blank" rel="noreferrer">Developer portfolio ↗</a></div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
