"use client";

import { useState } from "react";
import { PencilSimple, QrCode, Trash } from "@phosphor-icons/react";
import { dishById } from "@/components/guest/rsvp/menu";
import type { Guest, GuestStatus } from "@/lib/guests";
import { editGuest, removeGuest } from "@/lib/admin-actions";
import CopyLinkButton from "./CopyLinkButton";
import SubmitButton from "./SubmitButton";

const STATUS_STYLE: Record<GuestStatus, { dot: string; label: string }> = {
  responded: { dot: "bg-burgundy", label: "Responded" },
  sent: { dot: "bg-amber-400", label: "Sent" },
  not_sent: { dot: "bg-zinc-300", label: "Not sent" },
};

function StatusPill({ status }: { status: GuestStatus }) {
  const style = STATUS_STYLE[status];
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm text-zinc-700">
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}

function notesText(guest: Guest): string | null {
  const text =
    guest.response?.attending === "yes"
      ? guest.response.dietary
      : guest.response?.note;
  return text || null;
}

function Attending({ guest }: { guest: Guest }) {
  const attending = guest.response?.attending;
  if (attending === "yes")
    return <span className="font-medium text-burgundy">Yes</span>;
  if (attending === "no") return <span className="text-zinc-500">No</span>;
  return <span className="text-zinc-300">—</span>;
}

function InviteActions({ token }: { token: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <CopyLinkButton token={token} />
      <a
        href={`/admin/qr/${token}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Open QR code"
        className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100"
      >
        <QrCode size={13} aria-hidden />
        QR
      </a>
    </div>
  );
}

function RowActions({
  guest,
  onEdit,
}: {
  guest: Guest;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onEdit}
        title="Edit guest"
        aria-label={`Edit ${guest.name}`}
        className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
      >
        <PencilSimple size={15} aria-hidden />
      </button>
      <form
        action={removeGuest}
        onSubmit={(event) => {
          if (!window.confirm(`Remove ${guest.name}?`)) event.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={guest.id} />
        <SubmitButton
          ariaLabel={`Delete ${guest.name}`}
          title="Delete guest"
          className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          <Trash size={15} aria-hidden />
        </SubmitButton>
      </form>
    </div>
  );
}

function EditForm({ guest, onDone }: { guest: Guest; onDone: () => void }) {
  return (
    <form
      action={async (formData) => {
        await editGuest(formData);
        onDone();
      }}
      className="flex flex-wrap items-end gap-2"
    >
      <input type="hidden" name="id" value={guest.id} />
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`edit-name-${guest.id}`}
          className="text-xs text-zinc-500"
        >
          Name
        </label>
        <input
          id={`edit-name-${guest.id}`}
          name="name"
          defaultValue={guest.name}
          required
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm focus:border-burgundy focus:outline-none"
        />
      </div>
      <div className="flex w-20 flex-col gap-1">
        <label
          htmlFor={`edit-seats-${guest.id}`}
          className="text-xs text-zinc-500"
        >
          Seats
        </label>
        <input
          id={`edit-seats-${guest.id}`}
          name="maxGuests"
          type="number"
          min={1}
          defaultValue={guest.maxGuests}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm focus:border-burgundy focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`edit-status-${guest.id}`}
          className="text-xs text-zinc-500"
        >
          Status
        </label>
        <select
          id={`edit-status-${guest.id}`}
          name="status"
          defaultValue={guest.status}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm focus:border-burgundy focus:outline-none"
        >
          <option value="not_sent">Not sent</option>
          <option value="sent">Sent</option>
          <option value="responded">Responded</option>
        </select>
      </div>
      <SubmitButton
        pendingText="Saving…"
        className="rounded-lg bg-burgundy px-3 py-1.5 text-sm font-semibold text-white hover:bg-burgundy-dark"
      >
        Save
      </SubmitButton>
      <button
        type="button"
        onClick={onDone}
        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100"
      >
        Cancel
      </button>
    </form>
  );
}

export default function GuestTable({ guests }: { guests: Guest[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const close = () => setEditingId(null);

  if (guests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
        <p className="text-sm font-medium text-zinc-700">No guests yet</p>
        <p className="mt-1 text-sm text-zinc-500">
          Add your first guest above to generate their invite link.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-zinc-200 bg-white sm:block">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-200 text-xs font-medium uppercase tracking-wide text-zinc-400">
              <th className="px-4 py-3">Guest</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Attending</th>
              <th className="px-4 py-3">Meal</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Invite</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {guests.map((guest) => {
              const dish = dishById(guest.response?.mealId ?? null);
              const notes = notesText(guest);

              if (editingId === guest.id) {
                return (
                  <tr key={guest.id} className="bg-zinc-50">
                    <td colSpan={7} className="px-4 py-3">
                      <EditForm guest={guest} onDone={close} />
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={guest.id} className="align-top hover:bg-zinc-50/60">
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-900">{guest.name}</p>
                    <p className="font-mono text-xs text-zinc-400">
                      {guest.token}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={guest.status} />
                    {guest.respondedAt && (
                      <p className="mt-0.5 font-mono text-xs text-zinc-400">
                        {guest.respondedAt.slice(0, 10)}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Attending guest={guest} />
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-700">
                    {dish ? dish.label : <span className="text-zinc-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {notes ? (
                      <span className="line-clamp-2 max-w-[16rem] text-sm text-zinc-600">
                        {notes}
                      </span>
                    ) : (
                      <span className="text-zinc-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <InviteActions token={guest.token} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <RowActions
                        guest={guest}
                        onEdit={() => setEditingId(guest.id)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {guests.map((guest) => {
          const dish = dishById(guest.response?.mealId ?? null);
          const notes = notesText(guest);

          return (
            <div
              key={guest.id}
              className="rounded-xl border border-zinc-200 bg-white p-4"
            >
              {editingId === guest.id ? (
                <EditForm guest={guest} onDone={close} />
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-900">{guest.name}</p>
                      <p className="truncate font-mono text-xs text-zinc-400">
                        {guest.token}
                      </p>
                    </div>
                    <RowActions
                      guest={guest}
                      onEdit={() => setEditingId(guest.id)}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                    <StatusPill status={guest.status} />
                    <span className="text-zinc-500">
                      Attending: <Attending guest={guest} />
                    </span>
                    {dish && (
                      <span className="text-zinc-700">{dish.label}</span>
                    )}
                  </div>

                  {notes && (
                    <p className="mt-2 text-sm text-zinc-600">{notes}</p>
                  )}

                  <div className="mt-3">
                    <InviteActions token={guest.token} />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
