import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Home-screen icon (iOS "Add to Home Screen"): wax seal on burgundy.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const greatVibes = await readFile(
    join(process.cwd(), "src/assets/fonts/GreatVibes-subset.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #4a1528, #601530)",
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(circle at 35% 30%, #d4ad82, #c49a6c 55%, #a67b4e 100%)",
            borderRadius: 999,
            color: "#601530",
            fontFamily: "Great Vibes",
            fontSize: 42,
            paddingTop: 6,
          }}
        >
          H&S
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Great Vibes", data: greatVibes, style: "normal", weight: 400 },
      ],
    },
  );
}
