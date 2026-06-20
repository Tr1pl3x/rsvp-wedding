import { notFound } from "next/navigation";
import RsvpExperience from "@/components/guest/rsvp/RsvpExperience";
import { getGuestByToken } from "@/lib/guests";

// Fresh read every visit so a returning guest who already submitted lands
// straight on their confirmation (the return-visit behavior).
export const dynamic = "force-dynamic";

export default async function RespondPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const guest = await getGuestByToken(token);
  if (!guest) notFound();

  const firstName = guest.name.split(" ")[0];

  return (
    <RsvpExperience
      token={token}
      guestName={firstName}
      initialAnswers={guest.response}
    />
  );
}
