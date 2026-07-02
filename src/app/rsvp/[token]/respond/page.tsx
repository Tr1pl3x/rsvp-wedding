import { notFound } from "next/navigation";
import RsvpExperience from "@/components/guest/rsvp/RsvpExperience";
import { getGuestByToken } from "@/lib/guests";
import { getSettings } from "@/lib/settings";

// Fresh read every visit so a returning guest who already submitted lands
// straight on their confirmation (the return-visit behavior).
export const dynamic = "force-dynamic";

export default async function RespondPage({
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

  return (
    <RsvpExperience
      token={token}
      guestName={guest.name}
      initialAnswers={guest.response}
      deadline={settings.rsvpDeadline}
    />
  );
}
