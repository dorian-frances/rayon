import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  RealtimeGateway,
  RealtimeHandler,
  RealtimeTable,
} from '@application/ports/RealtimeGateway';
import type { UserId } from '@domain/user';

const TABLES: readonly RealtimeTable[] = [
  'aisles',
  'ingredients',
  'categories',
  'tags',
  'recipes',
  'recipe_ingredients',
  'cart_recipes',
  'cart_items',
  'cart_extras',
] as const;

export class SupabaseRealtimeGateway implements RealtimeGateway {
  constructor(private readonly client: SupabaseClient) {}

  subscribe(userId: UserId, handler: RealtimeHandler): () => void {
    const channel = this.client.channel(`user:${userId}`);

    for (const table of TABLES) {
      // recipe_ingredients n'a pas de user_id direct ; on filtre via RLS côté client.
      const filter =
        table === 'recipe_ingredients' ? undefined : `user_id=eq.${userId}`;
      // The Supabase channel `on()` typings are loose for postgres_changes —
      // we use a small unsafe cast rather than @ts-expect-error so it stays
      // valid even if upstream types change.
      (channel.on as unknown as (
        event: 'postgres_changes',
        opts: { event: string; schema: string; table: string; filter?: string },
        cb: (payload: { eventType: 'INSERT' | 'UPDATE' | 'DELETE' }) => void
      ) => unknown)(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter },
        (payload) => {
          handler({ table, type: payload.eventType });
        }
      );
    }

    channel.subscribe();
    return () => {
      void this.client.removeChannel(channel);
    };
  }
}
