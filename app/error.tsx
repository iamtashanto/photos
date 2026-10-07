"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log to console in development; replace with an error monitoring service (e.g. Sentry) in production
    console.error("[Error boundary]", error);
  }, [error]);

  return (
    <div className="grid min-h-svh place-content-center px-6 text-center">
      <p className="text-xs uppercase tracking-widest text-[var(--muted)]">Something slipped out of frame.</p>
      <h1 className="my-5 max-w-3xl font-[family-name:var(--serif)] text-[clamp(3rem,7vw,7rem)] leading-none">The image could not be developed.</h1>
      <span className="text-[var(--muted)]">Please try once more.</span>
      <button className="mx-auto mt-8 bg-[var(--text)] px-5 py-3 text-xs uppercase tracking-widest text-[var(--bg)]" onClick={reset}>Try again</button>
    </div>
  );
}
