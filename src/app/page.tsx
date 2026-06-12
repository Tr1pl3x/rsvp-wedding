import { redirect } from "next/navigation";

// Dev-only convenience: jump straight to the mock guest page.
// Phase 4 replaces this with a real landing / not-found experience.
export default function Home() {
  redirect("/rsvp/test-token");
}
