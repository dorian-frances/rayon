import { Tag, TagId } from '@domain/tag';
import type { UserId } from '@domain/user';
import type { TagRepository } from '@application/ports/TagRepository';
import type { IdGenerator } from '@application/ports/IdGenerator';

export interface CreateTagInput {
  label: string;
}

export const createTag =
  (repo: TagRepository, ids: IdGenerator) =>
  async (userId: UserId, input: CreateTagInput): Promise<Tag> => {
    const tag = Tag.create({ id: TagId.of(ids.newId()), label: input.label });
    await repo.create(userId, tag);
    return tag;
  };
