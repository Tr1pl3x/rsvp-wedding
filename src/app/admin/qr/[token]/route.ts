import QRCode from "qrcode";
import { isAdmin } from "@/lib/admin-session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  if (!(await isAdmin())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { token } = await params;
  // Encode the same-origin invite URL so a scan opens the guest's page on
  // whatever host the admin is browsing from (localhost or the LAN IP).
  const origin = new URL(request.url).origin;
  const target = `${origin}/rsvp/${token}`;

  const png = await QRCode.toBuffer(target, {
    width: 320,
    margin: 1,
    color: { dark: "#601530", light: "#fff8f3" },
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  });
}
