"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (reduce) return <>{children}</>;

  // The home page mounts a heavy WebGPU 3D hero (plus its own entrance
  // animations). Transforming the whole subtree — which contains the canvas —
  // forces it to re-rasterise and stutters the load. Use a cheap, compositor-only
  // opacity fade there, and keep the richer spring for lighter inner pages.
  if (isHome) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 26, scale: 0.992 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 110,
        damping: 20,
        mass: 0.9,
        opacity: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
