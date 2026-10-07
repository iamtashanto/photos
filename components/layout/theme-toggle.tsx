"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setTheme(currentTheme()));
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const syncSystemTheme = (event: MediaQueryListEvent) => {
      if (localStorage.getItem("ta-shanto-theme")) return;
      const nextTheme: Theme = event.matches ? "light" : "dark";
      document.documentElement.dataset.theme = nextTheme;
      document.documentElement.style.colorScheme = nextTheme;
      setTheme(nextTheme);
    };
    media.addEventListener("change", syncSystemTheme);
    return () => { cancelAnimationFrame(frame); media.removeEventListener("change", syncSystemTheme); };
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem("ta-shanto-theme", nextTheme);
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute("content", nextTheme === "dark" ? "#090909" : "#f4f1ea");
    setTheme(nextTheme);
  }

  return (
    <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
      {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  );
}
