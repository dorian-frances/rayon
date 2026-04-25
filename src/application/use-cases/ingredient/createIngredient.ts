import type { AisleId } from '@domain/aisle';
import { Ingredient, IngredientId } from '@domain/ingredient';
import type { UserId } from '@domain/user';
import type { IngredientRepository } from '@application/ports/IngredientRepository';
import type { IdGenerator } from '@application/ports/IdGenerator';

export interface CreateIngredientInput {
  name: string;
  aisleId: AisleId;
}

export const createIngredient =
  (repo: IngredientRepository, ids: IdGenerator) =>
  async (userId: UserId, input: CreateIngredientInput): Promise<Ingredient> => {
    const ing = Ingredient.create({
      id: IngredientId.of(ids.newId()),
      name: input.name,
      aisleId: input.aisleId,
    });
    await repo.create(userId, ing);
    return ing;
  };
