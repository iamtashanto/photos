"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log to console in development; replace with an error monitoring service (e.g. Sentry) in production
    console.error("[Error boundary]", error);
  }, [error]);

  return (
    <div className="not-found">
      <p>Something slipped out of frame.</p>
      <h1>The image could not be developed.</h1>
      <span>Please try once more.</span>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
