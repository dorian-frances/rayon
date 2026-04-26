import type { Tag } from '@domain/tag';
import type { UserId } from '@domain/user';
import type { TagRepository } from '@application/ports/TagRepository';

export const listTags =
  (repo: TagRepository) =>
  (userId: UserId): Promise<Tag[]> =>
    repo.listByUser(userId);
