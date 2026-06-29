"use client";

import dynamic from "next/dynamic";

export const ShopifyHeroScene = dynamic(
  () => import("@/components/three/ShopifyHeroScene").then((m) => m.ShopifyHeroScene),
  { ssr: false },
);
