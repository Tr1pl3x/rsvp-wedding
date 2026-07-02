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
          background: "radial-gradient(circle at 35% 30%, #d4ad82, #c49a6c 55%, #a67b4e 100%)",
          borderRadius: 16,
          color: "#601530",
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
