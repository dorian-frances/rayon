/**
 * Dérive un entier stable à partir d'une chaîne. Utilisé par FoodImage pour
 * choisir un gradient chaud déterministe à partir du nom de la recette.
 */
export function stringHash(input: string): number {
  let n = 0;
  for (let i = 0; i < input.length; i++) {
    n = (n * 31 + input.charCodeAt(i)) >>> 0;
  }
  return n;
}

export const warmPalettes: readonly [string, string][] = [
  ['#E8D5B7', '#C9A87C'],
  ['#E8C9A8', '#B87F4C'],
  ['#F0D4C0', '#D08C5E'],
  ['#D9C7A7', '#9F7E4E'],
  ['#E5C9B0', '#A67852'],
  ['#E8D8C0', '#BA9467'],
  ['#D4B896', '#8B6B3F'],
  ['#EACFB1', '#B27F52'],
] as const;

export function paletteFor(name: string): readonly [string, string] {
  return warmPalettes[stringHash(name) % warmPalettes.length]!;
}

export function angleFor(name: string): number {
  return (stringHash(name) % 7) * 25 + 130;
}

export function foodEmojiFor(name: string): string {
  const n = name.toLowerCase();
  if (/pesto|basilic|gnocchi|pâte|pates|spag/.test(n)) return '🌿';
  if (/tiramisu|café/.test(n)) return '☕';
  if (/moelleux|chocolat|brownie/.test(n)) return '🍫';
  if (/crème|brûlée|vanille/.test(n)) return '🍮';
  if (/burger|frite/.test(n)) return '🍔';
  if (/poulet|pilons|curry/.test(n)) return '🍗';
  if (/cabillaud|saumon|poke|poisson/.test(n)) return '🐟';
  if (/galette|crêpe/.test(n)) return '🥞';
  if (/tartiflette|quiche/.test(n)) return '🥧';
  if (/croque|jambon/.test(n)) return '🥪';
  if (/soba|nouille|wok/.test(n)) return '🍜';
  if (/saucisse|lentille/.test(n)) return '🌭';
  if (/croquant|amande|biscuit/.test(n)) return '🍪';
  if (/salade|légume/.test(n)) return '🥗';
  return '🍽';
}
