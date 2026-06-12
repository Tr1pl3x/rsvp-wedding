import WeddingPage from "@/components/guest/WeddingPage";

// Phase 4: look up the guest by token (SSR) and pass real data.
// Until then this renders the static mockup with placeholder guest data.
export default async function GuestRsvpPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  await params;

  return <WeddingPage guestName="Isabelle" />;
}
