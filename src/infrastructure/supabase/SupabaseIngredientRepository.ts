import type { SupabaseClient } from '@supabase/supabase-js';
import type { AisleId } from '@domain/aisle';
import { Ingredient, type IngredientId } from '@domain/ingredient';
import type { UserId } from '@domain/user';
import type { IngredientRepository } from '@application/ports/IngredientRepository';
import { Mappers, type IngredientRow } from './mappers';

export class SupabaseIngredientRepository implements IngredientRepository {
  constructor(private readonly db: SupabaseClient) {}

  async listByUser(userId: UserId): Promise<Ingredient[]> {
    const { data, error } = await this.db
      .from('ingredients')
      .select('id, name, aisle_id')
      .eq('user_id', userId);
    if (error) throw error;
    return (data ?? []).map((r) => Mappers.ingredient(r as IngredientRow));
  }

  async create(userId: UserId, ingredient: Ingredient): Promise<void> {
    const { error } = await this.db.from('ingredients').insert({
      id: ingredient.id,
      user_id: userId,
      name: ingredient.name,
      aisle_id: ingredient.aisleId,
    });
    if (error) throw error;
  }

  async rename(_userId: UserId, id: IngredientId, name: string): Promise<void> {
    const { error } = await this.db.from('ingredients').update({ name }).eq('id', id);
    if (error) throw error;
  }

  async move(_userId: UserId, id: IngredientId, aisleId: AisleId): Promise<void> {
    const { error } = await this.db
      .from('ingredients')
      .update({ aisle_id: aisleId })
      .eq('id', id);
    if (error) throw error;
  }

  async delete(_userId: UserId, id: IngredientId): Promise<void> {
    const { error } = await this.db.from('ingredients').delete().eq('id', id);
    if (error) throw error;
  }
}
