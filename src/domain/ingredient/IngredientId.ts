import type { Brand } from '../shared/Brand';

export type IngredientId = Brand<string, 'IngredientId'>;

export const IngredientId = {
  of: (v: string): IngredientId => v as IngredientId,
};
