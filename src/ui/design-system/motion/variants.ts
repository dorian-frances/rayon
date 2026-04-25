import type { Transition, Variants } from 'motion/react';

export const easeOut: Transition = {
  duration: 0.25,
  ease: [0.2, 0.8, 0.2, 1],
};

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.98 },
};

export const fade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp: Variants = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
};

export const stagger = (delayChildren = 0.04): Variants => ({
  animate: {
    transition: {
      staggerChildren: delayChildren,
    },
  },
});

export const pop: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};
