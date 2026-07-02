"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowsClockwise } from "@phosphor-icons/react";

// Re-runs the server components (fresh DB read) without a full page reload,
// so client state like search/filter/scroll survives.
export default function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      title="Refresh data"
      aria-label="Refresh data"
      aria-busy={isPending}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-300 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-60"
    >
      <ArrowsClockwise
        size={17}
        aria-hidden
        className={isPending ? "animate-spin" : undefined}
      />
    </button>
  );
}
