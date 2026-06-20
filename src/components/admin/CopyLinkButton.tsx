"use client";

import { useState } from "react";
import { Check, LinkSimple } from "@phosphor-icons/react";

export default function CopyLinkButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = `${window.location.origin}/rsvp/${token}`;
    try {
      // navigator.clipboard needs a secure context (https/localhost); fall
      // back to execCommand when serving over plain http on the LAN.
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const area = document.createElement("textarea");
        area.value = url;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Last resort: surface the URL so it can be copied manually.
      window.prompt("Copy this invite link:", url);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy invite link"
      className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100"
    >
      {copied ? (
        <Check size={13} weight="bold" className="text-burgundy" />
      ) : (
        <LinkSimple size={13} />
      )}
      {copied ? "Copied" : "Link"}
    </button>
  );
}
