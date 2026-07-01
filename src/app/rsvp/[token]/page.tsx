import { notFound } from "next/navigation";
import WeddingPage from "@/components/guest/WeddingPage";
import { getGuestByToken } from "@/lib/guests";
import { getSettings } from "@/lib/settings";

// Force a per-request render: awaiting params alone does NOT opt out of static
// rendering in Next 16, and we need a fresh guest lookup on every visit.
export const dynamic = "force-dynamic";

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

  // Greet by first name for warmth; the full name is kept for the admin side.
  const firstName = guest.name.split(" ")[0];

  return (
    <WeddingPage
      guestName={firstName}
      token={token}
      deadline={settings.rsvpDeadline}
    />
  );
}
