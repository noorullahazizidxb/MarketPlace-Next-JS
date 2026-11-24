import type { Transition, Variants } from "framer-motion";

/**
 * Single source of truth for motion across the marketplace.
 * Durations are in seconds; easings are cubic-bezier tuples.
 * Reduced-motion is handled globally by <MotionProvider /> (MotionConfig reducedMotion="user").
 */
export const duration = {
  instant: 0.12,
  fast: 0.18,
  base: 0.28,
  slow: 0.42,
} as const;

export const ease = {
  /** Decelerating curve for things entering the screen. */
  out: [0.22, 1, 0.36, 1],
  /** Accelerating curve for things leaving the screen. */
  in: [0.4, 0, 1, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const spring = {
  /** Snappy spring for shared-layout indicators (tabs, pills, underlines). */
  indicator: { type: "spring", stiffness: 480, damping: 38, mass: 0.8 },
  /** Soft spring for hover / tap feedback. */
  press: { type: "spring", stiffness: 520, damping: 30 },
} as const satisfies Record<string, Transition>;

/** Viewport options for scroll reveals: trigger once, slightly before fully in view. */
export const revealViewport = { once: true, amount: 0.15 } as const;

/** Fade + small rise for a single element revealing on scroll. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.out },
  },
};

/** Parent that staggers its `reveal` children. */
export const revealGroup: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

/** Route-level enter animation (opacity + tiny rise, short enough to never feel blocking). */
export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.out },
  },
};

/** Small swap animation for icons / labels that change in place. */
export const swap: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { duration: duration.fast, ease: ease.out } },
  exit: { opacity: 0, scale: 0.6, transition: { duration: duration.instant, ease: ease.in } },
};

/** Hover / tap micro-interactions for cards and buttons. */
export const hoverLift = { y: -2, transition: spring.press } as const;
export const tapPress = { scale: 0.97 } as const;
