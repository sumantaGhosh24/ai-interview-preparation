import {ImageResponse} from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(to right, #0f172a, #1e293b)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: 64,
        fontWeight: 700,
      }}
    >
      <div>AI Powered Interview Preparation Platform</div>
      <div style={{fontSize: 32, marginTop: 20}}>
        The ultimate platform for preparing for your next interview. With
        AI-powered tools and resources, you can confidently prepare for your
        next interview with ease.
      </div>
    </div>,
    {
      ...size,
    },
  );
}
