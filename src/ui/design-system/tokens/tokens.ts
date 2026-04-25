/**
 * Miroir TypeScript des tokens CSS.
 * Utile pour motion (valeurs numériques en JS) et tout code TS qui a besoin
 * d'un easing/duration sans lire `getComputedStyle`.
 * Ne pas l'importer dans du JSX pour styler — préférer Tailwind + CSS vars.
 */

export const durations = {
  fast: 0.12,
  base: 0.18,
  slow: 0.3,
} as const;

export const easings = {
  out: [0.2, 0.8, 0.2, 1],
  inOut: [0.4, 0, 0.2, 1],
  spring: [0.175, 0.885, 0.32, 1.275],
} as const;

export const radii = {
  xs: 6,
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  pill: 999,
} as const;

export type ThemeName = 'editorial' | 'warm' | 'minimal';

export const themeNames: ThemeName[] = ['editorial', 'warm', 'minimal'];
