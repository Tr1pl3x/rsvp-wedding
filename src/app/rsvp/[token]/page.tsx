import { notFound } from "next/navigation";
import WeddingPage from "@/components/guest/WeddingPage";
import { formatDeadline } from "@/lib/deadline";
import { getGuestByToken } from "@/lib/guests";
import { getSettings } from "@/lib/settings";

// Force a per-request render: awaiting params alone does NOT opt out of static
// rendering in Next 16, and we need a fresh guest lookup on every visit.
export const dynamic = "force-dynamic";

// Personal tokenized links — keep them out of search indexes.
export const metadata = { robots: { index: false, follow: false } };

export default async function GuestRsvpPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const [guest, settings] = await Promise.all([
    getGuestByToken(token),
    getSettings(),
  ]);
  if (!guest) notFound();

  // The invite greets with the guest's name exactly as entered in the admin.
  return (
    <WeddingPage
      guestName={guest.name}
      token={token}
      deadline={formatDeadline(settings.rsvpDeadline)}
    />
  );
}
