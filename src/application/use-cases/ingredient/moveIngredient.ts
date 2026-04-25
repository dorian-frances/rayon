import type { AisleId } from '@domain/aisle';
import type { IngredientId } from '@domain/ingredient';
import type { UserId } from '@domain/user';
import type { IngredientRepository } from '@application/ports/IngredientRepository';

export const moveIngredient =
  (repo: IngredientRepository) =>
  (userId: UserId, id: IngredientId, aisleId: AisleId): Promise<void> =>
    repo.move(userId, id, aisleId);
