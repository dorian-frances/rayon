import type { SupabaseClient } from '@supabase/supabase-js';
import type { Recipe, RecipeId } from '@domain/recipe';
import type { UserId } from '@domain/user';
import type { RecipeRepository } from '@application/ports/RecipeRepository';
import { Mappers, recipeStepsToJson, type RecipeWithIngredientsRow } from './mappers';

const SELECT_RECIPE_WITH_INGS =
  'id, name, image, origin, link, categories, steps, created_at, updated_at, recipe_ingredients(ingredient_id, position)';

export class SupabaseRecipeRepository implements RecipeRepository {
  constructor(private readonly db: SupabaseClient) {}

  async listByUser(userId: UserId): Promise<Recipe[]> {
    const { data, error } = await this.db
      .from('recipes')
      .select(SELECT_RECIPE_WITH_INGS)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => Mappers.recipe(r as RecipeWithIngredientsRow));
  }

  async getById(userId: UserId, id: RecipeId): Promise<Recipe | null> {
    const { data, error } = await this.db
      .from('recipes')
      .select(SELECT_RECIPE_WITH_INGS)
      .eq('user_id', userId)
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data ? Mappers.recipe(data as RecipeWithIngredientsRow) : null;
  }

  async upsert(userId: UserId, recipe: Recipe): Promise<void> {
    const { error: upsertErr } = await this.db.from('recipes').upsert({
      id: recipe.id,
      user_id: userId,
      name: recipe.name,
      image: recipe.image,
      origin: recipe.origin,
      link: recipe.link,
      categories: recipe.categories as unknown as string[],
      steps: recipeStepsToJson(recipe.steps),
    });
    if (upsertErr) throw upsertErr;

    // Sync recipe_ingredients : delete then re-insert (idempotent et lisible).
    const { error: delErr } = await this.db
      .from('recipe_ingredients')
      .delete()
      .eq('recipe_id', recipe.id);
    if (delErr) throw delErr;

    if (recipe.ingredients.length > 0) {
      const rows = recipe.ingredients.map((iid, position) => ({
        recipe_id: recipe.id,
        ingredient_id: iid,
        position,
      }));
      const { error: insErr } = await this.db.from('recipe_ingredients').insert(rows);
      if (insErr) throw insErr;
    }
  }

  async delete(_userId: UserId, id: RecipeId): Promise<void> {
    const { error } = await this.db.from('recipes').delete().eq('id', id);
    if (error) throw error;
  }
}
