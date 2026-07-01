"use client";

import Link from "next/link";
import { Gear } from "@phosphor-icons/react";

export default function SettingsLink() {
  return (
    <Link
      href="/admin/settings"
      title="Settings"
      aria-label="Settings"
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-300 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
    >
      <Gear size={17} aria-hidden />
    </Link>
  );
}
