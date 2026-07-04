"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus } from "@phosphor-icons/react";
import { addGuest } from "@/lib/admin-actions";
import ModalShell from "./ModalShell";
import SubmitButton from "./SubmitButton";

const inputClass =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy";

export default function AddGuest() {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-burgundy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-burgundy-dark"
      >
        <Plus size={15} weight="bold" aria-hidden />
        Add guest
      </button>

      <AnimatePresence>
        {open && (
          <ModalShell title="Add guest" size="sm" onClose={() => setOpen(false)}>
            <form
              ref={formRef}
              action={async (formData) => {
                await addGuest(formData);
                formRef.current?.reset();
                setOpen(false);
              }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="new-name"
                  className="text-sm font-medium text-zinc-700"
                >
                  Guest name
                </label>
                <input
                  id="new-name"
                  name="name"
                  required
                  autoFocus
                  placeholder="e.g. Eliza Hartman"
                  className={inputClass}
                />
                <p className="text-xs text-zinc-400">
                  Every guest gets their own personal invite link.
                </p>
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <SubmitButton
                  pendingText="Adding…"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-burgundy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-burgundy-dark"
                >
                  <Plus size={15} weight="bold" aria-hidden />
                  Add guest
                </SubmitButton>
              </div>
            </form>
          </ModalShell>
        )}
      </AnimatePresence>
    </>
  );
}
