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
        const focusable = [
          menuButtonRef.current,
          ...Array.from(menuRef.current?.querySelectorAll<HTMLElement>("a[href]") ?? []),
        ].filter(Boolean) as HTMLElement[];
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first && last) {
          event.preventDefault();
          last.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
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
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 flex items-center justify-between px-[var(--space-page)] transition-all duration-300 ${scrolled ? "h-[70px] border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_84%,transparent)] backdrop-blur-xl" : "h-[84px] bg-gradient-to-b from-black/60 to-transparent"} ${pathname === "/" && !scrolled ? "text-stone-100" : "text-[var(--text)]"}`}
    >
      <Link href="/" className="relative z-[52] flex flex-col text-sm font-semibold leading-none tracking-[.22em]" aria-label="TA Shanto Photography — home" onClick={() => setOpen(false)}>
        <span>TA SHANTO</span>
        <small className="mt-2 text-[.5rem] tracking-[.42em] text-current opacity-70">PHOTOGRAPHY</small>
      </Link>

      <div className="flex items-center gap-[clamp(.8rem,2vw,2rem)]">
        <nav className="flex gap-[clamp(1.7rem,2.5vw,3rem)] text-sm tracking-[.08em] max-[900px]:hidden" aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <Link
              className={`relative pb-2 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-current after:transition-transform ${pathname.startsWith(href) ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}`}
              href={href}
              key={href}
              aria-current={pathname.startsWith(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
        <button
          ref={menuButtonRef}
          className="relative z-[52] hidden size-11 place-items-center border-0 bg-transparent max-[900px]:grid"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            ref={menuRef}
            id="mobile-navigation"
            className="fixed inset-0 z-[51] flex flex-col justify-between bg-[var(--bg)] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[clamp(7rem,18vh,10rem)] text-[var(--text)]"
            aria-label="Mobile navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="border-t border-[var(--line)]">
              {links.map(([label, href], index) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.3,
                    delay: reduceMotion ? 0 : 0.035 + index * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link className="block border-b border-[var(--line)] py-2 font-[family-name:var(--serif)] text-[clamp(2.8rem,14vw,5rem)] leading-none"
                    href={href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname.startsWith(href) ? "page" : undefined}
                  >
                    <span className="mr-5 inline-block w-10 align-middle font-[family-name:var(--sans)] text-xs text-[var(--muted)]">0{index + 1}</span>
                    {label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between gap-4 text-xs text-[var(--muted)]">
              <span>Dhaka, Bangladesh</span>
              <a href="https://tashanto.com" target="_blank" rel="noreferrer">
                Developer portfolio ↗
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
