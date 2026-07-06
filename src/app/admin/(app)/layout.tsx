import Link from "next/link";
import { requireAdmin } from "@/lib/admin-session";
import { getAppEnv } from "@/lib/app-env";
import LogoutButton from "@/components/admin/LogoutButton";
import RefreshButton from "@/components/admin/RefreshButton";
import SettingsLink from "@/components/admin/SettingsLink";

export const dynamic = "force-dynamic";

export default async function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The real gate. Re-checked inside every admin Server Action / Route Handler.
  await requireAdmin();

  // At-a-glance guard against editing the wrong guest list: amber DEV on the
  // playground (preview/local); the real thing carries no badge.
  const env = getAppEnv();
  const isProd = env === "production";

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
            {!isProd && (
              <span
                title={`Environment: ${env}`}
                className="ml-1 self-center rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-300"
              >
                Dev
              </span>
            )}
          </Link>
          <div className="flex items-center gap-2">
            <RefreshButton />
            <SettingsLink />
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
