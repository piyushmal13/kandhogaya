/**
 * IFX Trades — Institutional Motion System (v7.0 Sovereign)
 * Canonical Framer Motion variants for premium, emotionally resonant animations.
 * Replaces ad-hoc opacity fades with a unified animation language.
 */
import type { Variants, Transition } from 'framer-motion';

// ── SHARED BEZIER CURVES ──────────────────────────────────────────────────────
/** Premium cubic-bezier — deceleration mimicking physical momentum */
export const EASE_SOVEREIGN = [0.22, 1, 0.36, 1] as const;
/** Sharper exit curve — content snaps out with authority */
export const EASE_EXIT = [0.4, 0, 1, 1] as const;

// ── CORE TRANSITION PRESETS ───────────────────────────────────────────────────
export const transitionBase: Transition = {
  duration: 0.6,
  ease: EASE_SOVEREIGN,
};

export const transitionFast: Transition = {
  duration: 0.35,
  ease: EASE_SOVEREIGN,
};

export const transitionSlow: Transition = {
  duration: 0.9,
  ease: EASE_SOVEREIGN,
};

// ── STAGGER CONTAINER ─────────────────────────────────────────────────────────
/** Orchestrates staggered children reveals */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

/** Tighter stagger for dense grids */
export const staggerTight: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// ── REVEAL VARIANTS ───────────────────────────────────────────────────────────
/** Standard card/component reveal — lift + fade */
export const institutionalVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: EASE_SOVEREIGN },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.97,
    transition: { duration: 0.35, ease: EASE_EXIT },
  },
};

/** Slide in from left — for timeline/feature entries */
export const slideInFromLeft: Variants = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: EASE_SOVEREIGN },
  },
};

/** Slide in from right */
export const slideInFromRight: Variants = {
  hidden: { x: 60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: EASE_SOVEREIGN },
  },
};

/** Fade up — minimal, clean reveal for text */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_SOVEREIGN },
  },
};

/** Scale reveal — for badges, pills, icons */
export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: EASE_SOVEREIGN },
  },
};

// ── CONTINUOUS ANIMATIONS ─────────────────────────────────────────────────────
/** Glow pulse for CTAs and live indicators */
export const glowPulse = {
  initial: { boxShadow: '0 0 0px rgba(88, 242, 182, 0)' },
  animate: {
    boxShadow: [
      '0 0 0px rgba(88, 242, 182, 0)',
      '0 0 24px rgba(88, 242, 182, 0.45)',
      '0 0 0px rgba(88, 242, 182, 0)',
    ],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

/** Float animation — for hero imagery or floating badges */
export const floatAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};
