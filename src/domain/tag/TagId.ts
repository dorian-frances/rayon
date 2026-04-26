import type { Brand } from '../shared/Brand';

export type TagId = Brand<string, 'TagId'>;

export const TagId = {
  of: (v: string): TagId => v as TagId,
};
