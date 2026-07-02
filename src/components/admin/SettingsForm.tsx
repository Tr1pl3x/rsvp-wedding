"use client";

import { useState } from "react";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import { saveSettings } from "@/lib/admin-actions";
import { DEFAULT_MESSAGE_TEMPLATE } from "@/lib/template";
import type { AppSettings } from "@/lib/settings";
import { FILTERS, SORTS } from "@/lib/guest-views";
import SubmitButton from "./SubmitButton";

const inputClass =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy";

export default function SettingsForm({ settings }: { settings: AppSettings }) {
  const [message, setMessage] = useState(settings.messageTemplate);
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={async (formData) => {
        await saveSettings(formData);
        setSaved(true);
      }}
      className="flex flex-col gap-8"
    >
      <section className="flex flex-col gap-2">
        <label
          htmlFor="messageTemplate"
          className="text-sm font-medium text-zinc-800"
        >
          Invite message
        </label>
        <p className="text-xs text-zinc-500">
          This is copied for each guest. Placeholders:{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px] text-zinc-700">
            {"{name} {link} {date} {venue} {deadline}"}
          </code>
        </p>
        <textarea
          id="messageTemplate"
          name="messageTemplate"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            setSaved(false);
          }}
          rows={4}
          className={`resize-none ${inputClass}`}
        />
        <button
          type="button"
          onClick={() => {
            setMessage(DEFAULT_MESSAGE_TEMPLATE);
            setSaved(false);
          }}
          className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-burgundy"
        >
          <ArrowCounterClockwise size={13} aria-hidden />
          Reset to default
        </button>
      </section>

      <section className="flex flex-col gap-2">
        <label
          htmlFor="rsvpDeadline"
          className="text-sm font-medium text-zinc-800"
        >
          RSVP deadline
        </label>
        <p className="text-xs text-zinc-500">
          Shown on the guest invitation and RSVP form.
        </p>
        <input
          id="rsvpDeadline"
          name="rsvpDeadline"
          defaultValue={settings.rsvpDeadline}
          onChange={() => setSaved(false)}
          className={`max-w-xs ${inputClass}`}
        />
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-800">Default guest view</p>
          <p className="text-xs text-zinc-500">
            How the guest list is filtered and sorted when you open it.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="defaultFilter"
              className="text-xs text-zinc-500"
            >
              Filter
            </label>
            <select
              id="defaultFilter"
              name="defaultFilter"
              defaultValue={settings.defaultFilter}
              onChange={() => setSaved(false)}
              className={inputClass}
            >
              {FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="defaultSort" className="text-xs text-zinc-500">
              Sort
            </label>
            <select
              id="defaultSort"
              name="defaultSort"
              defaultValue={settings.defaultSort}
              onChange={() => setSaved(false)}
              className={inputClass}
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <SubmitButton
          pendingText="Saving…"
          className="rounded-lg bg-burgundy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-burgundy-dark"
        >
          Save settings
        </SubmitButton>
        {saved && (
          <span className="text-sm text-zinc-500" role="status">
            Saved.
          </span>
        )}
      </div>
    </form>
  );
}
