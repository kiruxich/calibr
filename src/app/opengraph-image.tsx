import { ImageResponse } from "next/og";
import { SITE } from "@/lib/data/site";

export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "radial-gradient(ellipse at 70% 0%, #2a2208 0%, #0b0b0d 55%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#e0aa4e", fontSize: 30, letterSpacing: 4 }}>
          ◆ ВОСКРЕСЕНСК · МОСКОВСКАЯ ОБЛАСТЬ
        </div>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 800, marginTop: 24, lineHeight: 1.05 }}>
          Школа стрельбы
        </div>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 800, color: "#e0aa4e", lineHeight: 1.05 }}>
          «КАЛИБР»
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#cdd0d6", marginTop: 32, maxWidth: 900 }}>
          Обучение · Охранники · Секции IPSC · Аренда тира 25 м
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 48, fontSize: 28, color: "#9aa0ab" }}>
          <span>★ {SITE.rating.value} ({SITE.rating.count} отзывов)</span>
          <span>·</span>
          <span>Лицензия Рособрнадзора</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
