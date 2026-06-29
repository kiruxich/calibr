/**
 * Drop-in replacement for deprecated THREE.Clock (r183+).
 * @react-three/fiber v9 still instantiates THREE.Clock internally; this shim
 * removes the console warning while preserving the same API R3F expects.
 *
 * Must be imported before `@react-three/fiber` (see ShopifyHeroScene.tsx).
 */
import * as THREE from "three";

class LegacyClock {
  autoStart: boolean;
  startTime = 0;
  oldTime = 0;
  elapsedTime = 0;
  running = false;

  constructor(autoStart = true) {
    this.autoStart = autoStart;
  }

  start() {
    this.startTime = performance.now();
    this.oldTime = this.startTime;
    this.elapsedTime = 0;
    this.running = true;
  }

  stop() {
    this.getElapsedTime();
    this.running = false;
    this.autoStart = false;
  }

  getElapsedTime() {
    this.getDelta();
    return this.elapsedTime;
  }

  getDelta() {
    let diff = 0;

    if (this.autoStart && !this.running) {
      this.start();
      return 0;
    }

    if (this.running) {
      const newTime = performance.now();
      diff = (newTime - this.oldTime) / 1000;
      this.oldTime = newTime;
      this.elapsedTime += diff;
    }

    return diff;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(THREE as any).Clock = LegacyClock;

export {};
