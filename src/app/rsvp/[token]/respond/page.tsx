import { notFound } from "next/navigation";
import RsvpClosed from "@/components/guest/rsvp/RsvpClosed";
import RsvpExperience from "@/components/guest/rsvp/RsvpExperience";
import { formatDeadline, isDeadlinePassed } from "@/lib/deadline";
import { getGuestByToken } from "@/lib/guests";
import { getSettings } from "@/lib/settings";

// Fresh read every visit so a returning guest who already submitted lands
// straight on their confirmation (the return-visit behavior).
export const dynamic = "force-dynamic";

// Personal tokenized links — keep them out of search indexes.
export const metadata = { robots: { index: false, follow: false } };

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

  const deadline = formatDeadline(settings.rsvpDeadline);

  // Once the window ends (end of the deadline day, venue time), guests who
  // never answered get a graceful notice; guests who did answer still land on
  // their confirmation below. saveRsvp re-checks server-side regardless.
  if (isDeadlinePassed(settings.rsvpDeadline) && !guest.response) {
    return <RsvpClosed token={token} deadline={deadline} />;
  }

  return (
    <RsvpExperience
      token={token}
      guestName={guest.name}
      initialAnswers={guest.response}
      deadline={deadline}
    />
  );
}
