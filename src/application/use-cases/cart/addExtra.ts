import type { AisleId } from '@domain/aisle';
import { type CartExtra, CartExtraId } from '@domain/cart';
import { ValidationError } from '@domain/shared';
import type { UserId } from '@domain/user';
import type { CartRepository } from '@application/ports/CartRepository';
import type { IdGenerator } from '@application/ports/IdGenerator';

export interface AddExtraInput {
  name: string;
  aisleId: AisleId;
}

export const addExtra =
  (repo: CartRepository, ids: IdGenerator) =>
  async (userId: UserId, input: AddExtraInput): Promise<CartExtra> => {
    if (!input.name.trim()) throw new ValidationError('Nom requis');
    const extra: CartExtra = {
      id: CartExtraId.of(ids.newId()),
      name: input.name.trim(),
      aisleId: input.aisleId,
      checked: false,
    };
    await repo.addExtra(userId, extra);
    return extra;
  };
