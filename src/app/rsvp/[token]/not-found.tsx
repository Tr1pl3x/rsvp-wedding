import { FloralDivider } from "@/components/guest/FloralElements";

// Shown when getGuestByToken returns null for either the invitation or the
// respond page (notFound() bubbles to this nearest boundary).
export default function GuestNotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-cream px-6 text-center">
      <FloralDivider className="h-9 w-48 text-gold/60" />
      <h1 className="font-script mt-6 text-5xl text-burgundy">
        Invitation Not Found
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-charcoal/70">
        This link doesn&apos;t match an invitation — it may be mistyped or
        out of date. Please open the link exactly as it appears in your invite.
      </p>
      <p className="mt-6 max-w-sm text-xs leading-relaxed text-charcoal/60">
        Still stuck? Contact our wedding organizer Amelia at{" "}
        <a
          href="tel:+31684396988"
          className="text-burgundy underline-offset-2 hover:underline"
        >
          +31 684 396 988
        </a>
        .
      </p>
    </main>
  );
}
