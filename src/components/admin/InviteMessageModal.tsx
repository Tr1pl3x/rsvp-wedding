"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { renderTemplate } from "@/lib/template";
import { markGuestSent } from "@/lib/admin-actions";
import { WEDDING } from "@/lib/wedding";
import type { Guest } from "@/lib/guests";
import ModalShell from "./ModalShell";

type Props = {
  guest: Guest;
  template: string;
  deadline: string;
  onClose: () => void;
};

export default function InviteMessageModal({
  guest,
  template,
  deadline,
  onClose,
}: Props) {
  const [copied, setCopied] = useState(false);

  // Computed synchronously — the modal only mounts client-side (on click), so
  // window.location is available and there's no empty first paint.
  const [message] = useState(() =>
    renderTemplate(template, {
      name: guest.name,
      link: `${window.location.origin}/rsvp/${guest.token}`,
      date: WEDDING.date,
      venue: WEDDING.venue,
      deadline,
    }),
  );

  const copy = async () => {
    // Clipboard first, with its own fallback.
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(message);
      } else {
        const area = document.createElement("textarea");
        area.value = message;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this message:", message);
      return;
    }
    // Best-effort status update — must not re-trigger the copy fallback.
    try {
      await markGuestSent(guest.id);
    } catch {
      // ignore
    }
  };

  return (
    <ModalShell
      title="Invite message"
      subtitle={`For ${guest.name}`}
      onClose={onClose}
    >
      <div className="whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-700">
        {message}
      </div>
      <p className="mt-2 text-xs text-zinc-400">
        Copying marks this guest as &ldquo;sent&rdquo;.
      </p>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Message copied" : ""}
      </span>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100"
        >
          Close
        </button>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg bg-burgundy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-burgundy-dark"
        >
          {copied ? (
            <>
              <Check size={15} weight="bold" aria-hidden />
              Copied
            </>
          ) : (
            <>
              <Copy size={15} aria-hidden />
              Copy message
            </>
          )}
        </button>
      </div>
    </ModalShell>
  );
}
