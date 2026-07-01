"use client";

import { MagnifyingGlass } from "@phosphor-icons/react";
import {
  FILTERS,
  SORTS,
  type GuestFilter,
  type GuestSort,
} from "@/lib/guest-views";

type Props = {
  search: string;
  onSearch: (value: string) => void;
  filter: GuestFilter;
  onFilter: (value: GuestFilter) => void;
  sort: GuestSort;
  onSort: (value: GuestSort) => void;
  count: number;
  total: number;
};

const selectClass =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy";

export default function GuestControls({
  search,
  onSearch,
  filter,
  onFilter,
  sort,
  onSort,
  count,
  total,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      {/* Search full-width on mobile; filter + sort share a row beneath it.
          All three sit inline from sm: up. */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative sm:flex-1">
          <MagnifyingGlass
            size={15}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search by name…"
            aria-label="Search guests by name"
            className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:w-auto">
          <label htmlFor="filter" className="sr-only">
            Filter
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(event) => onFilter(event.target.value as GuestFilter)}
            className={`w-full sm:w-auto ${selectClass}`}
          >
            {FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                Filter: {f.label}
              </option>
            ))}
          </select>

          <label htmlFor="sort" className="sr-only">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => onSort(event.target.value as GuestSort)}
            className={`w-full sm:w-auto ${selectClass}`}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                Sort: {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-zinc-400" aria-live="polite">
        Showing {count} of {total} {total === 1 ? "guest" : "guests"}
      </p>
    </div>
  );
}
