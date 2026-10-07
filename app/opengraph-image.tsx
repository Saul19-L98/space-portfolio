import { ImageResponse } from "next/og";
import { systems, universe } from "@/content";

// Required for `output: "export"`: the image is rendered once at build time.
export const dynamic = "force-static";
export const alt = `${universe.profile.name} — ${universe.profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const missions = systems.reduce((n, s) => n + (s.kind === "rich" ? s.planets.length : 0), 0);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "radial-gradient(circle at 70% 40%, #12213d 0%, #03050c 55%)",
          color: "#e6edf7",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {[420, 300, 190, 100].map((r) => (
          <div
            key={r}
            style={{
              position: "absolute",
              left: 840 - r,
              top: 315 - r,
              width: r * 2,
              height: r * 2,
              borderRadius: r,
              border: "1px solid rgba(143,163,199,0.35)",
            }}
          />
        ))}
        <div style={{ position: "absolute", left: 790, top: 265, width: 100, height: 100, borderRadius: 50, background: "#ffe0a8", boxShadow: "0 0 120px 40px rgba(255,215,150,0.55)" }} />
        <div style={{ position: "absolute", left: 1030, top: 290, width: 34, height: 34, borderRadius: 17, background: "#7cc4ff" }} />
        <div style={{ position: "absolute", left: 640, top: 150, width: 22, height: 22, borderRadius: 11, background: "#ff9f6b" }} />
        <div style={{ position: "absolute", left: 1090, top: 470, width: 18, height: 18, borderRadius: 9, background: "#b69bff" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px", width: 640 }}>
          <div style={{ fontSize: 20, letterSpacing: 6, color: "#7cc4ff" }}>{`GALAXY MAP · ${systems.length} STAR SYSTEMS · ${missions} MISSIONS`}</div>
          <div style={{ fontSize: 72, fontWeight: 700, marginTop: 18, lineHeight: 1.05 }}>{universe.profile.name}</div>
          <div style={{ fontSize: 28, marginTop: 14, color: "#c9d4e8" }}>{universe.profile.headline}</div>
          <div style={{ fontSize: 20, marginTop: 28, color: "#8fa3c7" }}>{"Each employer is a star system. Each project is a planet with its own mission record."}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
