export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center gap-2" role="status" aria-label="Loading">
      <span className="size-2 animate-pulse rounded-full bg-[var(--muted)]" aria-hidden="true" />
      <span className="size-2 animate-pulse rounded-full bg-[var(--muted)] [animation-delay:150ms]" aria-hidden="true" />
      <span className="size-2 animate-pulse rounded-full bg-[var(--muted)] [animation-delay:300ms]" aria-hidden="true" />
    </div>
  );
}
