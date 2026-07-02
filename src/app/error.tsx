"use client";

import { FloralDivider } from "@/components/guest/FloralElements";

// Root error boundary — transient infrastructure failures (e.g. a database
// cold start) degrade to a friendly retry instead of a white screen.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-cream px-6 text-center">
      <FloralDivider className="h-9 w-48 text-gold/60" />
      <h1 className="font-script mt-6 text-5xl text-burgundy">
        A Small Hiccup
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-charcoal/70">
        Something went wrong on our side — it&apos;s usually momentary.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-full bg-burgundy px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-cream transition-all hover:bg-burgundy-dark active:scale-[0.98]"
      >
        Try again
      </button>
    </main>
  );
}
