"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import {
  createAdminSession,
  destroyAdminSession,
  requireAdmin,
} from "@/lib/admin-session";
import {
  createGuest,
  deleteGuest,
  markSent,
  updateGuest,
  type GuestStatus,
} from "@/lib/guests";
import { updateSettings } from "@/lib/settings";
import { isFilter, isSort } from "@/lib/guest-views";

export type LoginState = { error: string } | null;

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const supplied = String(formData.get("password") ?? "");
  // Fail closed: a missing ADMIN_PASSWORD must never authenticate (an empty
  // expected + empty supplied would otherwise pass timingSafeEqual).
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD is not set");
  if (!supplied) return { error: "Incorrect password." };

  // Constant-time comparison; equal-length guard avoids leaking length.
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  const ok = a.length === b.length && timingSafeEqual(a, b);
  if (!ok) return { error: "Incorrect password." };

  await createAdminSession();
  redirect("/admin");
}

export async function logout() {
  await destroyAdminSession();
  redirect("/admin/login");
}

// All mutations re-verify admin — a Server Action is reachable by direct POST,
// so the layout gate alone is not sufficient.
export async function addGuest(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim().slice(0, 200);
  if (!name) return;
  const maxGuests = Number(formData.get("maxGuests") ?? 1) || 1;
  await createGuest(name, maxGuests);
  revalidatePath("/admin");
}

export async function editGuest(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim().slice(0, 200);
  const maxGuests = Number(formData.get("maxGuests") ?? 1) || 1;
  const raw = String(formData.get("status") ?? "sent");
  const allowed: GuestStatus[] = ["not_sent", "sent", "responded"];
  const status: GuestStatus = allowed.includes(raw as GuestStatus)
    ? (raw as GuestStatus)
    : "sent";
  if (!id || !name) return;
  await updateGuest(id, { name, maxGuests, status });
  revalidatePath("/admin");
}

export async function removeGuest(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteGuest(id);
  revalidatePath("/admin");
}

// Called when the admin copies a guest's invite message. Upgrades not_sent ->
// sent (never downgrades a responded guest — see markSent in guests.ts).
export async function markGuestSent(id: string) {
  await requireAdmin();
  if (!id) return;
  await markSent(id);
  revalidatePath("/admin");
}

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const messageTemplate = String(formData.get("messageTemplate") ?? "")
    .trim()
    .slice(0, 5000);
  const rsvpDeadline = String(formData.get("rsvpDeadline") ?? "")
    .trim()
    .slice(0, 200);
  const rawFilter = String(formData.get("defaultFilter") ?? "everyone");
  const rawSort = String(formData.get("defaultSort") ?? "newest");
  await updateSettings({
    messageTemplate,
    rsvpDeadline,
    defaultFilter: isFilter(rawFilter) ? rawFilter : "everyone",
    defaultSort: isSort(rawSort) ? rawSort : "newest",
  });
  // Guest pages read the deadline live (force-dynamic), so only the admin
  // views need revalidating here.
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
}
