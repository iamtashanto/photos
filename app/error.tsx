"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <div className="not-found"><p>Something slipped out of frame.</p><h1>The image could not be developed.</h1><span>Please try once more.</span><button onClick={reset}>Try again</button></div>; }
