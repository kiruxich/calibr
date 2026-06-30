/**
 * Suppresses the THREE.Clock deprecation warning from @react-three/fiber v9.
 *
 * Replacing THREE.Clock on the three.js namespace fails in Turbopack/ESM
 * ("Attempted to assign to readonly property"). A targeted console.warn filter
 * is safe and keeps the 3D scene working.
 *
 * Import before `@react-three/fiber` (see ShopifyHeroScene.tsx).
 */
const PATCHED = Symbol.for("calibr.three.clock.warn");

function installClockWarnFilter() {
  const g = globalThis as typeof globalThis & { [key: symbol]: boolean };
  if (g[PATCHED]) return;
  g[PATCHED] = true;

  const original = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    const first = args[0];
    if (
      typeof first === "string" &&
      first.includes("THREE.Clock") &&
      first.includes("deprecated")
    ) {
      return;
    }
    original(...args);
  };
}

installClockWarnFilter();

export {};
