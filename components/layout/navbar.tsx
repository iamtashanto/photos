"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${open ? "menu-open" : ""}`}>
      <Link href="/" className="wordmark" aria-label="Tashanto Photography home">
        <span>TASHANTO</span><small>PHOTOGRAPHY</small>
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {links.map(([label, href]) => <Link className={pathname.startsWith(href) ? "active" : ""} href={href} key={href}>{label}</Link>)}
      </nav>
      <button ref={menuButtonRef} className="menu-button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
        {open ? <X /> : <Menu />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}>
            <div className="mobile-nav-inner">
              {links.map(([label, href], index) => <motion.div key={href} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .04 + index * .045 }}><Link href={href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{label}</Link></motion.div>)}
            </div>
            <div className="mobile-nav-meta"><span>Dhaka, Bangladesh</span><a href="https://tashanto.com" target="_blank" rel="noreferrer">Developer portfolio ↗</a></div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
