import type { IdGenerator } from '@application/ports/IdGenerator';

export class CryptoIdGenerator implements IdGenerator {
  newId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
