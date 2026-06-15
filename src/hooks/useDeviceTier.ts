/**
 * useDeviceTier — Performance-aware device tier detection.
 *
 * Returns 'desktop' | 'tablet' | 'mobile' based on screen size,
 * hardware concurrency, and touch capabilities. The tier controls
 * how much 3D complexity the cinematic scroll experience renders.
 */

import { useState, useEffect } from "react";

export type DeviceTier = "desktop" | "tablet" | "mobile";

export interface TierConfig {
  stars: number;
  corridorStars: number;
  galaxyParticles: number;
  shadows: boolean;
  particles: boolean;
  godRays: boolean;
  cameraShake: boolean;
  maxPixelRatio: number;
  campusBuildings: number;
  /** Whether to use full 3D scene transitions or simpler fades */
  fullTransitions: boolean;
  /** Number of connection arcs in the Global Network scene */
  networkArcs: number;
  /** Number of flowing particles along network arcs */
  networkParticles: number;
  /** Whether to render the full 3D AI teacher avatar or use sprite fallback */
  teacherAvatar: boolean;
  /** Detail level for Subject Worlds environments */
  subjectDetail: "full" | "reduced" | "minimal";
  /** Number of nebula cloud sprites in the Cosmos scene */
  nebulaClouds: number;
  /** Number of energy trail particles in the Cosmos scene */
  energyTrails: number;
}

export const TIER_CONFIGS: Record<DeviceTier, TierConfig> = {
  desktop: {
    stars: 9000,
    corridorStars: 7800,
    galaxyParticles: 24000,
    shadows: true,
    particles: true,
    godRays: true,
    cameraShake: true,
    maxPixelRatio: 2,
    campusBuildings: 8,
    fullTransitions: true,
    networkArcs: 30,
    networkParticles: 2000,
    teacherAvatar: true,
    subjectDetail: "full",
    nebulaClouds: 5,
    energyTrails: 1500,
  },
  tablet: {
    stars: 4000,
    corridorStars: 3500,
    galaxyParticles: 12000,
    shadows: false,
    particles: true,
    godRays: false,
    cameraShake: false,
    maxPixelRatio: 1.5,
    campusBuildings: 4,
    fullTransitions: true,
    networkArcs: 15,
    networkParticles: 800,
    teacherAvatar: true,
    subjectDetail: "reduced",
    nebulaClouds: 3,
    energyTrails: 600,
  },
  mobile: {
    stars: 2000,
    corridorStars: 1500,
    galaxyParticles: 6000,
    shadows: false,
    particles: false,
    godRays: false,
    cameraShake: false,
    maxPixelRatio: 1,
    campusBuildings: 1,
    fullTransitions: false,
    networkArcs: 8,
    networkParticles: 0,
    teacherAvatar: false,
    subjectDetail: "minimal",
    nebulaClouds: 0,
    energyTrails: 0,
  },
};

function detectTier(): DeviceTier {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const cores = navigator.hardwareConcurrency || 4;

  // Mobile: narrow screen OR touch device with low cores
  if (width < 768 || (isTouch && width < 1024 && cores <= 4)) {
    return "mobile";
  }

  // Tablet: medium screen with touch, or narrow desktop
  if ((isTouch && width < 1280) || (width >= 768 && width < 1024)) {
    return "tablet";
  }

  // Desktop: wide screen, no touch, or high-core touch device
  return "desktop";
}

/** Check if user prefers reduced motion */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useDeviceTier(): { tier: DeviceTier; config: TierConfig; reducedMotion: boolean } {
  const [tier, setTier] = useState<DeviceTier>(detectTier);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    const handleResize = () => setTier(detectTier());
    window.addEventListener("resize", handleResize);

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handleMotion);

    return () => {
      window.removeEventListener("resize", handleResize);
      mql.removeEventListener("change", handleMotion);
    };
  }, []);

  return { tier, config: TIER_CONFIGS[tier], reducedMotion };
}
