import { Transition, Variants } from 'motion/react';

/**
 * SafeRoute AI — Cohesive Monochrome Motion System
 * 
 * Defines standard transitions, physics presets, and accessible variants
 * designed specifically for high-contrast, distraction-free night navigation.
 */

// Timing tokens
export const DURATION = {
  fast: 0.16,      // 160ms for tap feedback, switches, micro-controls
  standard: 0.24,  // 240ms for screen entries, popovers, tabs
  shell: 0.42,     // 420ms for Phone <-> Fluid geometric morphing
  exit: 0.14       // 140ms for quick unmounting
} as const;

// Transition tokens
export const TRANSITIONS = {
  // Snappy bezier for UI controls
  fast: {
    duration: DURATION.fast,
    ease: [0.16, 1, 0.3, 1]
  } as Transition,

  // Standard smooth bezier for screens and menus
  standard: {
    duration: DURATION.standard,
    ease: [0.16, 1, 0.3, 1]
  } as Transition,

  // Controlled spring for segmented indicators (no bouncy overshoot)
  indicatorSpring: {
    type: 'spring',
    stiffness: 420,
    damping: 34,
    mass: 0.8
  } as Transition,

  // Geometry spring for outer Phone <-> Fluid container morphing
  shellSpring: {
    type: 'spring',
    stiffness: 280,
    damping: 30,
    mass: 1.0
  } as Transition,

  // Instant fallback for prefers-reduced-motion
  reduced: {
    duration: 0.01,
    ease: 'linear'
  } as Transition
};

// Screen navigation variants
export const screenVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
    filter: 'blur(0px)'
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: TRANSITIONS.standard
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: DURATION.exit,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

// Critical safety screen variants (Zero lag, instantaneous readiness)
export const safetyScreenVariants: Variants = {
  initial: {
    opacity: 0.85
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.08,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.08,
      ease: 'easeIn'
    }
  }
};

// Popover menu variants (Screen picker, dropdowns)
export const popoverVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: -6
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: TRANSITIONS.fast
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -4,
    transition: {
      duration: DURATION.exit,
      ease: 'easeIn'
    }
  }
};

// Modal dialog backdrop & content
export const modalBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: TRANSITIONS.fast },
  exit: { opacity: 0, transition: { duration: DURATION.exit } }
};

export const modalContentVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.97,
    y: 8
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: TRANSITIONS.standard
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 6,
    transition: {
      duration: DURATION.exit,
      ease: 'easeIn'
    }
  }
};

// Assistant drawer bottom sheet
export const drawerVariants: Variants = {
  initial: {
    opacity: 0,
    y: 16
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: TRANSITIONS.standard
  },
  exit: {
    opacity: 0,
    y: 14,
    transition: {
      duration: DURATION.exit,
      ease: 'easeIn'
    }
  }
};
