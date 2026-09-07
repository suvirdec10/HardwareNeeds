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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M7 6V18" stroke="#f3f4f6" strokeWidth="2" strokeLinecap="round" />
          <path d="M17 6V18" stroke="#f3f4f6" strokeWidth="2" strokeLinecap="round" />
          <path d="M7 9.5H11L17 14.5" stroke="#4c8dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="11" cy="9.5" r="1.3" fill="#4c8dff" />
        </svg>
      </div>
    ),
    size,
  );
}
