import type { Brand } from '../shared/Brand';

export type UserId = Brand<string, 'UserId'>;

export const UserId = {
  of: (v: string): UserId => v as UserId,
};
