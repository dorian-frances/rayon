import type { SupabaseClient } from '@supabase/supabase-js';
import { Category, type CategoryId } from '@domain/category';
import type { UserId } from '@domain/user';
import type { CategoryRepository } from '@application/ports/CategoryRepository';
import { Mappers, type CategoryRow } from './mappers';

export class SupabaseCategoryRepository implements CategoryRepository {
  constructor(private readonly db: SupabaseClient) {}

  async listByUser(userId: UserId): Promise<Category[]> {
    const { data, error } = await this.db
      .from('categories')
      .select('id, label, color')
      .eq('user_id', userId);
    if (error) throw error;
    return (data ?? []).map((r) => Mappers.category(r as CategoryRow));
  }

  async create(userId: UserId, category: Category): Promise<void> {
    const { error } = await this.db.from('categories').insert({
      id: category.id,
      user_id: userId,
      label: category.label,
      color: category.color,
    });
    if (error) throw error;
  }

  async rename(_userId: UserId, id: CategoryId, label: string): Promise<void> {
    const { error } = await this.db.from('categories').update({ label }).eq('id', id);
    if (error) throw error;
  }

  async delete(_userId: UserId, id: CategoryId): Promise<void> {
    const { error } = await this.db.from('categories').delete().eq('id', id);
    if (error) throw error;
  }
}
