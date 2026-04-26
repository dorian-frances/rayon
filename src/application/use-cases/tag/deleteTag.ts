import type { TagId } from '@domain/tag';
import type { UserId } from '@domain/user';
import type { TagRepository } from '@application/ports/TagRepository';

export const deleteTag =
  (repo: TagRepository) =>
  (userId: UserId, id: TagId): Promise<void> =>
    repo.delete(userId, id);
