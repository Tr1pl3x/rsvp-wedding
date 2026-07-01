import Link from "next/link";
import { requireAdmin } from "@/lib/admin-session";
import LogoutButton from "@/components/admin/LogoutButton";
import SettingsLink from "@/components/admin/SettingsLink";

export const dynamic = "force-dynamic";

export default async function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The real gate. Re-checked inside every admin Server Action / Route Handler.
  await requireAdmin();

  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/admin" className="flex items-baseline gap-2">
            <span className="font-script text-2xl leading-none text-burgundy">
              H&amp;S
            </span>
            <span className="text-sm font-medium tracking-tight text-zinc-400">
              Guest Admin
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <SettingsLink />
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
