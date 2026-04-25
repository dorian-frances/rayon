import type { Brand } from '../shared/Brand';

export type AisleId = Brand<string, 'AisleId'>;

export const AisleId = {
  of: (v: string): AisleId => v as AisleId,
};
