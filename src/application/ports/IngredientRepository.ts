import type { AisleId } from '@domain/aisle';
import type { Ingredient, IngredientId } from '@domain/ingredient';
import type { UserId } from '@domain/user';

export interface IngredientRepository {
  listByUser(userId: UserId): Promise<Ingredient[]>;
  create(userId: UserId, ingredient: Ingredient): Promise<void>;
  rename(userId: UserId, id: IngredientId, name: string): Promise<void>;
  move(userId: UserId, id: IngredientId, aisleId: AisleId): Promise<void>;
  delete(userId: UserId, id: IngredientId): Promise<void>;
}
