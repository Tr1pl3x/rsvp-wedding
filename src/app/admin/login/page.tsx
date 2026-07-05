"use client";

import { useActionState } from "react";
import { login } from "@/lib/admin-actions";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-zinc-50 px-4">
      <form
        action={action}
        className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.2)]"
      >
        <p className="font-script text-3xl text-burgundy">Harry &amp; Susan</p>
        <h1 className="mt-1 text-lg font-semibold tracking-tight text-zinc-900">
          Guest Admin
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Enter the admin password to continue.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-zinc-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            className="rounded-lg border border-zinc-300 px-3 py-2 text-base text-zinc-900 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy"
          />
        </div>

        <div
          role="alert"
          aria-live="assertive"
          className="mt-2 min-h-[1.25rem] text-sm text-burgundy"
        >
          {state?.error}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-2 w-full rounded-lg bg-burgundy py-2.5 text-sm font-semibold text-white transition-colors hover:bg-burgundy-dark disabled:opacity-60"
        >
          {pending ? "Checking…" : "Enter"}
        </button>
      </form>
    </main>
  );
}
