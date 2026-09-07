import { ImageResponse } from "next/og";

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
          background: "#0c0d10",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: 2,
            background: "#4c8dff",
          }}
        />
      </div>
    ),
    size,
  );
}
