import type { IngredientId } from '@domain/ingredient';
import { ValidationError } from '@domain/shared';
import type { UserId } from '@domain/user';
import type { IngredientRepository } from '@application/ports/IngredientRepository';

export const renameIngredient =
  (repo: IngredientRepository) =>
  async (userId: UserId, id: IngredientId, name: string): Promise<void> => {
    if (!name.trim()) throw new ValidationError("Le nom de l'ingrédient ne peut pas être vide");
    await repo.rename(userId, id, name.trim());
  };
