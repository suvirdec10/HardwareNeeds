import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        }}
      >
        <svg width="112" height="112" viewBox="0 0 24 24" fill="none">
          <path d="M7 6V18" stroke="#f3f4f6" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M17 6V18" stroke="#f3f4f6" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M7 9.5H11L17 14.5" stroke="#4c8dff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="11" cy="9.5" r="1.15" fill="#4c8dff" />
        </svg>
      </div>
    ),
    size,
  );
}
