type Tally = { label: string; count: number };

// One guest = one meal, so the pills add up to the attending-guest total.
export default function MealsSummary({
  tallies,
  attendingCount,
}: {
  tallies: Tally[];
  attendingCount: number;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white px-5 py-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Meals
        </p>
        <p className="text-xs text-zinc-500">
          for{" "}
          <span className="font-mono tabular-nums font-semibold text-burgundy">
            {attendingCount}
          </span>{" "}
          attending {attendingCount === 1 ? "guest" : "guests"}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {tallies.map((tally) => (
          <span
            key={tally.label}
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 text-sm text-zinc-700"
          >
            <span className="font-mono tabular-nums font-semibold text-burgundy">
              {tally.count}
            </span>
            {tally.label}
          </span>
        ))}
      </div>
    </section>
  );
}
