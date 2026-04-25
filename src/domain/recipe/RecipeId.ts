import type { Brand } from '../shared/Brand';

export type RecipeId = Brand<string, 'RecipeId'>;

export const RecipeId = {
  of: (v: string): RecipeId => v as RecipeId,
};
