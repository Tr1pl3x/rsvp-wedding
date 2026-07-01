import Link from "next/link";
import SettingsForm from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-800"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M10 3 5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to guest list
        </Link>
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-zinc-900">
          Settings
        </h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          Customize the invite message, the RSVP deadline, and the default view.
        </p>
      </div>

      <div className="max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
