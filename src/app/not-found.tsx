import { FloralDivider } from "@/components/guest/FloralElements";

// Root 404 — catches every unmatched URL (e.g. /foo, /rsvp with no token).
// Invalid *tokens* render the more specific rsvp/[token]/not-found.tsx.
export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-cream px-6 text-center">
      <FloralDivider className="h-9 w-48 text-gold/60" />
      <h1 className="font-script mt-6 text-5xl text-burgundy">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-charcoal/70">
        This page doesn&apos;t exist. If you&apos;re looking for your
        invitation, please open the personal link sent to you.
      </p>
      <p className="mt-6 max-w-sm text-xs leading-relaxed text-charcoal/60">
        Need help? Contact our wedding organizer Amelia at{" "}
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
