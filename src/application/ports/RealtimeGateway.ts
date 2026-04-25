import type { UserId } from '@domain/user';

export type RealtimeTable =
  | 'aisles'
  | 'ingredients'
  | 'categories'
  | 'recipes'
  | 'recipe_ingredients'
  | 'cart_recipes'
  | 'cart_items'
  | 'cart_extras';

export type RealtimeEvent = {
  readonly table: RealtimeTable;
  readonly type: 'INSERT' | 'UPDATE' | 'DELETE';
};

export type RealtimeHandler = (event: RealtimeEvent) => void;

export interface RealtimeGateway {
  /**
   * Abonnement aux changements de tables pour l'utilisateur courant.
   * Retourne une fn de désabonnement (coupe le channel Supabase).
   */
  subscribe(userId: UserId, handler: RealtimeHandler): () => void;
}
