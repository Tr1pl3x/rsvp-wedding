import { ImageResponse } from "next/og";

// Browser-tab favicon: a tiny gold wax seal.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 35% 30%, #e1bb8a, #c09668 55%, #a1764a 100%)",
          borderRadius: 16,
          color: "#4b382a",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        H&S
      </div>
    ),
    size,
  );
}
