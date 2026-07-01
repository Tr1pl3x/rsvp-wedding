import { dishById } from "@/components/guest/rsvp/menu";
import { isAdmin } from "@/lib/admin-session";
import { listGuests } from "@/lib/guests";

function cell(value: string): string {
  let s = String(value ?? "");
  // Neutralize spreadsheet formula injection: guest name/dietary/note are
  // attacker-controllable via the public RSVP, and a leading = + - @ would be
  // executed as a formula when the admin opens the CSV in Excel/Sheets.
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  if (!(await isAdmin())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const guests = await listGuests();
  const rows: string[][] = [
    [
      "Name",
      "Seats",
      "Token",
      "Status",
      "Attending",
      "Meal",
      "Dietary",
      "Note",
      "Responded At",
    ],
  ];

  for (const guest of guests) {
    rows.push([
      guest.name,
      String(guest.maxGuests),
      guest.token,
      guest.status,
      guest.response?.attending ?? "",
      dishById(guest.response?.mealId ?? null)?.name ?? "",
      guest.response?.dietary ?? "",
      guest.response?.note ?? "",
      guest.respondedAt ?? "",
    ]);
  }

  const csv = rows.map((row) => row.map(cell).join(",")).join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="guest-list.csv"',
      "Cache-Control": "no-store",
    },
  });
}
