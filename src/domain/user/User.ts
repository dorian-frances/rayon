import type { UserId } from './UserId';

export interface User {
  readonly id: UserId;
  readonly email: string;
  readonly displayName?: string;
  readonly avatarUrl?: string;
}
