import { ImageResponse } from "next/og";

export const alt = "ClawRecipes — OpenClaw Recipes";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #0b1220 0%, #111827 55%, #1f2937 100%)",
          color: "#f8fafc",
          padding: "56px 64px",
          fontFamily: "Inter, Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "auto -120px -120px auto",
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "rgba(255, 122, 89, 0.18)",
            filter: "blur(12px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "-140px auto auto -120px",
            width: 360,
            height: 360,
            borderRadius: 9999,
            background: "rgba(251, 191, 36, 0.12)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 28,
              color: "#fda4af",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            <span>🦞</span>
            <span>ClawRecipes</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              maxWidth: 920,
            }}
          >
            <div
              style={{
                fontSize: 76,
                fontWeight: 800,
                lineHeight: 1.02,
                letterSpacing: -2,
              }}
            >
              Stop hacking agents.
            </div>
            <div
              style={{
                fontSize: 76,
                fontWeight: 800,
                lineHeight: 1.02,
                letterSpacing: -2,
                color: "#ff7a59",
              }}
            >
              Start cooking with recipes.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              maxWidth: 920,
              fontSize: 30,
              lineHeight: 1.35,
              color: "#cbd5e1",
            }}
          >
            Markdown blueprints build complete OpenClaw teams with shared context,
            workflows, automation, and repeatable shipping.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              fontSize: 24,
              color: "#f8fafc",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "12px 18px",
                borderRadius: 9999,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Shared context
            </div>
            <div
              style={{
                display: "flex",
                padding: "12px 18px",
                borderRadius: 9999,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Team agents
            </div>
            <div
              style={{
                display: "flex",
                padding: "12px 18px",
                borderRadius: 9999,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Automation
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#94a3b8" }}>
            clawkitchen.ai
          </div>
        </div>
      </div>
    ),
    size,
  );
}
