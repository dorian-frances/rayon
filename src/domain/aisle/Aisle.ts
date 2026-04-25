import { ValidationError } from '../shared/errors';
import type { AisleId } from './AisleId';

/**
 * Un rayon du supermarché : un regroupement d'ingrédients.
 * `position` dicte l'ordre d'apparition dans la liste de courses,
 * calqué sur le parcours physique du supermarché.
 */
export interface Aisle {
  readonly id: AisleId;
  readonly name: string;
  readonly emoji: string;
  readonly position: number;
}

export const Aisle = {
  create(input: { id: AisleId; name: string; emoji?: string; position: number }): Aisle {
    if (!input.name.trim()) {
      throw new ValidationError('Le nom du rayon ne peut pas être vide');
    }
    return {
      id: input.id,
      name: input.name.trim(),
      emoji: input.emoji?.trim() || '🛒',
      position: input.position,
    };
  },
  rename(aisle: Aisle, nextName: string): Aisle {
    if (!nextName.trim()) {
      throw new ValidationError('Le nom du rayon ne peut pas être vide');
    }
    return { ...aisle, name: nextName.trim() };
  },
  setEmoji(aisle: Aisle, emoji: string): Aisle {
    return { ...aisle, emoji: emoji.trim() || aisle.emoji };
  },
  at(aisle: Aisle, position: number): Aisle {
    return { ...aisle, position };
  },
};

export function sortByPosition(aisles: readonly Aisle[]): Aisle[] {
  return [...aisles].sort((a, b) => a.position - b.position);
}
