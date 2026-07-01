type StatsBarProps = {
  total: number;
  responded: number;
  attending: number;
  declined: number;
  pending: number;
};

function Stat({
  value,
  label,
  accent = false,
}: {
  value: number | string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="px-5 py-4">
      <p
        className={`font-mono text-2xl tabular-nums ${
          accent ? "text-burgundy" : "text-zinc-900"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
    </div>
  );
}

export default function StatsBar({
  total,
  responded,
  attending,
  declined,
  pending,
}: StatsBarProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div className="grid grid-cols-2 divide-x divide-y divide-zinc-100 sm:grid-cols-4 sm:divide-y-0">
        <Stat value={`${responded}/${total}`} label="Responded" accent />
        <Stat value={attending} label="Attending" />
        <Stat value={declined} label="Declined" />
        <Stat value={pending} label="Awaiting" />
      </div>
    </section>
  );
}
