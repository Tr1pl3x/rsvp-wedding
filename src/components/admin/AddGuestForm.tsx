"use client";

import { useRef } from "react";
import { Plus } from "@phosphor-icons/react";
import { addGuest } from "@/lib/admin-actions";
import SubmitButton from "./SubmitButton";

export default function AddGuestForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addGuest(formData);
        formRef.current?.reset();
      }}
      className="flex flex-wrap items-end gap-2"
    >
      <div className="flex min-w-[12rem] flex-1 flex-col gap-1">
        <label htmlFor="new-name" className="text-xs font-medium text-zinc-500">
          Guest name
        </label>
        <input
          id="new-name"
          name="name"
          required
          placeholder="e.g. Eliza Hartman"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy"
        />
      </div>
      <div className="flex w-20 flex-col gap-1">
        <label htmlFor="new-max" className="text-xs font-medium text-zinc-500">
          Seats
        </label>
        <input
          id="new-max"
          name="maxGuests"
          type="number"
          min={1}
          defaultValue={1}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy"
        />
      </div>
      <SubmitButton
        pendingText="Adding…"
        className="inline-flex items-center gap-1.5 rounded-lg bg-burgundy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-burgundy-dark"
      >
        <Plus size={15} weight="bold" aria-hidden />
        Add guest
      </SubmitButton>
    </form>
  );
}
