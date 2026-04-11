import { Variants } from "motion/react";

/**
 * Institutional Motion System (v2.0)
 * 
 * Defined by high-authority stability and precision.
 * Transition: Cubic-Bezier [0.22, 1, 0.36, 1] (The "Physicist's" Reveal)
 */

export const institutionalTransition: any = {
  ease: [0.22, 1, 0.36, 1],
  duration: 0.8
};

export const institutionalVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      ...institutionalTransition,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      ...institutionalTransition,
      duration: 0.4
    }
  }
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: institutionalTransition
  }
};

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

export const staggerContainer = containerVariants;
