import type { AisleId } from '../aisle/AisleId';
import type { Brand } from '../shared/Brand';

export type CartExtraId = Brand<string, 'CartExtraId'>;

export const CartExtraId = {
  of: (v: string): CartExtraId => v as CartExtraId,
};

/**
 * Un article ajouté à la liste de courses hors d'une recette (café, PQ, etc.).
 * Rattaché à un rayon pour apparaître dans la bonne section de la liste.
 */
export interface CartExtra {
  readonly id: CartExtraId;
  readonly name: string;
  readonly aisleId: AisleId;
  readonly checked: boolean;
}
