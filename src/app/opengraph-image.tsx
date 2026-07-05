import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { WEDDING } from "@/lib/wedding";

// Site-wide link-preview card (WhatsApp/Messenger/iMessage read og:*).
// Static content -> generated once at build and cached.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${WEDDING.coupleNames} — Wedding Invitation`;

export default async function OpengraphImage() {
  // Satori needs font bytes; woff2 unsupported, so subsetted local TTFs.
  const [greatVibes, geist] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/GreatVibes-subset.ttf")),
    readFile(join(process.cwd(), "src/assets/fonts/Geist-subset.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #38291e 0%, #4b382a 50%, #38291e 100%)",
          color: "#fbf3e7",
        }}
      >
        {/* Thin double gold frame */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: "2px solid rgba(192,150,104,0.6)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            right: 40,
            bottom: 40,
            border: "1px solid rgba(192,150,104,0.3)",
            display: "flex",
          }}
        />

        <div
          style={{
            fontFamily: "Geist",
            fontSize: 26,
            letterSpacing: 12,
            textTransform: "uppercase",
            color: "#e1bb8a",
          }}
        >
          Wedding Day
        </div>
        <div
          style={{
            fontFamily: "Geist",
            fontSize: 28,
            letterSpacing: 8,
            marginTop: 18,
            color: "rgba(251,243,231,0.85)",
          }}
        >
          21 . 12 . 2026
        </div>
        <div
          style={{
            fontFamily: "Great Vibes",
            fontSize: 150,
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            gap: 30,
          }}
        >
          <span>Harry</span>
          <span style={{ fontSize: 90, color: "#e1bb8a" }}>&amp;</span>
          <span>Susan</span>
        </div>
        <div
          style={{
            fontFamily: "Geist",
            fontSize: 24,
            marginTop: 20,
            color: "rgba(251,243,231,0.8)",
          }}
        >
          {`${WEDDING.venue} · Hua Hin, Thailand`}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Great Vibes",
          data: greatVibes,
          style: "normal",
          weight: 400,
        },
        { name: "Geist", data: geist, style: "normal", weight: 500 },
      ],
    },
  );
}
