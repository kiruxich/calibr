"use client";

import dynamic from "next/dynamic";

export const ShopifyHeroScene = dynamic(
  () => import("@/components/three/ShopifyHeroScene").then((m) => m.ShopifyHeroScene),
  { ssr: false },
);

export const ScrollScene3D = dynamic(
  () => import("@/components/three/ShopifyHeroScene").then((m) => m.ScrollScene3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-2xl border border-[var(--border-light)] bg-[var(--bg-elevated)]">
        <p className="text-sm text-[var(--text-muted)]">Загрузка 3D…</p>
      </div>
    ),
  },
);
