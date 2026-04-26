import type { Tag, TagId } from '@domain/tag';
import type { UserId } from '@domain/user';

export interface TagRepository {
  listByUser(userId: UserId): Promise<Tag[]>;
  create(userId: UserId, tag: Tag): Promise<void>;
  rename(userId: UserId, id: TagId, label: string): Promise<void>;
  delete(userId: UserId, id: TagId): Promise<void>;
}
