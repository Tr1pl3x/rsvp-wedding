import { DISHES } from "@/components/guest/rsvp/menu";
import { listGuests } from "@/lib/guests";
import AddGuestForm from "@/components/admin/AddGuestForm";
import GuestTable from "@/components/admin/GuestTable";
import StatsBar from "@/components/admin/StatsBar";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const guests = await listGuests();

  const responded = guests.filter((guest) => guest.status === "responded");
  const attending = responded.filter(
    (guest) => guest.response?.attending === "yes",
  );
  const declined = responded.filter(
    (guest) => guest.response?.attending === "no",
  );

  const mealCounts = new Map<string, number>();
  for (const guest of attending) {
    const id = guest.response?.mealId;
    if (id) mealCounts.set(id, (mealCounts.get(id) ?? 0) + 1);
  }
  const tallies = DISHES.map((dish) => ({
    label: dish.label,
    count: mealCounts.get(dish.id) ?? 0,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            Guest List
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Harry &amp; Susan &middot; 21 December 2026
          </p>
        </div>
        <a
          href="/admin/export"
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
        >
          Export CSV
        </a>
      </div>

      <StatsBar
        total={guests.length}
        responded={responded.length}
        attending={attending.length}
        declined={declined.length}
        pending={guests.length - responded.length}
        tallies={tallies}
      />

      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <AddGuestForm />
      </div>

      <GuestTable guests={guests} />
    </div>
  );
}
