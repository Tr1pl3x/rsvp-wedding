"use client";

// Admin-side error boundary in the dashboard's utilitarian style.
export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
      <p className="text-sm font-medium text-zinc-700">Something went wrong</p>
      <p className="mt-1 max-w-sm text-sm text-zinc-500">
        Usually a momentary database hiccup — try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 rounded-lg bg-burgundy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-burgundy-dark"
      >
        Retry
      </button>
    </div>
  );
}
