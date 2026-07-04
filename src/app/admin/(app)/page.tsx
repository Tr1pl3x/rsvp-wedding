import { DISHES } from "@/components/guest/rsvp/menu";
import { listGuests } from "@/lib/guests";
import { getSettings } from "@/lib/settings";
import { WEDDING } from "@/lib/wedding";
import AddGuest from "@/components/admin/AddGuest";
import GuestManager from "@/components/admin/GuestManager";
import MealsSummary from "@/components/admin/MealsSummary";
import StatsBar from "@/components/admin/StatsBar";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [guests, settings] = await Promise.all([listGuests(), getSettings()]);

  const responded = guests.filter((guest) => guest.status === "responded");
  const attending = responded.filter(
    (guest) => guest.response?.attending === "yes",
  );
  const declined = responded.filter(
    (guest) => guest.response?.attending === "no",
  );

  // One guest = one meal, so tallies are simple counts over attending guests.
  const mealCounts = new Map<string, number>();
  for (const guest of attending) {
    const id = guest.response?.mealId;
    if (id) mealCounts.set(id, (mealCounts.get(id) ?? 0) + 1);
  }
  const tallies = DISHES.map((dish) => ({
    label: dish.label,
    count: mealCounts.get(dish.id) ?? 0,
  }));
  // Defensive: surface attending guests without a chosen dish so the pills
  // always add up to the attending total (normally zero — dish is required).
  const chosenMeals = tallies.reduce((sum, t) => sum + t.count, 0);
  if (attending.length > chosenMeals) {
    tallies.push({ label: "Unspecified", count: attending.length - chosenMeals });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            Guest List
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            {WEDDING.coupleNames} &middot; {WEDDING.date}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/admin/export"
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            Export CSV
          </a>
          <AddGuest />
        </div>
      </div>

      <StatsBar
        total={guests.length}
        responded={responded.length}
        attending={attending.length}
        declined={declined.length}
        pending={guests.length - responded.length}
      />

      <MealsSummary tallies={tallies} attendingCount={attending.length} />

      <GuestManager
        guests={guests}
        messageTemplate={settings.messageTemplate}
        deadline={settings.rsvpDeadline}
        defaultFilter={settings.defaultFilter}
        defaultSort={settings.defaultSort}
      />
    </div>
  );
}
