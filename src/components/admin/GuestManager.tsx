"use client";

import { useMemo, useState } from "react";
import { applyView, type GuestFilter, type GuestSort } from "@/lib/guest-views";
import type { Guest } from "@/lib/guests";
import GuestControls from "./GuestControls";
import GuestTable from "./GuestTable";

type Props = {
  guests: Guest[];
  messageTemplate: string;
  deadline: string;
  defaultFilter: GuestFilter;
  defaultSort: GuestSort;
};

export default function GuestManager({
  guests,
  messageTemplate,
  deadline,
  defaultFilter,
  defaultSort,
}: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<GuestFilter>(defaultFilter);
  const [sort, setSort] = useState<GuestSort>(defaultSort);

  const visible = useMemo(
    () => applyView(guests, { search, filter, sort }),
    [guests, search, filter, sort],
  );

  return (
    <div className="flex flex-col gap-4">
      <GuestControls
        search={search}
        onSearch={setSearch}
        filter={filter}
        onFilter={setFilter}
        sort={sort}
        onSort={setSort}
        count={visible.length}
        total={guests.length}
      />
      <GuestTable
        guests={visible}
        totalGuests={guests.length}
        messageTemplate={messageTemplate}
        deadline={deadline}
      />
    </div>
  );
}
