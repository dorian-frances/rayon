import type { Brand } from '../shared/Brand';

export type CategoryId = Brand<string, 'CategoryId'>;

export const CategoryId = {
  of: (v: string): CategoryId => v as CategoryId,
};
