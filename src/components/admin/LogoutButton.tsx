"use client";

import { logout } from "@/lib/admin-actions";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100"
      >
        Log out
      </button>
    </form>
  );
}
