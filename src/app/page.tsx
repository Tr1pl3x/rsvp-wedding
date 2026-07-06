import { FloralDivider } from "@/components/guest/FloralElements";
import { WEDDING } from "@/lib/wedding";

// The public front door. Guests should arrive via their personal invite link;
// anyone landing on the bare domain gets a graceful pointer instead of a
// dev-only redirect.
export default function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-latte px-6 text-center text-burgundy-dark">
      <p className="text-xs uppercase tracking-[0.3em] text-burgundy-dark">
        Wedding Day
      </p>
      <p className="mt-3 text-sm tracking-[0.25em] text-burgundy-dark">
        21<sup className="text-[0.65em] leading-none">st</sup> Dec 2026
      </p>

      <h1 className="font-script mt-8 leading-tight">
        <span className="block text-6xl md:text-8xl">Harry</span>
        <span className="block text-4xl text-burgundy md:text-5xl">
          &amp;
        </span>
        <span className="block text-6xl md:text-8xl">Susan</span>
      </h1>

      <FloralDivider className="mt-10 h-10 w-56 text-burgundy/50" />

      <p className="mt-8 max-w-sm text-sm leading-relaxed text-burgundy-dark">
        {WEDDING.venue}
        <br />
        Hua Hin, Thailand
      </p>
      <p className="mt-6 max-w-sm text-sm leading-relaxed text-burgundy-dark">
        Invitations are personal — please open the link sent to you to view
        yours and RSVP.
      </p>
      <p className="mt-4 max-w-sm text-xs leading-relaxed text-burgundy-dark">
        Can&apos;t find your link? Contact our wedding organizer Amelia at{" "}
        <a
          href="tel:+31684396988"
          className="font-semibold underline-offset-2 hover:underline"
        >
          +31 684 396 988
        </a>
        .
      </p>
    </main>
  );
}
